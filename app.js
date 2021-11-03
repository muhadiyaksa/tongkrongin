if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const ejs = require("ejs");
const expressLayouts = require("express-ejs-layouts");

const { body, validationResult, check } = require("express-validator");
const methodOverride = require("method-override");

const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("express-flash");

const bcrypt = require("bcrypt");
const passport = require("passport");

require("./utils/db");
const User = require("./model/user");
// const user = async () => {
//   return await User.find();
// };

const initializePassport = require("./passport-config");
initializePassport(
  passport,
  async (email) => await User.findOne({ email: email }),
  async (id) => await User.findOne({ id: id })
);

//Menjalankan Server
const app = express();
const port = 3000;

//Reset delimeter dari % ke ? (supaya mirip PHP)
ejs.delimiter = "?";

//Penggunaan EJS
app.set("view engine", "html");
app.engine("html", ejs.renderFile);

app.use(expressLayouts); //Third-party middleware
app.use(express.static("public")); //Built in middleware
app.use(express.urlencoded({ extended: true })); //Built In Middleware

//konfigurasi flash
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(flash());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

//Menu Home
app.get("/", checkNotAuthenticatedSecond, (req, res) => {
  res.render("index", {
    layout: "layouts/main-layout-primary",
    title: "Tongkrongin",
    dataUser: null,
  });
});
app.get("/home", checkAuthenticated, async (req, res) => {
  const dataUser = await req.user;
  res.render("index", {
    layout: "layouts/main-layout-primary",
    title: "Tongkrongin",
    dataUser,
  });
});
// app.get("/user/:iduser", async (req, res) => {
app.get("/user", async (req, res) => {
  const dataUser = await req.user;
  // const contact = await Contact.findOne({ nama: req.params.iduser });
  res.render("user-profile", {
    title: "Halaman User",
    layout: "layouts/main-layout-user",
    dataUser,
    msg: req.flash("msg"),
  });
});

app.get("/user/update", async (req, res) => {
  // const contact = await Contact.findOne({ nama: req.params.iduser });
  const dataUser = await req.user;
  res.render("user-update", {
    title: "Halaman Update",
    layout: "layouts/main-layout-user",
    dataUser,
  });
});

//Proses Ubah Data
app.put("/user/update", [check("email", "Email tidak Valid!").isEmail(), check("notelp", "Nomor Handphone Tidak Valid!").isMobilePhone("id-ID")], async (req, res) => {
  const errors = validationResult(req);
  const dataUser = await req.user;
  if (!errors.isEmpty()) {
    res.render("user-update", {
      title: "Halaman Update",
      layout: "layouts/main-layout-user",
      errors: errors.array(),
      contact: req.body,
      dataUser,
    });
  } else {
    User.updateOne(
      { id: req.body.id },
      {
        $set: {
          nama: req.body.nama,
          email: req.body.email,
          notelp: req.body.notelp,
          password: req.body.password,
          passwordChecked: req.body.passwordChecked,
          jeniskelamin: req.body.jeniskelamin,
          kota: req.body.kota,
        },
      }
    ).then((result) => {
      req.flash("msg", "Data kamu Berhasil diUbah! ");
      res.redirect("/user");
    });
  }
});

app.get("/user/password", async (req, res) => {
  const dataUser = await req.user;
  // const contact = await Contact.findOne({ nama: req.params.iduser });
  res.render("user-password", {
    title: "Halaman User",
    layout: "layouts/main-layout-user",
    dataUser,
  });
});

//Halaman Cafe
app.get("/cafe", async (req, res) => {
  const dataUser = await req.user;
  res.render("cafe", {
    layout: "layouts/main-layout-list",
    title: "List Cafe",
    dataUser,
  });
});

//Halaman Cafe Details (SEMENTARA)
app.get("/cafe/details", async (req, res) => {
  // const contact = findContact(req.params.nama);
  const dataUser = await req.user;
  res.render("cafe-details", {
    layout: "layouts/main-layout-list",
    title: "Detail Cafe",
    dataUser,
  });
});

//Halaman Pesan
app.get("/cafe/details/food", checkAuthenticated, async (req, res) => {
  // const contact = findContact(req.params.nama);
  const dataUser = await req.user;
  res.render("cafe-food", {
    layout: "layouts/main-layout-list",
    title: "Detail Food",
    dataUser,
  });
});

