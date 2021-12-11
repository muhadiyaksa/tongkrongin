const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/tongkrongin", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

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
  total: {
    type: String,
  },
});

// module.exports = Capacity;
const checkout1 = new Checkout({
  idCafe: "001010",
  idUser: "09090",
  idMenu: ["123", "234", "345", "456"],
  total: "350000",
});
checkout1.save().then((chek) => console.log(chek));
