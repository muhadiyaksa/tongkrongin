const pesanButton = document.querySelectorAll("h3.pesan");
const quantityMenu = document.querySelectorAll(".menu .quantity");

const tombolTambah = document.querySelectorAll("i.tambah");
const tombolKurang = document.querySelectorAll("i.kurang");

const quantity = document.querySelectorAll("section.makanan .menu .quantity-value");
const wadahQuantity = document.querySelectorAll("section.makanan .menu .quantity h2 span");
const wadahCart = document.querySelector(".wadahCart");

const foodImg = document.querySelectorAll(".menu .image img");
const foodName = document.querySelectorAll(".menu .makanan h4");
const foodPrice = document.querySelectorAll(".value-harga");

let cartsArray = [];
let foodObject;

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("pesan")) {
    e.preventDefault();
    e.target.style.display = "none";
    const targetNumber = e.target.getAttribute("number");

    const idcafe = e.target.getAttribute("idcafe");
    const iduser = e.target.getAttribute("iduser");
    const idmenu = e.target.getAttribute("idmenu");

    const imgFood = foodImg[targetNumber].getAttribute("src");
    const nameFood = foodName[targetNumber].innerHTML;
    const priceFood = foodPrice[targetNumber].value;

    let qValue = quantity[targetNumber].value;
    quantityMenu[targetNumber].style.display = "block";

    const quantityValue = Number(qValue);
    const hasilTambah = quantityValue + 1;
    quantity[targetNumber].value = hasilTambah;

    foodObject = new Foods(idcafe, iduser, idmenu, imgFood, nameFood, priceFood, Number(quantity[targetNumber].value), targetNumber);
    cartsArray.push(foodObject);

    addToArray(cartsArray);

    wadahQuantity[targetNumber].innerHTML = `${quantity[targetNumber].value}`;
  }

  if (e.target.classList.contains("tambah")) {
    e.preventDefault();
    const targetNumber = e.target.getAttribute("number");
    const hasilTambah = Number(quantity[targetNumber].value) + 1;
    quantity[targetNumber].value = hasilTambah;

    const qtyCart = document.querySelectorAll(".qty h4");
    const quantityFood = document.querySelectorAll("input.quantity-food");
    qtyCart.forEach((el) => {
      if (el.getAttribute("target") == targetNumber) {
        el.innerHTML = quantity[targetNumber].value;
      }
    });
    cartsArray.forEach((el) => {
      if (el.target == targetNumber) {
        el.addQty(quantity[targetNumber].value);
      }
    });
    quantityFood.forEach((el) => {
      if (el.getAttribute("number") == targetNumber) {
        el.value = quantity[targetNumber].value;
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

    qtyCart.forEach((el) => {
      if (el.getAttribute("target") == targetNumber) {
        el.innerHTML = quantity[targetNumber].value;
      }
    });
    cartsArray.forEach((el) => {
      if (el.target == targetNumber) {
        el.addQty(quantity[targetNumber].value);
      }
    });
    quantityFood.forEach((el) => {
      if (el.getAttribute("number") == targetNumber) {
        el.value = quantity[targetNumber].value;
      }
    });

    if (hasilKurang == 0 || hasilKurang < 0) {
      quantity[targetNumber].value = 0;
      pesanButton[targetNumber].style.display = "block";
      quantityMenu[targetNumber].style.display = "none";

      let filtered = cartsArray.filter((el) => el.name != namaMenu);
      cartsArray.splice(0);
      cartsArray = [...filtered];

      addToArray(cartsArray);

      wadahQuantity[targetNumber].innerHTML = `${quantity[targetNumber].value}`;
    } else {
      quantity[targetNumber].value = hasilKurang;
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
  }

  addQty(qtyPlus) {
    this.qty = Number(qtyPlus);
    return this.qty;
  }

  lessQty(qtyMin) {
    this.qty = Number(qtyMin);
    return this.qty;
  }
}

function addToArray(carts) {
  let card = "";
  carts.forEach((el) => {
    card += cart(el.idcafe, el.iduser, el.idmenu, el.img, el.name, el.price, el.qty, el.target);
  });
  wadahCart.innerHTML = card;
}

function cart(idcafe, iduser, idmenu, img, name, price, qty, target) {
  return `<div class="kapasitas">
            <input type="hidden" value="${idcafe}" name="idcafe" />
            <input type="hidden" value="${iduser}" name="iduser" />
            <input type="hidden" value="${idmenu}" name="idmenu" />
            <input type="hidden" value="${qty}" name="quantity" class="quantity-food" number="${target}"/>
            <input type="hidden" value="${price}" name="harga" />
            
            <div class="row">
              <div class="col-3">
                <img src="${img}" alt="food 2" class="img-fluid" />
              </div>
              <div class="col-auto">
                <h4>${name}</h4>
                <span>Rp. ${price}</span>
              </div>
              <div class="col my-auto text-end qty">
                <h4 nama-menu=${name} target=${target}>${qty}</h4>
              </div>
            </div>
          </div>`;
}
