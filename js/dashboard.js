const storedData = localStorage.getItem("appData");
const appData = storedData
  ? JSON.parse(storedData)
  : {
      expenses: {},
      savings: { total: 0, history: [] },
      goals: [],
    };

if (storedData) {
  const avatar = document.getElementById("avatar");
  const name = document.getElementById("name");

  if (appData.client?.image && avatar) {
    avatar.style.backgroundImage = `url(${appData.client.image})`;
    avatar.style.backgroundSize = "cover";
    avatar.style.backgroundPosition = "center";
  }
  if (appData.client?.firstName && appData.client?.lastName) {
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
    mainBalance.innerHTML = appData.income;
    openModal.classList.add("d-none");
    incomeInput.value = "";
  } else {
    Swal.fire("Error", "Enter valid amount", "error");
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
});

function updateCategoryTotal(category) {
  const card = document.querySelector(
    `.category-card[data-category="${category}"]`
  );
  if (!card) return;

  const totalElem = card.querySelector(".category-total");
  let total = 0;

  appData.expenses[category].forEach((e) => (total += e.amount));
  totalElem.innerText = total.toFixed(2);
}

function updateBalance() {
  const headBalance = document.getElementById("headBalance");
  const remainingBalance = document.getElementById("remainingBalance");

  let totalExpenses = 0;
  for (let c in appData.expenses) {
    appData.expenses[c].forEach((e) => (totalExpenses += e.amount));
  }

  const totalSavings = appData.savings.total || 0;
  const balance = appData.income - totalExpenses - totalSavings;

  remainingBalance.innerText = `L.E ${balance}`;
  headBalance.innerText = `Balance : ${balance} L.E`;
}

function getTotalExpenses() {
  const expensesBalance = document.getElementById("expensesBalance");
  let total = 0;

  for (let c in appData.expenses) {
    appData.expenses[c].forEach((e) => (total += e.amount));
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

  savingsList.innerHTML = "";

  
  if (appData.savings.history.length === 0) {
    savingsList.innerHTML =
      `<p class="text-center text-secondary">No savings yet</p>`;
  } else {
    appData.savings.history.forEach((s) => {
      const div = document.createElement("div");
      div.className = "p-3 border rounded mb-2";
      div.innerHTML = `<strong>${s.amount} L.E</strong>`;
      savingsList.appendChild(div);
    });
  }

  totalElem.textContent = `Total: L.E ${appData.savings.total}`;
  updateBalance();
}

const addGoalBtn = document.getElementById("addGoalBtn");
const goalName = document.getElementById("goalName");
const goalTarget = document.getElementById("goalTarget");

addGoalBtn.addEventListener("click", function () {
  const nameValue = goalName.value.trim();
  const targetValue = +goalTarget.value.trim();

  if (!nameValue || targetValue <= 0) {
    Swal.fire("Warning", "Enter valid data", "warning");
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

function updateGoalsUI() {
  const goalsContainer = document.getElementById("goalDiv");
  goalsContainer.innerHTML = "";

 
  if (appData.goals.length === 0) {
    goalsContainer.innerHTML =
      `<p class="text-center text-secondary">No goals yet</p>`;
    return;
  }

  appData.goals.forEach((goal) => {
    const percent = Math.min(
      (appData.savings.total / goal.target) * 100,
      100
    );

    const div = document.createElement("div");
    div.className = "col-12 mb-3";
    div.innerHTML = `
      <h6>${goal.name}</h6>
      <div class="progress">
        <div class="progress-bar" style="width:${percent}%"></div>
      </div>
    `;
    goalsContainer.appendChild(div);
  });
}

function updateTransactionsUI() {
  const list = document.getElementById("transactionsList");
  list.innerHTML = "";

  let hasTransactions = false;

  if (appData.income) {
    hasTransactions = true;
    list.innerHTML += `<p>Income: ${appData.income} L.E</p>`;
  }

  for (let c in appData.expenses) {
    appData.expenses[c].forEach(() => (hasTransactions = true));
  }


  if (!hasTransactions) {
    list.innerHTML =
      `<p class="text-center text-secondary">No transactions yet</p>`;
  }
}

window.addEventListener("load", function () {
  for (let c in appData.expenses) updateCategoryTotal(c);
  updateBalance();
  getTotalExpenses();
  updateSavingsUI();
  updateGoalsUI();
  updateTransactionsUI();
});
