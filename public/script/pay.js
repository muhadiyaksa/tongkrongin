const itemBank = document.querySelectorAll(".jenis-bank .item-bank");

const wadahNamaRekening = document.querySelector("section.pay span.nama-rekening");
const wadahNomorRekening = document.querySelector("section.pay span.nomor-rekening");
const wadahNamaBank = document.querySelector("section.pay span.nama-bank");

const imageBank = document.querySelector("section.pay .image-bank img");

const tanggalPesan = document.querySelector("input.tanggal-pesan");
const wadahTanggal = document.querySelector("span.wadah-tanggal");

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("overlay")) {
    const valueNoRek = e.target.getAttribute("nomorRekening");
    const valueNamaRek = e.target.getAttribute("namaRekening");
    const valueNamaBank = e.target.getAttribute("namaBank");

    wadahNamaRekening.innerHTML = valueNamaRek;
    wadahNomorRekening.innerHTML = valueNoRek;
    wadahNamaBank.innerHTML = valueNamaBank;
    imageBank.src = `/img/bank/${valueNamaBank}.png`;
  }
});

function ubahTanggal(tanggal) {
  let arr = tanggal.value.split("-");
  let bulan = ["", "januari", "februari", "maret", "april", "mei", "juni", "juli", "agustus", "september", "oktober", "november", "desember"];
  let bulanIndex = arr[1];

  wadahTanggal.innerHTML = `${arr[2]} ${bulan[bulanIndex]} ${arr[0]}`;
  wadahTanggal.style.fontWeight = "600";
}

ubahTanggal(tanggalPesan);

const totalPembayaran = document.querySelector("input.total-pembayaran");
const totalBayar = document.querySelector("strong.totalbayar");

/* Fungsi formatRupiah */
function formatRupiah(angka, prefix) {
  console.log(angka);
  let number_string = angka.replace(/[^,\d]/g, ""),
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
totalBayar.textContent = formatRupiah(totalPembayaran.value, "Rp. ");
