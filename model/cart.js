const mongoose = require("mongoose");

//Schema
const Cart = mongoose.model("Cart", {
  idCafe: {
    type: String,
    required: true,
  },
  idUser: {
    type: String,
    required: true,
  },
  kapKategori: {
    type: String,
    required: true,
  },
});

module.exports = Capacity;
