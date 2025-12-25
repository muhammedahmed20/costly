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

    incomeInput.value = "";
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
  updateTransactionsUI();

  expenseTitle.value = "";
  expenseAmount.value = "";
  expenseNote.value = "";
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
  updateSavingsUI();
  updateTransactionsUI();
  updateGoalsUI();

  inputSavings.value = "";
});

function updateSavingsUI() {
  const savingsList = document.getElementById("savingsList");
  const totalElem = document.getElementById("totalSavings");

  savingsList.innerHTML = ""; // امسح القديم

  appData.savings.history.forEach((s) => {
    const li = document.createElement("div");
    li.classList.add(
      "d-flex",
      "p-3",
      "rounded-4",
      "border",
      "border-success-subtle",
      "mb-2",
      "save-card"
    );
    li.innerHTML += `
      <div style="width:60px; height:60px;" class="save-card  rounded-circle d-flex align-items-center justify-content-center me-3">
        <div style="width:40px; height:40px;" class="bg-success rounded-circle d-flex align-items-center justify-content-center">
          <i class="fa-solid fa-arrow-trend-up text-white"></i>
        </div>
      </div>
      <div class="col-11 d-flex justify-content-between align-items-center">
        <h3 class="mb-0">${s.amount} L.E</h3>
        <p class="text-center mb-0 text-secondary">${new Date(
          s.date
        ).toLocaleDateString()}<br>${new Date(s.date).toLocaleTimeString()}</p>
      </div>
    `;
    savingsList.appendChild(li);
  });

  totalElem.textContent = `Total: L.E ${appData.savings.total}`;
  updateBalance();
  updateTransactionsUI();
}

const addGoalBtn = document.getElementById("addGoalBtn");
const goalName = document.getElementById("goalName");
const goalTarget = document.getElementById("goalTarget");

addGoalBtn.addEventListener("click", function () {
  const nameValue = goalName.value.trim();
  const targetValue = +goalTarget.value.trim();

  if (!nameValue) {
    Swal.fire("Warning", "Please enter a goal name", "warning");
    return;
  }

  if (!targetValue || targetValue <= 0) {
    Swal.fire("Warning", "Please enter a valid target amount", "warning");
    return;
  }

  appData.goals.push({
    name: nameValue,
    target: targetValue,
    createdAt: new Date().toISOString(),
  });
  localStorage.setItem("appData", JSON.stringify(appData));
  updateGoalsUI();
});

let updateGoalsUI = () => {
  const goalsContainer = document.getElementById("goalDiv");
  goalsContainer.innerHTML = "";

  appData.goals.forEach((goal) => {
    const progressPercent = Math.min(
      (appData.savings.total / goal.target) * 100,
      100
    );

    const goalCard = document.createElement("div");
    goalCard.classList.add("col-lg-6", "col-12");
    goalCard.innerHTML = `
      <div class="rounded-4 p-3 shadow-sm" style="background-color: rgba(187, 236, 255, 0.226);">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <h6 class="mb-0 fw-bold">${goal.name}</h6>
        </div>
        <div class="progress mb-2" style="height: 8px">
          <div class="progress-bar bg-info" style="width: ${progressPercent}%"></div>
        </div>
        <div class="d-flex justify-content-between small text-secondary mb-3">
          <span>Saved: ${appData.savings.total} L.E</span>
          <span>Target: ${goal.target} L.E</span>
        </div>
      </div>
    `;

    goalsContainer.appendChild(goalCard);
  });

  updateSavingsUI();
};

function updateTransactionsUI() {
  const transactionsList = document.getElementById("transactionsList");
  transactionsList.innerHTML = ""; // نمسح القديم

  // 1️⃣ أولاً الـ Income
  if (appData.income) {
    const incomeDiv = document.createElement("div");
    incomeDiv.classList.add(
      "bg-success-subtle",
      "p-3",
      "rounded-3",
      "d-flex",
      "align-items-center",
      "mb-3",
      "justify-content-between"
    );
    incomeDiv.innerHTML = `
      <div class="d-flex align-items-center">
        <i class="fa-solid fa-circle-up text-success fs-4 me-4"></i>
        <div>
          <h5 class="mb-0">Income: L.E ${appData.income}</h5>
          <p class="mb-0 fw-light" style="font-size: 12px">Added amount</p>
        </div>
      </div>
      <div>
        <p class="text-secondary mb-0 text-center" style="font-size: 10px;">${new Date().toLocaleDateString()}</p>
        <p class="text-secondary mb-0 text-center" style="font-size: 10px;">${new Date().toLocaleTimeString()}</p>
      </div>
    `;
    transactionsList.appendChild(incomeDiv);
  }

  // 2️⃣ بعدين الـ Expenses
  for (let category in appData.expenses) {
    appData.expenses[category].forEach((exp) => {
      const expDiv = document.createElement("div");
      expDiv.classList.add(
        "bg-danger-subtle",
        "p-3",
        "rounded-3",
        "d-flex",
        "align-items-center",
        "mb-3",
        "justify-content-between"
      );
      expDiv.innerHTML = `
        <div class="d-flex align-items-center">
          <i class="fa-solid fa-circle-down text-danger fs-4 me-4"></i>
          <div>
            <h5 class="mb-0">${category}: ${exp.title} L.E ${exp.amount}</h5>
            <p class="mb-0 fw-light" style="font-size: 12px">${exp.note}</p>
          </div>
        </div>
        <div>
          <p class="text-secondary mb-0 text-center" style="font-size: 10px;">${new Date(
            exp.date
          ).toLocaleDateString()}</p>
          <p class="text-secondary mb-0 text-center" style="font-size: 10px;">${new Date(
            exp.date
          ).toLocaleTimeString()}</p>
        </div>
      `;
      transactionsList.appendChild(expDiv);
    });
  }
}

window.addEventListener("load", function () {
  for (let category in appData.expenses) {
    updateCategoryTotal(category);
  }

  updateBalance();
  getTotalExpenses();
  updateSavingsUI();
  updateGoalsUI();
  updateTransactionsUI();
});
