const hargaKapasitas = document.querySelector(".kapasitas h3.harga");
const valueHargaKapasitas = document.querySelector(".kapasitas input.harga-kapasitas");
const idCafe = document.querySelector("input.id-cafe");
const kapKategori = document.querySelector(".modal .kotak");

function tampilHarga(harga) {
  const hasilHarga = formatRupiah(harga, "Rp. ");
  hargaKapasitas.innerHTML = hasilHarga;
}

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("overlay")) {
    const harga = e.target.getAttribute("harga");
    const jumlah = e.target.getAttribute("jumlah");
    const kategori = e.target.getAttribute("kategori");

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
