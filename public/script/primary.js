const inputCafe = document.querySelectorAll("input.alamat-cafe");
const wadahCafe = document.querySelectorAll("section.highlight .card-text");

const inputCafeSec = document.querySelectorAll("input.alamat-cafe-sec");
const wadahCafeSec = document.querySelectorAll("section.highlight .card-text-sec");

const inputCafeRes = document.querySelectorAll("input.alamat-cafe-res");
const wadahCafeRes = document.querySelectorAll("section.highlight .card-text-res");

let value = [];
inputCafe.forEach((el) => {
  value.push(el.value);
});

wadahCafe.forEach((el, i) => {
  el.innerHTML = value[i].substring(0, 40) + "...";
});

let valueSec = [];
inputCafeSec.forEach((el) => {
  value.push(el.value);
});

wadahCafeSec.forEach((el, i) => {
  el.innerHTML = value[i].substring(0, 40) + "...";
});

let valueRes = [];
inputCafeRes.forEach((el) => {
  value.push(el.value);
});

wadahCafeRes.forEach((el, i) => {
  el.innerHTML = value[i].substring(0, 60) + "...";
});

console.log(inputCafe);
console.log(wadahCafe);

const caves = document.querySelectorAll("input.object-caves");

let arr = [];
// caves.forEach((el) => {
//   let bersih = el.value.split("");
//   for(let i=0; i<bersih.length; i++){
//     if(bersih[i+1]){
//       if(bersih[i] == '\ ' && )
//     }
//   }
// });

console.log(arr);
