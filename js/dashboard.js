const storedData = localStorage.getItem("appData");
const appData = storedData ? JSON.parse(storedData) : {};

if (storedData) {
  const avatar = document.getElementById("avatar");
  const name = document.getElementById("name");

  if (appData.client.image && avatar) {
    avatar.style.backgroundImage = `url(${appData.client.image})`;
    avatar.style.backgroundSize = "cover";
    avatar.style.backgroundPosition = "center";
  }
  if (appData.client.firstName && appData.client.lastName) {
    name.innerHTML = `${appData.client.firstName} ${appData.client.lastName}`;
  }
}

const mainBalance = document.getElementById("mainBalance");
const saveIncome = document.getElementById("saveIncome");
const openModal = document.getElementById("openModal");

if (appData.income) {
  mainBalance.innerHTML = `L.E ${appData.income}`;
  openModal.classList.add("d-none");
} else {
  mainBalance.innerHTML = 0;
}

saveIncome.addEventListener("click", function () {
  const incomeInput = document.getElementById("incomeInput");

  if (+incomeInput.value > 0) {
    appData.income = +incomeInput.value.trim();
    localStorage.setItem("appData", JSON.stringify(appData));
    mainBalance.innerHTML = "";
    mainBalance.innerHTML = appData.income;
    openModal.classList.add("d-none");
  } else {
    Swal.fire("Error", "Enter valid amount", "error");
    return;
  }
});

const addExpenseBtns = document.querySelectorAll(".add-expense-btn");
const modalCategoryTitle = document.getElementById("modalCategoryTitle");
const saveExpenseBtn = document.getElementById("saveExpenseBtn");
let currentCategory = "";

addExpenseBtns.forEach((btn) => {
  btn.addEventListener("click", function (e) {
    const card = e.target.closest(".category-card");
    currentCategory = card.dataset.category;

    modalCategoryTitle.innerHTML = `Add ${currentCategory} Expense`;
  });
});

saveExpenseBtn.addEventListener("click", function () {
  const expenseTitle = document.getElementById("expenseTitle").value;
  const expenseAmount = +document.getElementById("expenseAmount").value;
  const expenseNote = document.getElementById("expenseNote").value;

  if (!expenseTitle || expenseAmount <= 0) {
    Swal.fire("Error", "Enter valid title and amount", "error");
    return;
  }

  if (!appData.expenses[currentCategory]) {
    appData.expenses[currentCategory] = [];
  }

  appData.expenses[currentCategory].push({
    title: expenseTitle,
    amount: expenseAmount,
    note: expenseNote,
    date: new Date().toISOString(),
  });

  localStorage.setItem("appData", JSON.stringify(appData));

  updateCategoryTotal(currentCategory);
  updateBalance();
  getTotalExpenses();
});

function updateCategoryTotal(category) {
  const card = document.querySelector(
    '.category-card[data-category="' + category + '"]'
  );

  if (!card) return;

  const totalElem = card.querySelector(".category-total");

  let total = 0;
  const expenses = appData.expenses[category];

  for (let i = 0; i < expenses.length; i++) {
    total += Number(expenses[i].amount);
  }

  totalElem.innerText = total.toFixed(2);
}

function updateBalance() {
  const headBalance = document.getElementById("headBalance");
  const remainingBalance = document.getElementById("remainingBalance");

  let totalExpenses = 0;

  for (let category in appData.expenses) {
    const expenses = appData.expenses[category];

    for (let i = 0; i < expenses.length; i++) {
      totalExpenses = totalExpenses + expenses[i].amount;
    }
  }

  const totalSavings = appData.savings.total || 0;

  const balance = appData.income - totalExpenses - totalSavings;
  remainingBalance.innerText = `L.E ${balance}`;
  headBalance.innerText = `Balance : ${balance} L.E`;
}

function getTotalExpenses() {
  const expensesBalance = document.getElementById("expensesBalance");
  let total = 0;

  for (let category in appData.expenses) {
    const expenses = appData.expenses[category];

    for (let i = 0; i < expenses.length; i++) {
      total += Number(expenses[i].amount);
    }
  }

  expensesBalance.innerText = `L.E ${total}`;
}

const addSavings = document.getElementById("addSavings");

addSavings.addEventListener("click", function () {
  const inputSavings = document.getElementById("inputSavings");
  let value = +inputSavings.value.trim();

  if (value > 0) {
    appData.savings.history.push({
      amount: value,
      date: new Date().toISOString(),
    });
  } else {
    Swal.fire("Error", "Enter a valid amount", "error");
    return;
  }

  appData.savings.total += value;
  localStorage.setItem("appData", JSON.stringify(appData));


});

function updateSavingsUI() {
  const savingsList = document.getElementById("savingsList");
  const totalElem = document.getElementById("totalSavings");

  savingsList.innerHTML = ""; // امسح القديم

  appData.savings.history.forEach(s => {
    const li = document.createElement("div");
    li.classList.add("d-flex","p-3","rounded-4","border","border-success-subtle","mb-2", "save-card");
    li.innerHTML += `
      <div style="width:60px; height:60px;" class="save-card  rounded-circle d-flex align-items-center justify-content-center me-3">
        <div style="width:40px; height:40px;" class="bg-success rounded-circle d-flex align-items-center justify-content-center">
          <i class="fa-solid fa-arrow-trend-up text-white"></i>
        </div>
      </div>
      <div class="col-11 d-flex justify-content-between align-items-center">
        <h3 class="mb-0">${s.amount} L.E</h3>
        <p class="text-center mb-0 text-secondary">${new Date(s.date).toLocaleDateString()}<br>${new Date(s.date).toLocaleTimeString()}</p>
      </div>
    `;
    savingsList.appendChild(li);
  });

  totalElem.textContent = `Total: L.E ${appData.savings.total}`;
}


window.addEventListener("load", function () {
  for (let category in appData.expenses) {
    updateCategoryTotal(category);
  }

  updateBalance();
  getTotalExpenses();
  updateSavingsUI();
});
