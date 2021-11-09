const mongoose = require("mongoose");

//Schema
const Capacity = mongoose.model("Capacity", {
  idCafe: {
    type: String,
    required: true,
  },
  kapasitas: [
    {
      kapKategori: {
        type: String,
      },
      deskripsi: {
        type: String,
      },
      jumlah: {
        type: String,
      },
      harga: {
        type: String,
      },
    },
    {
      kapKategori: {
        type: String,
      },
      deskripsi: {
        type: String,
      },
      jumlah: {
        type: String,
      },
      harga: {
        type: String,
      },
    },
    {
      kapKategori: {
        type: String,
      },
      deskripsi: {
        type: String,
      },
      jumlah: {
        type: String,
      },
      harga: {
        type: String,
      },
    },
  ],
});

module.exports = Capacity;

// const capacity1 = new Capacity({
//   idCafe: "001080",
//   kapasitas: [
//     {
//       kapKategori: "1-3",
//       deskripsi: "Fasilitas yang didapat tempat duduk sebanyak 3 bangku, freewifi, dekat dengan tempat foto, lokasi starategis untuk melihat sekeling cafe",
//       jumlah: "5",
//       harga: "10000",
//     },
//     {
//       kapKategori: "4-6",
//       deskripsi: "Fasilitas yang didapat tempat duduk sebanyak 3 bangku, freewifi, dekat dengan tempat foto, lokasi starategis untuk melihat sekeling cafe",
//       jumlah: "15",
//       harga: "15000",
//     },
//     {
//       kapKategori: "7-12",
//       deskripsi: "Fasilitas yang didapat tempat duduk sebanyak 3 bangku, freewifi, dekat dengan tempat foto, lokasi starategis untuk melihat sekeling cafe",
//       jumlah: "5",
//       harga: "20000",
//     },
//   ],
// });

// //Simpan Ke COllection
// capacity1.save().then((capacity) => console.log(capacity));
