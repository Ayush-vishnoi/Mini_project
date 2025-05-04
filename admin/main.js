// ===== Login Logic =====
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("admin-login-form");
  const userButton = document.getElementById("user-login-button");
  const loginTypeInputs = document.querySelectorAll('input[name="loginType"]');

  if (loginTypeInputs.length > 0) {
    loginTypeInputs.forEach((input) => {
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

    document.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        const selected = document.querySelector('input[name="loginType"]:checked').value;
        if (selected === "admin") login();
        else goToUser();
      }
    });
  }

  // If on admin page, run admin-specific functions
  if (document.body.id === "admin-page") {
    enforceAdminAccess();
    loadCurrentOrder();
    loadEmployees();
    loadPayments();

    document.getElementById("mark-done").addEventListener("click", markOrderDone);
  }
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

// ===== Admin Page Functions =====
function enforceAdminAccess() {
  if (localStorage.getItem("isAdmin") !== "true") {
    alert("Unauthorized access!");
    window.location.href = "index.html";
  }
}

function logout() {
  localStorage.removeItem("isAdmin");
  window.location.href = "index.html";
}

function loadCurrentOrder() {
  const current = JSON.parse(localStorage.getItem("cart")) || [];
  const container = document.getElementById("current-order");

  if (current.length === 0) {
    container.innerHTML = "<p>No current order.</p>";
    return;
  }

  let html = "<ul>";
  current.forEach(item => {
    html += `<li>${item.name} x ${item.quantity} – ₹${item.price * item.quantity}</li>`;
  });
  html += "</ul>";

  const total = current.reduce((sum, item) => sum + item.price * item.quantity, 0);
  html += `<p><strong>Total:</strong> ₹${total.toFixed(2)}</p>`;

  container.innerHTML = html;
}

function markOrderDone() {
  const current = JSON.parse(localStorage.getItem("cart")) || [];
  if (current.length === 0) {
    alert("No order to mark as done.");
    return;
  }

  const total = current.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const order = {
    date: new Date().toLocaleString(),
    items: current,
    total
  };

  const history = JSON.parse(localStorage.getItem("adminOrders")) || [];
  history.push(order);
  localStorage.setItem("adminOrders", JSON.stringify(history));

  localStorage.removeItem("cart");

  loadCurrentOrder();
  loadPayments();

  alert("Order marked as done and moved to history.");
}

function loadEmployees() {
  const empList = document.getElementById("employee-list");

  const employees = [
    {
      name: "Ayush Vishnoi",
      role: "Developer",
      email: "ayushvishnoi000@gmail.com"
    }
  ];

  empList.innerHTML = employees.map(emp =>
    `<div><strong>${emp.name}</strong> – ${emp.role} – ${emp.email}</div>`
  ).join('');
}

function loadPayments() {
  const payList = document.getElementById("payment-list");
  const orders = JSON.parse(localStorage.getItem("adminOrders")) || [];

  if (orders.length === 0) {
    payList.innerHTML = "<p>No payment records available.</p>";
    document.getElementById("net-profit").textContent = "0.00";
    return;
  }

  let total = 0;
  payList.innerHTML = orders.map((order, index) => {
    const date = order.date || `Order #${index + 1}`;
    total += order.total;
    return `<div>${date}: ₹${order.total.toFixed(2)}</div>`;
  }).join('');

  document.getElementById("net-profit").textContent = total.toFixed(2);
}
