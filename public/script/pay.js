const itemBank = document.querySelectorAll(".jenis-bank .item-bank");

const wadahNamaRekening = document.querySelector("section.pay span.nama-rekening");
const wadahNomorRekening = document.querySelector("section.pay span.nomor-rekening");
const wadahNamaBank = document.querySelector("section.pay span.nama-bank");

const imageBank = document.querySelector("section.pay .image-bank img");

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
