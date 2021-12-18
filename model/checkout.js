const mongoose = require("mongoose");
// mongoose.connect("mongodb://127.0.0.1:27017/tongkrongin", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

//Schema
const Checkout = mongoose.model("Checkout", {
  idCafe: {
    type: String,
    required: true,
  },
  idUser: {
    type: String,
  },
  idMenu: [{ type: String }],
  catatan: {
    type: String,
  },
  total: {
    type: String,
  },
  tanggal: {
    type: String,
  },
  bulan: {
    type: String,
  },
  tahun: {
    type: String,
  },
  jamPesan: {
    type: String,
  },
  status: {
    type: String,
  },
});

module.exports = Checkout;
// const checkout1 = new Checkout({
//   idCafe: "001010",
//   idUser: "09090",
//   idMenu: ["123", "234", "345", "456"],
//   total: "350000",
// });
// checkout1.save().then((chek) => console.log(chek));
