if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

//For Express
const express = require("express");
const ejs = require("ejs");
const expressLayouts = require("express-ejs-layouts");

//For Validation
// const upload = require("express-fileupload");
const { body, validationResult, check } = require("express-validator");
const methodOverride = require("method-override");
const { unlinkSync } = require("fs");

//For Message
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("express-flash");
const bcrypt = require("bcrypt");
const passport = require("passport");
const busboy = require("connect-busboy");

//For Schema Database
require("./utils/db");
const User = require("./model/user");
const Cafe = require("./model/cafe");
const Capacity = require("./model/capacity");
const FormCapacity = require("./model/form-capacity");
const Food = require("./model/food");
const FormFood = require("./model/form-food");
const Checkout = require("./model/checkout");

//For Photo Upload
const bodyParser = require("body-parser");

//For Regist
const initializePassport = require("./passport-config");
initializePassport(
  passport,
  async (email) => await User.findOne({ email: email }),
  async (id) => await User.findOne({ id: id })
);

//For Function
const { checkedDuplicate, returnNoDuplicate, changeDateFormat } = require("./utils/func");
const { upload, imageFileName } = require("./utils/gridFs");

//Running Server
const app = express();
const port = 3000;

//Reset delimeter dari % ke ? (supaya mirip PHP)
ejs.delimiter = "?";

//Penggunaan EJS
app.set("view engine", "html");
app.engine("html", ejs.renderFile);

//Use Express
app.use(expressLayouts); //Third-party middleware
app.use(express.static("public")); //Built in middleware
app.use(express.urlencoded({ extended: true })); //Built In Middleware
app.use(busboy());

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

//For Passport
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));
app.use(bodyParser.json());

//Landing Page
app.get("/", checkNotAuthenticatedSecond, async (req, res) => {
  const caves = await Cafe.find();

  res.render("index", {
    layout: "layouts/main-layout-primary",
    title: "Tongkrongin",
    formCapacities: null,
    dataUser: null,
    caves,
  });
});

//Home Page
app.get("/home", checkAuthenticated, async (req, res) => {
  const dataUser = await req.user;
  const caves = await Cafe.find();

  if (dataUser) {
    formCapacities = await FormCapacity.findOne({ idUser: dataUser.id, status: "pending" });
  }
  res.render("index", {
    layout: "layouts/main-layout-primary",
    title: "Tongkrongin",
    dataUser,
    caves,
    formCapacities,
  });
});

//Halaman User
app.get("/user/:id", checkAuthenticated, async (req, res) => {
  const user = await User.findOne({ id: req.params.id });
  const formCheckout = await Checkout.find({ idUser: req.params.id });

  const dataUser = await req.user;
  let caves = [];
  let formCap = [];
  if (dataUser) {
    formCapacities = await FormCapacity.findOne({ idUser: dataUser.id, status: "pending" });

    for (let i = 0; i < formCheckout.length; i++) {
      try {
        let cafe = await Cafe.find({ idCafe: formCheckout[i].idCafe });
        let formCapacity = await FormCapacity.find({ idCafe: formCheckout[i].idCafe, idUser: dataUser.id });
        if (cafe && formCapacity) {
          caves.push(...cafe);
          formCap.push(...formCapacity);
        }
      } catch (err) {
        if (err) throw err;
      }
    }
  }
  console.log(formCap);
  res.render("user-profile", {
    title: "Halaman User",
    layout: "layouts/main-layout-user",
    user,
    dataUser,
    msg: req.flash("msg"),
    formCapacities,
    formCap,
    formCheckout,
    caves,
  });
});

//Menuju Halaman Edit Profle
app.get("/user/update/:id", checkAuthenticated, async (req, res) => {
  const user = await User.findOne({ id: req.params.id });
  const dataUser = await req.user;
  if (dataUser) {
    formCapacities = await FormCapacity.findOne({ idUser: dataUser.id, status: "pending" });
  }
  res.render("user-update", {
    title: "Halaman Update",
    layout: "layouts/main-layout-user",
    user,
    dataUser,
    msg: req.flash("msg"),
    formCapacities,
  });
});

