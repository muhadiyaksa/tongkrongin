const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/tongkrongin", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// const user1 = new User({
//   nama: "Muhamad Adi yaksa",
//   email: "muhadiyaksa@gmail.com",
//   notelp: "087899219921",
//   password: "yaksayaksa",
//   passwordChecked: "yaksayaksa",
// });

// //Simpan Ke COllection
// user1.save().then((user) => console.log(user));
