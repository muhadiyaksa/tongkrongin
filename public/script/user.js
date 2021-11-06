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

// const dropArea = document.querySelector(".konten-upload");
// const notifArea = dropArea.querySelector(".notif");
// const input = dropArea.querySelector("input.input-upload");
// const button = dropArea.querySelector("button.upload-photo");
// console.log(dropArea);
// let file;

// button.onclick = () => {
//   input.click();
// };

// input.addEventListener("change", function (e) {
//   e.preventDefault();
//   file = this.files[0];
//   showFile();
// });

// dropArea.addEventListener("dragover", function (e) {
//   e.preventDefault();
//   dropArea.classList.add("active");
// });

// dropArea.addEventListener("dragleave", function (e) {
//   e.preventDefault();
//   dropArea.classList.remove("active");
// });

// dropArea.addEventListener("drop", function (e) {
//   e.preventDefault();

//   file = e.dataTransfer.files[0];
//   showFile();
// });

const dropArea = document.querySelector(".konten-upload");
const notifArea = document.querySelector(".notif");
const input = dropArea.querySelector("input");

let file;

input.addEventListener("drop", function (e) {
  input.onload();
});

dropArea.addEventListener("dragover", function (e) {
  e.preventDefault();
  dropArea.classList.add("active");
});

dropArea.addEventListener("dragleave", function (e) {
  e.preventDefault();
  dropArea.classList.remove("active");
});

dropArea.addEventListener("drop", function (e) {
  e.preventDefault();

  file = e.dataTransfer.files[0];
  showFile();
});

function notifError() {
  return `<div class="alert alert-danger" role="alert">
            Format File harus PNG , JPG atau JPEG
          </div>`;
}
function showFile() {
  let fileType = file.type;
  let validExtensions = ["image/jpg", "image/jpeg", "image/png"];
  if (validExtensions.includes(fileType)) {
    let fileReader = new FileReader();
    fileReader.onload = () => {
      let fileURL = fileReader.result;
      let imgTag = `<img src="${fileURL}" alt="">`;
      dropArea.innerHTML = imgTag;
    };
    fileReader.readAsDataURL(file);
  } else {
    notifArea.innerHTML = notifError();
  }
}

// document.addEventListener("dragover", function (e) {
//   if (e.target.classList.contains("konten-upload")) {
//     e.preventDefault();
//     dropArea.classList.add("active");
//   }
// });
// document.addEventListener("dragleave", function (e) {
//   if (e.target.classList.contains("konten-upload")) {
//     e.preventDefault();
//     dropArea.classList.remove("active");
//   }
// });

// document.addEventListener("drop", function (e) {
//   if (e.target.classList.contains("konten-upload")) {
//     e.preventDefault();

//     file = e.dataTransfer.files;
//     showFile();
//   }
// });

// document.addEventListener("change", function (e) {
//   if (e.target.classList.contains("input-upload")) {
//     file = this.files;
//     showFile();
//   }
// });

// function notifError() {
//   return `<div class="alert alert-danger" role="alert">
//             Format File harus PNG , JPG atau JPEG
//           </div>`;
// }
// function showFile() {
//   let fileType = file.type;
//   let validExtensions = ["image/jpg", "image/jpeg", "image/png"];
//   if (validExtensions.includes(fileType)) {
//     let fileReader = new FileReader();
//     fileReader.onload = () => {
//       let fileURL = fileReader.result;
//       let imgTag = `<img src="${fileURL}" alt="">`;
//       dropArea.innerHTML = imgTag;
//     };
//     fileReader.readAsDataURL(file);
//   } else {
//     notifArea.innerHTML = notifError();
//   }
// }