//Halaman Keranjang
app.get("/cart", async (req, res) => {
  const dataUser = await req.user;
  res.render("keranjang", {
    layout: "layouts/main-layout-list",
    title: "Keranjang",
    dataUser,
  });
});

app.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("login", {
    layout: "layouts/main-layout-login",
    title: "Login",
    msg: req.flash("msg"),
  });
});

//Form Login
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

//Halaman Menuju Form Regist
app.get("/regist", checkNotAuthenticated, (req, res) => {
  res.render("regist", {
    layout: "layouts/main-layout-login",
    title: "Regist",
  });
});

//Proses Tambah Data user
app.post(
  "/regist",

  [
    body("email").custom(async (value) => {
      const duplikat = await User.findOne({ email: value });
      if (duplikat) {
        throw new Error("Email Sudah Pernah DiDaftarkan!");
      }
      return true;
    }),
    check("email", "Email tidak Valid!").isEmail(),
    check("notelp", "Nomor Handphone Tidak Valid!").isMobilePhone("id-ID"),
    body("password").isLength({ min: 5 }),
    body("passwordChecked").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Konfirmasi Password tidak sama dengan Password Utama");
      }
      return true;
    }),
  ],
  checkNotAuthenticated,
  async (req, res) => {
    //tulisan dalam ('email') harus sama persis dengan name(di html)

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("regist", {
        title: "Regist",
        layout: "layouts/main-layout-login",
        errors: errors.array(),
      });
    } else {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const hashedPasswordChecked = await bcrypt.hash(req.body.passwordChecked, 10);
      const dataMasuk = {
        id: Date.now().toString(),
        nama: req.body.nama.toLowerCase(),
        email: req.body.email,
        notelp: req.body.notelp,
        password: hashedPassword,
        passwordChecked: hashedPasswordChecked,
      };
      User.insertMany(dataMasuk, (error, result) => {
        req.flash("msg", "Pendaftaran Berhasil, Silahkan Login Terlebih Dahulu");
        res.redirect("/login");
      });
    }
  }
);

app.delete("/logout", (req, res) => {
  req.logOut();
  res.redirect("/login");
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/home");
  }
  next();
}

function checkNotAuthenticatedSecond(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}

//Menjalankan LocalHost
app.listen(port, () => {
  console.log(`Tongkrongin App | Listening at http://localhost:${port}`);
});

// app.get("/cafe", (req, res) => {
//   res.render("cafe", {
//     layout: "layouts/main-layout-list",
//     title: "List Cafe",
//   });
// });

// app.get("/cafe/details", (req, res) => {
//   // const contact = findContact(req.params.nama);

//   res.render("cafe-details", {
//     layout: "layouts/main-layout-list",
//     title: "Detail Cafe",
//   });
// });

// app.get("/chart", (req, res) => {
//   // const contact = findContact(req.params.nama);

//   res.render("keranjang", {
//     layout: "layouts/main-layout-list",
//     title: "Keranjang",
//   });
// });

// app.get("/chart/checkout", (req, res) => {
//   // const contact = findContact(req.params.nama);

//   res.render("pay", {
//     layout: "layouts/main-layout-list",
//     title: "Checkout",
//   });
// });

// app.get("/cafe/details/food", (req, res) => {
//   // const contact = findContact(req.params.nama);

//   res.render("cafe-food", {
//     layout: "layouts/main-layout-list",
//     title: "Detail Food",
//   });
// });

//Proses Login User
// app.post(
//   "/",
//   checkNotAuthenticated,
//   [
//     body("email").custom(async (value, { req }) => {
//       const valueEmail = await User.findOne({ email: value, password: req.body.password });
//       if (!valueEmail) {
//         throw new Error("Email Belum Terdaftar!");
//       }
//       return true;
//     }),
//     check("email", "Email tidak Valid!").isEmail(),
//   ],
//   (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       res.render("login", {
//         title: "Login",
//         layout: "layouts/main-layout-login",
//         errors: errors.array(),
//       });
//     } else {
//       req.flash("msg", "Login Succesfully!");
//       req.session.user = req.body.email;
//       res.redirect("/");
//     }
//   }
// );
