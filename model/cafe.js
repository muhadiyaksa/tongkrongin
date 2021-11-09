const mongoose = require("mongoose");

//Schema
const Cafe = mongoose.model("Cafe", {
  idCafe: {
    type: String,
    required: true,
  },
  nama: {
    type: String,
    required: true,
  },
  alamat: {
    type: String,
    required: true,
  },
  fasilitas: [
    { fasilitasIcon: { type: String }, fasilitasJudul: { type: String } },
    { fasilitasIcon: { type: String }, fasilitasJudul: { type: String } },
    { fasilitasIcon: { type: String }, fasilitasJudul: { type: String } },
    { fasilitasIcon: { type: String }, fasilitasJudul: { type: String } },
    { fasilitasIcon: { type: String }, fasilitasJudul: { type: String } },
    { fasilitasIcon: { type: String }, fasilitasJudul: { type: String } },
  ],
  kategori: {
    type: String,
    required: true,
  },
  jamBuka: {
    type: String,
    required: true,
  },
  jamTutup: {
    type: String,
    required: true,
  },
  gambar: [{ namaGambar: { type: String } }, { namaGambar: { type: String } }, { namaGambar: { type: String } }],
});

// //Simpan Ke COllection
// cafe1.save().then((cafe) => console.log(cafe));
module.exports = Cafe;
