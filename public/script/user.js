const showPassword = document.querySelectorAll(".show-password");
const password = document.getElementById("password");
const passwordChecked = document.getElementById("passwordChecked");

showPassword.forEach((el, i) => {
  el.addEventListener("click", function () {
    if (i == 0) {
      if (password.type == "password") {
        password.setAttribute("type", "text");
      } else {
        password.setAttribute("type", "password");
      }
    } else {
      if (passwordChecked.type == "password") {
        passwordChecked.setAttribute("type", "text");
      } else {
        passwordChecked.setAttribute("type", "password");
      }
    }
  });
});

//--------------------------------------------------------------

const dropArea = document.querySelector(".konten-upload");
const notifArea = document.querySelector(".notif-area");
const input = dropArea.querySelector("input.upload-photo");

const hasilFile = dropArea.querySelector(".hasil-file");
const h2DropArea = dropArea.querySelector("h2");
const pDropArea = dropArea.querySelector("p");
const labelDropArea = dropArea.querySelector("label");

let file;

input.addEventListener("dragover", function (e) {
  e.preventDefault();
  dropArea.classList.add("active");
});

input.addEventListener("dragleave", function (e) {
  e.preventDefault();
  dropArea.classList.remove("active");
});

input.addEventListener("change", function (e) {
  e.preventDefault();
  showFile(this);
});

function notifError() {
  return `<div class="alert alert-danger" role="alert">
            Format File harus PNG , JPG atau JPEG
          </div>`;
}
function notifErrorDouble() {
  return `<div class="alert alert-danger" role="alert">
            Foto Profil tidak dapat menerima lebih dari 1 Foto!
          </div>`;
}
function showFile(input) {
  if (input.files && input.files[0]) {
    let card = "";
    let fileType = input.files[0].type;

    if (input.files.length > 1) {
      notifArea.style.display = "block";
      notifArea.innerHTML = notifErrorDouble();
    } else {
      let validExtensions = ["image/jpg", "image/jpeg", "image/png"];

      var reader = new FileReader();

      if (validExtensions.includes(fileType)) {
        reader.onload = function (e) {
          hasilFile.style.display = "block";
          h2DropArea.style.display = "none";
          pDropArea.style.display = "none";
          labelDropArea.style.display = "none";
          notifArea.style.display = "none";
          let cards = (card += resultFile(input.files[0].name));
          hasilFile.innerHTML = cards;
          console.log(input.files[0].name);
        };
        reader.readAsDataURL(input.files[0]);

        console.log(input.value);
      } else {
        notifArea.style.display = "block";
        notifArea.innerHTML = notifError();
      }
    }
  }
}

function resultFile(namafile) {
  return `<div class="alert alert-secondary tampil-file" role="alert">
            <div class="row">
              <div class="col-3">
                <h3><i class="bi bi-image"></i><h3>
              </div>
              <div class="col-9 text-start">
                ${namafile}
              </div>
            </div>
          </div>`;
}

// CADANGAN
// ----------------------------
// function showFileMore1() {
//   let card = "";
//   for (let i = 0; i < file.length; i++) {
//     let fileType = file[i].type;
//     let validExtensions = ["image/jpg", "image/jpeg", "image/png"];
//     if (validExtensions.includes(fileType)) {
//       hasilFile.style.display = "block";
//       h2DropArea.style.display = "none";
//       pDropArea.style.display = "none";
//       labelDropArea.style.display = "none";
//       notifArea.style.display = "none";
//       let cards = (card += resultFile(file[i].name));
//       hasilFile.innerHTML = cards;
//       console.log(file[i].name);
//       console.log(file[i].type);
//     } else {
//       notifArea.style.display = "block";
//       notifArea.innerHTML = notifError();
//     }
//   }
// }
