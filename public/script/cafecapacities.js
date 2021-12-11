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
