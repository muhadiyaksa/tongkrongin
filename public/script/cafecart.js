const checkForPrice = document.querySelectorAll("input.check-for-price");
const checkForCapacity = document.querySelector("input.check-capacity");
const totalForPrice = document.querySelector(".total h3 span");

const priceFood = document.querySelectorAll(".makanan .harga h4");
const valuePriceFood = document.querySelectorAll("input.value-harga");

const pricePlace = document.querySelector(".tempat .harga h4");
const valuePricePlace = document.querySelector("input.value-harga-tempat");

const tombolKurangCart = document.querySelectorAll("button.qty-min");

checkForPrice.forEach((el) => {
  el.addEventListener("change", function (e) {
    e.preventDefault;
    if (el.checked) {
      if (!checkForCapacity.checked) {
        checkForCapacity.click();
      }
    }
  });
});

let price = [];

valuePriceFood.forEach((el) => {
  price.push(el.value);
});

priceFood.forEach((el, i) => {
  el.innerHTML = formatRupiah(price[i], "Rp. ");
});

if (valuePricePlace) {
  pricePlace.innerHTML = formatRupiah(valuePricePlace.value, "Rp. ");
}

function unCheckedFood() {
  checkForPrice.forEach((el) => {
    if (!checkForCapacity.checked) {
      if (el.checked) {
        el.click();
      }
    }
  });
}

function countPriceCheck(totalParam) {
  let totalHarga = 0;
  if (totalParam.length !== 0) {
    totalParam.forEach((el) => {
      totalHarga += Number(el);
    });
  } else {
    totalHarga = "-";
  }
  return totalHarga;
}

function disabledButton() {
  const inputQty = document.querySelectorAll("input.quantity-food");
  let inputArr = [];
  inputQty.forEach((el) => {
    inputArr.push(el.value);
  });

  tombolKurangCart.forEach((el, i) => {
    if (inputArr[i] == 1) {
      el.setAttribute("disabled", "true");
    }
  });
}

disabledButton();
let total = [];
let totalCapacity = [];
document.addEventListener("change", function (e) {
  if (e.target.classList.contains("check-capacity")) {
    e.preventDefault();
    const eValue = e.target.value;
    if (e.target.checked) {
      totalCapacity.push(eValue);
      total.push(...totalCapacity);
    } else {
      unCheckedFood();
      totalCapacity.splice(0);
      total.splice(0);
    }

    let totalHarga = countPriceCheck(total).toString();
    totalForPrice.innerHTML = formatRupiah(totalHarga);
  } else if (e.target.classList.contains("check-for-price")) {
    e.preventDefault();
    const eValue = e.target.value.split(",");
    console.log(eValue[3]);

    if (e.target.checked) {
      total.unshift(eValue[2]);
    } else {
      let kurang = total.filter((el) => el !== eValue[2]);
      total = [...kurang];
    }

    let totalHarga = countPriceCheck(total).toString();
    totalForPrice.innerHTML = formatRupiah(totalHarga);
  }
});

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
