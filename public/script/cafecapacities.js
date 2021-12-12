const hargaKapasitasForm = document.querySelectorAll(".kapasitas h3.harga");
const valueHargaKapasitas = document.querySelectorAll(".kapasitas input.harga-kapasitas");

let value = [];
valueHargaKapasitas.forEach((el) => {
  value.push(el.value);
});

hargaKapasitasForm.forEach((el, i) => {
  el.innerHTML = formatRupiah(value[i], "Rp. ");
});

const idCafe = document.querySelector("input.id-cafe");
const kapKategori = document.querySelector(".modal .kotak");
const inputKategori = document.querySelector("input.kapkategori");

function tampilHarga(harga) {
  const hasilHarga = formatRupiah(harga, "Rp. ");
  hargaKapasitasForm.innerHTML = hasilHarga;
}

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("overlay")) {
    const kategori = e.target.getAttribute("kategori");

    inputKategori.value = kategori;
    kapKategori.innerHTML = `${kategori} Orang`;
  }
});

const jamBuka = document.querySelector("input.jam-buka");
const jamTutup = document.querySelector("input.jam-tutup");

document.addEventListener("change", function (e) {
  if (e.target.classList.contains("tanggal-pesan")) {
    let valueE = e.target.value.split("-");
    let hariIni = Number(new Date().getDate()) + 2;
    let bulanIni = Number(new Date().getMonth()) + 1;
    console.log(bulanIni);
    let tahunIni = new Date().getFullYear();

    const kirimkapasitas = document.querySelector("button.kirim-kapasitas");
    const info = document.querySelector("span.info-tanggal");

    if (valueE[0] >= tahunIni) {
      if (valueE[1] >= bulanIni) {
        if (valueE[2] >= hariIni) {
          info.innerHTML = "";
          kirimkapasitas.removeAttribute("disabled");
          console.log("kesini nih");
        } else {
          info.innerHTML = "Masukan Tanggal Minimal 2 Hari Setelah Hari ini";
          kirimkapasitas.setAttribute("disabled", "true");
        }
      } else if (valueE[1] < bulanIni && valueE[0] > tahunIni) {
        info.innerHTML = "";
        kirimkapasitas.removeAttribute("disabled");
      } else {
        info.innerHTML = "Masukan Tanggal Minimal 2 Hari Setelah Hari ini";
        kirimkapasitas.setAttribute("disabled", "true");
      }
    } else {
      info.innerHTML = "Masukan Tanggal Minimal 2 Hari Setelah Hari ini";
      kirimkapasitas.setAttribute("disabled", "true");
    }
  }

  if (e.target.classList.contains("jam-pesan")) {
    let valueJamBuka, valueJamTutup;
    if (jamBuka && jamTutup) {
      const info = document.querySelector("span.info-jam");
      const kirimkapasitas = document.querySelector("button.kirim-kapasitas");

      valueJamBuka = jamBuka.value;
      valueJamTutup = jamTutup.value;
      let batasPesan = Number(valueJamTutup.toString().split(":").join("")) - 300;
      let arrayBatasPesan = batasPesan.toString().split("");
      arrayBatasPesan.splice(2, 0, ":");

      let valueBatasPesan = arrayBatasPesan.join("");

      if (e.target.value >= valueJamBuka && e.target.value <= valueJamTutup) {
        if (e.target.value > valueBatasPesan) {
          info.innerHTML = "Pilihlah Waktu minimal 3 Jam sebelum Cafe Tutup";
          kirimkapasitas.setAttribute("disabled", "true");
        } else {
          info.innerHTML = "";
          kirimkapasitas.removeAttribute("disabled");
        }
      } else {
        info.innerHTML = "Pilihlah Waktu sesuai jam Buka dan Jam Tutup Cafe";
        kirimkapasitas.setAttribute("disabled", "true");
      }
    }
  }
});

/* Fungsi formatRupiah */
function formatRupiah(angka, prefix) {
  var number_string = angka.replace(/[^,\d]/g, "").toString(),
    split = number_string.split(","),
    sisa = split[0].length % 3,
    rupiah = split[0].substr(0, sisa),
    ribuan = split[0].substr(sisa).match(/\d{3}/gi);

  // tambahkan titik jika yang di input sudah menjadi angka ribuan
  if (ribuan) {
    separator = sisa ? "." : "";
    rupiah += separator + ribuan.join(".");
  }

  rupiah = split[1] != undefined ? rupiah + "," + split[1] : rupiah;
  return prefix == undefined ? rupiah : rupiah ? "Rp. " + rupiah : "";
}
