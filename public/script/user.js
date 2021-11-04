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