app.post("/foto", (req, res) => {
  if (req.files.file) {
    var file = req.files.file;
    const filePhoto = Math.floor(Math.random() * 12399);
    var fileName = "user" + filePhoto + file.name;

    file.mv(__dirname + "/public/img/user/" + fileName, function (err) {
      if (err) {
        res.send(err);
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
              fotoprofil: fileName,
              fotoprofilLama: req.body.fotoprofilLama,
            },
          }
        ).then((result) => {
          unlinkSync(__dirname + "/public/img/user/" + req.body.fotoprofilLama);
          req.flash("msg", "Foto Profil kamu Berhasil diUbah! ");
          res.redirect("/user/update/" + req.body.id);
        });
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
app.get("/user/password/:id", checkAuthenticated, async (req, res) => {
  const user = await User.findOne({ id: req.params.id });
  const dataUser = await req.user;
  if (dataUser) {
    formCapacities = await FormCapacity.findOne({ idUser: dataUser.id, status: "pending" });
  }
  res.render("user-password", {
    title: "Halaman Update",
    layout: "layouts/main-layout-user",
    user,
    dataUser,
    formCapacities,
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
  const caves = await Cafe.find();
  let formCapacities;
  if (dataUser) {
    formCapacities = await FormCapacity.findOne({ idUser: dataUser.id, status: "pending" });
  }
  res.render("cafe", {
    layout: "layouts/main-layout-list",
    title: "List Cafe",
    dataUser,
    caves,
    formCapacities,
  });
});

app.post("/cafe", async (req, res) => {
  var caves;
  if (req.body.kota == "semua") {
    caves = await Cafe.find();
  } else {
    caves = await Cafe.find({ kategori: req.body.kota });
  }
  const dataUser = await req.user;
  if (caves) {
    res.render("cafe", {
      layout: "layouts/main-layout-list",
      title: "List Cafe",
      dataUser,
      caves,
    });
  }
});

//Halaman Cafe Details (SEMENTARA)
app.get("/cafe/details/:id", async (req, res) => {
  const caves = await Cafe.findOne({ idCafe: req.params.id });
  const capacities = await Capacity.find({ idCafe: req.params.id });
  const dataUser = await req.user;
  let formCapacities, formFoods, formCheckout;

  if (dataUser) {
    formCapacities = await FormCapacity.findOne({ idUser: dataUser.id, status: "pending" });
    if (formCapacities) {
      formFoods = await FormFood.find({ idCafe: formCapacities.idCafe, idUser: formCapacities.idUser, status: "pending" });
    }
  } else {
    formCapacities = null;
  }

  res.render("cafe-details", {
    layout: "layouts/main-layout-booking",
    title: "Detail Cafe",
    dataUser,
    caves,
    capacities,
    formCapacities,
    formFoods,
  });
});

app.post("/cafe/details", async (req, res) => {
  const capacities = await Capacity.findOne({ idCafe: req.body.idcafe, kapKategori: req.body.kapkategori });
  const formFoods = await FormFood.find({ idCafe: req.body.idcafe, idUser: req.body.iduser, status: "pending" });

  const dataMasuk = {
    idCafe: req.body.idcafe,
    idUser: req.body.iduser,
    kapKategori: req.body.kapkategori,
    namaPemesan: req.body.namapemesan.toLowerCase(),
    waktu: req.body.tanggalpesan,
    tanggalPesan: changeDateFormat(req.body.tanggalpesan),
    jamPesan: req.body.jampesan,
    harga: capacities.harga,
    status: "pending",
  };

  if (req.body.kapkategorilama) {
    FormCapacity.deleteOne({ idUser: req.body.iduser, status: "pending" }).then((result) => {
      if (formFoods) {
        FormFood.deleteMany({ idUser: req.body.iduser, status: "pending" }).then((error, result) => {
          FormCapacity.insertMany(dataMasuk, (error, result) => {
            res.redirect("/cafe/food/" + req.body.idcafe);
          });
        });
      } else {
        FormCapacity.insertMany(dataMasuk, (error, result) => {
          res.redirect("/cafe/food/" + req.body.idcafe);
        });
      }
    });
  } else {
    FormCapacity.insertMany(dataMasuk, (error, result) => {
      res.redirect("/cafe/food/" + req.body.idcafe);
    });
  }
});

//Halaman Pesan
app.get("/cafe/food/:idCafe", checkAuthenticated, async (req, res) => {
  const foods = await Food.find({ idCafe: req.params.idCafe });
  const dataUser = await req.user;
  let formCapacities, formFoods, idMenuFood, idMenuForm;
  if (dataUser) {
    formCapacities = await FormCapacity.findOne({ idUser: dataUser.id, status: "pending" });
    if (formCapacities) {
      formFoods = await FormFood.find({ idCafe: formCapacities.idCafe, idUser: dataUser.id, status: "pending" });

      idMenuFood = foods.map((el) => el.idMenu);
      idMenuForm = formFoods.map((el) => el.idMenu);
    }
  } else {
    formCapacities = null;
  }

  let idMix = [...idMenuFood, ...idMenuForm];
  let formFoodsResult = idMix.sort((a, b) => a - b);

  let noDuplicate = checkedDuplicate(formFoodsResult);
  let hslFormFoods = noDuplicate.map((el) => foods.find((food) => food.idMenu == el));

  res.render("cafe-food", {
    layout: "layouts/main-layout-booking",
    title: "Detail Food",
    dataUser,
    foods,
    formCapacities,
    formFoods,
    hslFormFoods,
  });
});

app.post("/cafe/food", async (req, res) => {
  const dataUser = await req.user;
  const formFoods = await FormFood.find({ idUser: dataUser.id, status: "pending" });

  let arrIDMenu = formFoods.map((el) => el.idMenu);

  function datamasuk(el) {
    return {
      idCafe: req.body.idcafe[el],
      idUser: req.body.iduser[el],
      idMenu: req.body.idmenu[el],
      quantity: req.body.quantity[el],
      harga: req.body.harga[el],
      status: "pending",
    };
  }

  const dataMasuk = {
    idCafe: req.body.idcafe,
    idUser: req.body.iduser,
    idMenu: req.body.idmenu,
    quantity: req.body.quantity,
    harga: req.body.harga,
    status: "pending",
  };

  let reqIDMenu;
  let lengthIDMenu = [];
  let dataReq = [];
  let moreReqIDMenu = [];
  try {
    reqIDMenu = [req.body.idmenu];

    reqIDMenu.forEach((el) => {
      let len = [];
      el.forEach((item) => {
        len.push(item);
      });
      lengthIDMenu = [...len];
    });

    for (let i = 0; i < lengthIDMenu.length; i++) {
      let hsl = datamasuk(i);
      dataReq.push(hsl);
      moreReqIDMenu.push(dataReq[i].idMenu);
    }
  } catch {
    reqIDMenu = [req.body.idmenu];
  }

  let oneData = [...arrIDMenu, ...reqIDMenu].sort((a, b) => a - b);
  let moreData = [...arrIDMenu, ...moreReqIDMenu].sort((a, b) => a - b);

  if (lengthIDMenu.length > 1 && reqIDMenu.length === 1) {
    try {
      if (returnNoDuplicate(moreData).length === 0) {
        FormFood.insertMany(dataReq);
        res.redirect("/cart");
      } else {
        res.redirect("/cart");
      }
    } catch (e) {
      console.error(e);
    }
  } else if (lengthIDMenu.length === 0 && reqIDMenu.length === 1) {
    if (returnNoDuplicate(oneData).length === 0) {
      FormFood.insertMany(dataMasuk, (error, result) => {
        res.redirect("/cart");
      });
    } else {
      res.redirect("/cart");
    }
  } else {
    res.redirect("/cart");
  }
});

//Halaman Keranjang
app.get("/cart", checkAuthenticated, async (req, res) => {
  const dataUser = await req.user;

  let formCapacities, formFoods, capacities, foods, caves;

  if (dataUser) {
    formCapacities = await FormCapacity.findOne({ idUser: dataUser.id, status: "pending" });
    if (formCapacities) {
      formFoods = await FormFood.find({ idCafe: formCapacities.idCafe, idUser: dataUser.id, status: "pending" });
      foods = await Food.find({ idCafe: formCapacities.idCafe });
      caves = await Cafe.findOne({ idCafe: formCapacities.idCafe });
      capacities = await Capacity.findOne({ idCafe: formCapacities.idCafe, idUser: req.user.id, kapKategori: formCapacities.kapKategori });
    }
  } else {
    formCapacities = null;
  }

  res.render("keranjang", {
    layout: "layouts/main-layout-cart",
    title: "Keranjang",
    formFoods,
    formCapacities,
    dataUser,
    capacities,
    foods,
    caves,
  });
});

app.delete("/cart", (req, res) => {
  FormCapacity.deleteOne({ idUser: req.body.iduser, status: "pending" }).then((result) => {
    FormFood.deleteMany({ idUser: req.body.iduser, status: "pending" }).then((error, result) => {
      res.redirect("/cart");
    });
  });
});

app.delete("/cart/food", (req, res) => {
  FormFood.deleteOne({ idUser: req.body.iduser, idMenu: req.body.idmenu, idCafe: req.body.idcafe, status: "pending" }).then((error, result) => {
    res.redirect("/cart");
  });
});

app.put("/cart/qtymin", async (req, res) => {
  let formFoods = await FormFood.findOne({ idCafe: req.body.idcafe, idUser: req.body.iduser, idMenu: req.body.idmenu, status: "pending" });
  let foods = await Food.findOne({ idCafe: req.body.idcafe, idMenu: req.body.idmenu, status: "pending" });

  let qtyUpdate = Number(formFoods.quantity) - 1;
  let priceUpdate = Number(formFoods.harga) - Number(foods.harga);

  FormFood.updateOne(
    {
      idUser: req.body.iduser,
      idCafe: req.body.idcafe,
      idMenu: req.body.idmenu,
    },
    {
      $set: {
        quantity: qtyUpdate.toString(),
        harga: priceUpdate.toString(),
      },
    }
  ).then((result) => {
    res.redirect("/cart");
  });
});

app.put("/cart/qtyplus", async (req, res) => {
  let formFoods = await FormFood.findOne({ idCafe: req.body.idcafe, idUser: req.body.iduser, idMenu: req.body.idmenu, status: "pending" });
  let foods = await Food.findOne({ idCafe: req.body.idcafe, idMenu: req.body.idmenu, status: "pending" });

  let qtyUpdate = Number(formFoods.quantity) + 1;
  let priceUpdate = Number(formFoods.harga) + Number(foods.harga);

  FormFood.updateOne(
    {
      idUser: req.body.iduser,
      idCafe: req.body.idcafe,
      idMenu: req.body.idmenu,
    },
    {
      $set: {
        quantity: qtyUpdate.toString(),
        harga: priceUpdate.toString(),
      },
    }
  ).then((result) => {
    res.redirect("/cart");
  });
});

app.post("/cart", async (req, res) => {
  const dataOldCart = await Checkout.find({ idUser: req.body.iduser, idCafe: req.body.idcafe, status: "pending" });
  let tahun = new Date().getFullYear();
  let bulan = new Date().getMonth();
  let tanggal = new Date().getDate();

  const dataMasuk = {
    idUser: req.body.iduser,
    idCafe: req.body.idcafe,
    idMenu: req.body.idmenu.split(","),
    catatan: req.body.catatan,
    total: req.body.total,
    tanggalPesan: changeDateFormat([tahun, bulan, tanggal].join("-")),
    jamPesan: `${new Date().getHours()}:${new Date().getMinutes()}`,
    status: "pending",
  };
  if (dataOldCart.length !== 0 || dataOldCart !== null) {
    Checkout.deleteMany({ idUser: req.body.iduser, status: "pending" }).then((result) => {
      Checkout.insertMany(dataMasuk, (error, result) => {
        if (error) throw error;
        res.redirect("/pay");
      });
    });
  } else {
    Checkout.insertMany(dataMasuk, (error, result) => {
      if (error) throw error;
      res.redirect("/pay");
    });
  }
});

app.get("/pay", checkAuthenticated, async (req, res) => {
  const dataUser = await req.user;
  let formCheckout = await Checkout.findOne({ idUser: dataUser.id, status: "pending" });
  let formFoods = [];
  let foods = [];

  let formCapacities, caves;
  if (formCheckout) {
    formCapacities = await FormCapacity.findOne({ idUser: formCheckout.idUser, status: "pending" });
    caves = await Cafe.findOne({ idCafe: formCheckout.idCafe });
    for (let i = 0; i < formCheckout.idMenu.length; i++) {
      try {
        let formFood = await FormFood.find({ idCafe: formCheckout.idCafe, idUser: dataUser.id, idMenu: formCheckout.idMenu[i], status: "pending" });
        let food = await Food.find({ idCafe: formCheckout.idCafe, idMenu: formCheckout.idMenu[i] });
        if (food && formFood) {
          formFoods.push(...formFood);
          foods.push(...food);
        }
      } catch (err) {
        if (err) throw err;
      }
    }
  }

  res.render("pay", {
    layout: "layouts/main-layout-pay",
    title: "Form Pembayaran",
    dataUser,
    formCheckout,
    formFoods,
    foods,
    formCapacities,
    caves,
  });
});

app.put("/pay", upload.single("file"), async (req, res) => {
  let tahunIni = new Date().getFullYear();
  let bulanIni = new Date().getMonth();
  let tanggalIni = new Date().getDate();
  let jamIni = new Date().getHours();
  let menitIni = new Date().getMinutes();
  let jamBayar = `${jamIni.length == 1 ? `0${jamIni}` : jamIni}:${menitIni.length == 1 ? `0${menitIni}` : menitIni}`;
  let idCafe = req.body.idcafe;
  let idUser = req.body.iduser;
  let jumlahCheckout = await Checkout.find({ idUser: req.body.iduser });

  const invoice = ["INV", `${tahunIni}${bulanIni}${tanggalIni}`, jumlahCheckout.length, idCafe, idUser].join("/");

  Checkout.updateOne(
    {
      idUser: req.body.iduser,
      idCafe: req.body.idcafe,
      status: "pending",
    },
    {
      $set: {
        kodeInv: invoice,
        tanggalBayar: changeDateFormat([tahunIni, bulanIni, tanggalIni].join("-")),
        jamBayar: jamBayar,
        status: "waiting",
        fileImage: imageFileName[0],
        namaBank: req.body.namaBank,
        nomorRekening: req.body.nomorRekening,
        namaRekening: req.body.namaRekening,
      },
    }
  ).then((result) => {
    FormCapacity.updateOne(
      {
        idUser: req.body.iduser,
        idCafe: req.body.idcafe,
        status: "pending",
      },
      {
        $set: {
          status: "waiting",
        },
      }
    ).then((result) => {
      FormFood.updateMany(
        {
          idUser: req.body.iduser,
          idCafe: req.body.idcafe,
          status: "pending",
        },
        {
          $set: {
            status: "waiting",
          },
        }
      ).then((result) => {
        res.redirect("/invoice");
      });
    });
  });
});

app.get("/invoice", async (req, res) => {
  const dataUser = await req.user;
  let formCheckout = await Checkout.findOne({ idUser: dataUser.id, status: "waiting" });

  let formFoods = [];
  let foods = [];

  let formCapacities, caves;
  if (formCheckout) {
    formCapacities = await FormCapacity.findOne({ idUser: formCheckout.idUser });
    caves = await Cafe.findOne({ idCafe: formCheckout.idCafe });
    for (let i = 0; i < formCheckout.idMenu.length; i++) {
      try {
        let formFood = await FormFood.find({ idCafe: formCheckout.idCafe, idUser: dataUser.id, idMenu: formCheckout.idMenu[i] });
        let food = await Food.find({ idCafe: formCheckout.idCafe, idMenu: formCheckout.idMenu[i] });
        if (food && formFood) {
          formFoods.push(...formFood);
          foods.push(...food);
        }
      } catch (err) {
        if (err) throw err;
      }
    }
  }

  res.render("invoice", {
    layout: "layouts/main-layout-pay",
    title: "Kode Invoice",
    dataUser,
    formCheckout,
    formFoods,
    foods,
    formCapacities,
    caves,
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

//Halaman User
app.get("/about", async (req, res) => {
  const dataUser = await req.user;
  const caves = await Cafe.find();

  let formCapacities;
  if (dataUser) {
    formCapacities = await FormCapacity.findOne({ idUser: dataUser.id, status: "pending" });
  }
  res.render("about", {
    title: "Tentang Kami",
    layout: "layouts/main-layout-primary",
    dataUser,
    caves,
    formCapacities,
  });
});

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

app.use("/", (req, res) => {
  res.status(404);
  res.send("Halaman Tidak Ditemukan");
});

//Menjalankan LocalHost
app.listen(port, () => {
  console.log(`Tongkrongin App | Listening at http://localhost:${port}`);
});
