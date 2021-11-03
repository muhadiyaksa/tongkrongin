const pesanButton = document.querySelectorAll("h3.pesan");
const quantityMenu = document.querySelectorAll(".menu .quantity");

const valueHarga = document.querySelectorAll(".value-harga");
const tombolTambah = document.querySelectorAll("i.tambah");
const tombolKurang = document.querySelectorAll("i.kurang");

const quantity = document.querySelectorAll("section.makanan .menu .quantity-value");
const wadahQuantity = document.querySelectorAll("section.makanan .menu .quantity h2 span");

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("pesan")) {
    e.preventDefault();
    e.target.style.display = "none";

    const targetNumber = e.target.getAttribute("number");
    quantityMenu[targetNumber].style.display = "block";

    const quantityValue = Number(quantity[targetNumber].value);

    const hasilTambah = quantityValue + 1;

    quantity[targetNumber].value = hasilTambah;
    wadahQuantity[targetNumber].innerHTML = `${quantity[targetNumber].value}`;
  }

  if (e.target.classList.contains("tambah")) {
    e.preventDefault();
    const targetNumber = e.target.getAttribute("number");
    const hasilTambah = Number(quantity[targetNumber].value) + 1;
    quantity[targetNumber].value = hasilTambah;

    wadahQuantity[targetNumber].innerHTML = `${quantity[targetNumber].value}`;
  }

  if (e.target.classList.contains("kurang")) {
    e.preventDefault();
    const targetNumber = e.target.getAttribute("number");

    const hasilKurang = Number(quantity[targetNumber].value) - 1;

    if (hasilKurang == 0 || hasilKurang < 0) {
      quantity[targetNumber].value = 0;
      pesanButton[targetNumber].style.display = "block";
      quantityMenu[targetNumber].style.display = "none";
      wadahQuantity[targetNumber].innerHTML = `${quantity[targetNumber].value}`;
    } else {
      quantity[targetNumber].value = hasilKurang;
      wadahQuantity[targetNumber].innerHTML = `${quantity[targetNumber].value}`;
    }
  }
});
