const quantityCart = document.querySelectorAll(".quantity-cart");

const tombolKurangCart = document.querySelectorAll("i.kurang-cart");

const quantityCartValue = document.querySelectorAll(".quantity-value");
const wadahQuantityCart = document.querySelectorAll(".quantity-cart h2 span");

const wadahHarga = document.querySelectorAll(".makanan .harga h4");

const valueHargaCart = document.querySelectorAll("input.value-harga");
const valueHargaTambahCart = document.querySelectorAll("input.value-harga-tambah");

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("tambah-cart")) {
    e.preventDefault();
    const targetNumber = e.target.getAttribute("number");
    tombolKurangCart[targetNumber].classList.add("kurang-cart");

    const hasilTambah = Number(quantityCartValue[targetNumber].value) + 1;
    quantityCartValue[targetNumber].value = hasilTambah;

    const totalHarga = Number(hasilTambah) * Number(valueHargaCart[targetNumber].value);
    valueHargaTambahCart[targetNumber].value = totalHarga;

    const rupiah = formatRupiah(totalHarga.toString(), "Rp ");
    wadahHarga[targetNumber].innerHTML = `${rupiah}`;
    wadahQuantityCart[targetNumber].innerHTML = `${quantityCartValue[targetNumber].value}`;
  }

  if (e.target.classList.contains("kurang-cart")) {
    e.preventDefault();
    const targetNumber = e.target.getAttribute("number");
    const hasilKurang = Number(quantityCartValue[targetNumber].value) - 1;

    const totalHargaKurang = Number(valueHargaCart[targetNumber].value) * hasilKurang;
    valueHargaTambahCart[targetNumber].value = totalHargaKurang;

    const rupiah = formatRupiah(totalHargaKurang.toString(), "Rp. ");

    if (hasilKurang === 1) {
      e.target.classList.remove("kurang-cart");
      quantityCartValue[targetNumber].value = 1;
      wadahHarga[targetNumber].innerHTML = `${rupiah}`;
      wadahQuantityCart[targetNumber].innerHTML = `${quantityCartValue[targetNumber].value}`;
    } else {
      quantity[targetNumber].value = hasilKurang;
      wadahHarga[targetNumber].innerHTML = `${rupiah}`;
      wadahQuantityCart[targetNumber].innerHTML = `${quantityCartValue[targetNumber].value}`;
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
