if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const ejs = require("ejs");
const expressLayouts = require("express-ejs-layouts");
const upload = require("express-fileupload");

const { body, validationResult, check } = require("express-validator");
const methodOverride = require("method-override");

const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("express-flash");
// const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const passport = require("passport");

// const formidable = require("formidable");
const fs = require("fs");
const busboy = require("connect-busboy");
// const mv = require("mv");

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
app.use(upload());
app.use(busboy());
// app.use(express.bodyParser());

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

app.get("/user/:id", async (req, res) => {
  const user = await User.findOne({ id: req.params.id });
  const dataUser = await req.user;
  res.render("user-profile", {
    title: "Halaman User",
    layout: "layouts/main-layout-user",
    user,
    dataUser,
    msg: req.flash("msg"),
  });
});

//Menuju Halaman Edit Profle
app.get("/user/update/:id", async (req, res) => {
  const user = await User.findOne({ id: req.params.id });
  const dataUser = await req.user;
  res.render("user-update", {
    title: "Halaman Update",
    layout: "layouts/main-layout-user",
    user,
    dataUser,
  });
});

app.get("/foto", async (req, res) => {
  const dataUser = await req.user;
  res.render("coba", {
    title: "Halaman Coba",
    layout: "layouts/main-layout-user",
    dataUser,
  });
});

app.post("/foto", (req, res) => {
  const namaFile = req.files.file.name;
  if (req.files.file) {
    var file = req.files.file;
    var fileName = file.name;

    file.mv(__dirname + "/public/img/user/" + fileName, function (err) {
      if (err) {
        res.send(err);
      } else {
        req.flash("msg", "Data kamu Berhasil diUbah! ");
        res.redirect("/user/" + req.body.id);
      }
    });
  }
});

//Proses Ubah Data
app.put("/user/update", [check("notelp", "Nomor Handphone Tidak Valid!").isMobilePhone("id-ID")], async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.render("user-update", {
      title: "Halaman Update",
      layout: "layouts/main-layout-user",
      errors: errors.array(),
      user: req.body,
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
          fotoprofil: req.body.filetoupload,
        },
      }
    ).then((result) => {
      req.flash("msg", "Data kamu Berhasil diUbah! ");
      res.redirect("/user/" + req.body.id);
    });
  }
});

//Menuju Halaman Edit Password
app.get("/user/password/:id", async (req, res) => {
  const user = await User.findOne({ id: req.params.id });
  const dataUser = await req.user;
  res.render("user-password", {
    title: "Halaman Update",
    layout: "layouts/main-layout-user",
    user,
    dataUser,
  });
});

//Proses Ubah Data
app.put(
  "/user/password",
  check("password").isLength({ min: 8 }).withMessage("Minimal Panjang Karakter adalah 8").matches(/\d/).withMessage("Harus Berisi Nomor"),
  body("passwordChecked").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Konfirmasi Password tidak sama dengan Password Utama");
    }
    return true;
  }),
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("user-password", {
        title: "Halaman Password",
        layout: "layouts/main-layout-user",
        errors: errors.array(),
        user: req.body,
      });
    } else {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const hashedPasswordChecked = await bcrypt.hash(req.body.passwordChecked, 10);
      User.updateOne(
        { id: req.body.id },
        {
          $set: {
            nama: req.body.nama,
            email: req.body.email,
            notelp: req.body.notelp,
            password: hashedPassword,
            passwordChecked: hashedPasswordChecked,
          },
        }
      ).then((result) => {
        req.flash("msg", "Password kamu Berhasil diUbah! ");
        res.redirect("/user/" + req.body.id);
      });
    }
  }
);

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
    check("password").isLength({ min: 8 }).withMessage("Password Minimal Karakter adalah 8").matches(/\d/).withMessage("Password Harus Berisi Nomor"),
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
      // const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const hashedPasswordChecked = await bcrypt.hash(req.body.passwordChecked, 10);
      const dataMasuk = {
        id: Date.now().toString(),
        nama: req.body.nama.toLowerCase(),
        email: req.body.email,
        notelp: req.body.notelp,
        password: req.body.password,
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
