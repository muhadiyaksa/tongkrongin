const showPassword = document.querySelectorAll(".show-password");
const password = document.getElementById("password");
const passwordChecked = document.getElementById("passwordChecked");

showPassword.forEach((el, i) => {
  el.addEventListener("click", function () {
    if (i == 0) {
      password.setAttribute("type", text);
    } else {
      passwordChecked.setAttribute("type", text);
    }
  });
});
