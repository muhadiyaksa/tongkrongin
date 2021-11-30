const pesanButton = document.querySelectorAll("h3.pesan");
const quantityMenu = document.querySelectorAll(".menu .quantity");
const foodMenu = document.querySelectorAll("section.makanan .menu");
const qtyFormFoods = document.querySelector("span.jml-pesanan");

const quantity = document.querySelectorAll("section.makanan .menu .quantity-value");
const wadahQuantity = document.querySelectorAll("section.makanan .menu .quantity h2 span");
const wadahCart = document.querySelector(".wadahCart");

//Data Food (Dalam Array)
const foodImg = document.querySelectorAll(".menu .image img");
const foodName = document.querySelectorAll(".menu .makanan h4");
const foodPrice = document.querySelectorAll(".value-harga");

const qtyForm = document.querySelector("input.jmlFormFoods");
let cartsArray = [];
let foodObject;

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("pesan")) {
    e.preventDefault();
    e.target.style.display = "none";
    const targetNumber = e.target.getAttribute("number");

    quantityMenu[targetNumber].style.display = "block";

    const idcafe = e.target.getAttribute("idcafe");
    const iduser = e.target.getAttribute("iduser");
    const idmenu = e.target.getAttribute("idmenu");

    const imgFood = foodImg[targetNumber].getAttribute("src");
    const nameFood = foodName[targetNumber].innerHTML;
    const priceFood = foodPrice[targetNumber].value;

    let qValue = Number(quantity[targetNumber].value);
    let hasilTambah = qValue + 1;
    quantity[targetNumber].value = hasilTambah;

    foodObject = new Foods(idcafe, iduser, idmenu, imgFood, nameFood, priceFood, hasilTambah, targetNumber);
    cartsArray.push(foodObject);
    addToArray(cartsArray);

    // console.log(cartsArray);

    foodMenu[targetNumber].classList.add("foodactive");

    let totalPesanan = cartsArray.length + Number(qtyForm.value) + 1;

    qtyFormFoods.innerHTML = totalPesanan;
    wadahQuantity[targetNumber].innerHTML = `${quantity[targetNumber].value}`;
  }

  if (e.target.classList.contains("tambah")) {
    e.preventDefault();
    const targetNumber = e.target.getAttribute("number");
    const hasilTambah = Number(quantity[targetNumber].value) + 1;
    quantity[targetNumber].value = hasilTambah;

    const qtyCart = document.querySelectorAll(".qty h4");
    const quantityFood = document.querySelectorAll("input.quantity-food");
    const priceFood = document.querySelectorAll("input.price-food");

    let totalTambah;
    let totalQty;

    cartsArray.forEach((el) => {
      if (el.target == targetNumber) {
        totalQty = el.changeQty(quantity[targetNumber].value);
        totalTambah = el.changePrice(quantity[targetNumber].value);
      }
    });

    qtyCart.forEach((el) => {
      if (el.getAttribute("target") == targetNumber) {
        el.innerHTML = hasilTambah;
      }
    });

    priceFood.forEach((el) => {
      if (el.getAttribute("target") == targetNumber) {
        el.value = totalTambah;
      }
    });
    quantityFood.forEach((el) => {
      if (el.getAttribute("target") == targetNumber) {
        el.value = totalQty;
      }
    });

    wadahQuantity[targetNumber].innerHTML = `${quantity[targetNumber].value}`;
  }

  if (e.target.classList.contains("kurang")) {
    e.preventDefault();
    const targetNumber = e.target.getAttribute("number");
    const namaMenu = e.target.getAttribute("food-name");

    const hasilKurang = Number(quantity[targetNumber].value) - 1;
    quantity[targetNumber].value = hasilKurang;

    const qtyCart = document.querySelectorAll(".qty h4");
    const quantityFood = document.querySelectorAll("input.quantity-food");
    const priceFood = document.querySelectorAll("input.price-food");

    if (hasilKurang == 0 || hasilKurang < 0) {
      quantity[targetNumber].value = 0;
      pesanButton[targetNumber].style.display = "block";
      quantityMenu[targetNumber].style.display = "none";

      let filtered = cartsArray.filter((el) => el.name != namaMenu);
      cartsArray.splice(0);
      cartsArray = [...filtered];

      addToArray(cartsArray);

      foodMenu[targetNumber].classList.remove("foodactive");

      let totalPesanan = cartsArray.length + Number(qtyForm.value) + 1;

      qtyFormFoods.innerHTML = totalPesanan;
      wadahQuantity[targetNumber].innerHTML = `${quantity[targetNumber].value}`;
    } else {
      let totalKurang;
      let totalQty;
      cartsArray.forEach((el, i) => {
        if (el.target == targetNumber) {
          totalQty = el.changeQty(quantity[targetNumber].value);
          totalKurang = el.changePrice(quantity[targetNumber].value);
        }
      });

      qtyCart.forEach((el) => {
        if (el.getAttribute("target") == targetNumber) {
          el.innerHTML = quantity[targetNumber].value;
        }
      });
      priceFood.forEach((el) => {
        if (el.getAttribute("target") == targetNumber) {
          el.value = totalKurang;
        }
      });
      quantityFood.forEach((el) => {
        if (el.getAttribute("target") == targetNumber) {
          el.value = totalQty;
        }
      });

      wadahQuantity[targetNumber].innerHTML = `${quantity[targetNumber].value}`;
    }
  }
});

class Foods {
  constructor(idcafe, iduser, idmenu, img, name, price, qty, target) {
    this.idcafe = idcafe;
    this.iduser = iduser;
    this.idmenu = idmenu;
    this.img = img;
    this.name = name;
    this.price = price;
    this.qty = qty;
    this.target = target;
    this.totalPrice = this.price;
    this.totalQty = this.qty;
  }

  changeQty(qty) {
    this.totalQty = this.qty * Number(qty);
    return this.totalQty;
  }

  changePrice(qty) {
    this.totalPrice = this.price * qty;
    return this.totalPrice;
  }
}

function addToArray(carts) {
  let card = "";
  carts.forEach((el) => {
    card += cart(el.idcafe, el.iduser, el.idmenu, el.img, el.name, el.price, el.qty, el.target, el.totalPrice, el.totalQty);
  });
  wadahCart.innerHTML = card;
}

function cart(idcafe, iduser, idmenu, img, name, price, qty, target, totalPrice, totalQty) {
  return `<div class="kapasitas">
            <input type="hidden" value="${idcafe}" name="idcafe" />
            <input type="hidden" value="${iduser}" name="iduser" />
            <input type="hidden" value="${idmenu}" name="idmenu" />
            <input type="hidden" value="${totalQty}" name="quantity" class="quantity-food" target="${target}"/>
            <input type="hidden" value="${totalPrice}" name="harga" class="price-food" target="${target}"/>
            
            <div class="row">
              <div class="col-3">
                <img src="${img}" alt="food 2" class="img-fluid" />
              </div>
              <div class="col-auto ">
                <h4>${name}</h4>
                <span class="harga" >Rp. ${price}</span>
              </div>
              <div class="col my-auto text-end qty">
                <h4 target="${target}">${totalQty}</h4>
              </div>
            </div>
          </div>`;
}
