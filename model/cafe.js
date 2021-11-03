const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/tongkrongin", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

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
    { fisilitasIcon: { type: String }, fasilitasJudul: { type: String } },
    { fisilitasIcon: { type: String }, fasilitasJudul: { type: String } },
    { fisilitasIcon: { type: String }, fasilitasJudul: { type: String } },
    { fisilitasIcon: { type: String }, fasilitasJudul: { type: String } },
    { fisilitasIcon: { type: String }, fasilitasJudul: { type: String } },
    { fisilitasIcon: { type: String }, fasilitasJudul: { type: String } },
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

const cafe1 = new Cafe({
  idCafe: "001010",
  nama: "Seatap Coffee",
  alamat: "Arundina, Jl. Lap. Tembak No.A10, RT.1/RW.11, Cibubur, Kec. Ciracas, Kota Jakarta Timur, Daerah Khusus Ibukota Jakarta 13720",
  fasilitas: [
    { fisilitasIcon: "foodIcon.png", fasilitasJudul: "Makanan" },
    { fisilitasIcon: "waterIcon.png", fasilitasJudul: "Minuman" },
    { fisilitasIcon: "toiletIcon.png", fasilitasJudul: "Wifi" },
    { fisilitasIcon: "foodIcon.png", fasilitasJudul: "Makanan" },
    { fisilitasIcon: "foodIcon.png", fasilitasJudul: "Makanan" },
  ],
  kategori: "jakarta timur",
  jamBuka: "11:00",
  jamTutup: "23:00",
  gambar: [{ namaGambar: "cafe1.png" }, { namaGambar: "cafedetail1.png" }],
});

//Simpan Ke COllection
cafe1.save().then((cafe) => console.log(cafe));
// module.exports = User;
