const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

const loginForm = document.getElementById("admin-login-form");
const userButton = document.getElementById("user-login-button");

document.querySelectorAll('input[name="loginType"]').forEach((input) => {
  input.addEventListener("change", function () {
    if (this.value === "admin") {
      loginForm.style.display = "block";
      userButton.style.display = "none";
    } else {
      loginForm.style.display = "none";
      userButton.style.display = "block";
    }
  });
});

function login() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;
  const errorMsg = document.getElementById("error-msg");

  if (user === ADMIN_USERNAME && pass === ADMIN_PASSWORD) {
    localStorage.setItem("isAdmin", "true");
    window.location.href = "admin.html";
  } else {
    errorMsg.style.display = "block";
  }
}

function goToUser() {
  localStorage.setItem("isUser", "true");
  window.location.href = "user/main.html";
}

document.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    const selected = document.querySelector('input[name="loginType"]:checked').value;
    if (selected === "admin") login();
    else goToUser();
  }
});
