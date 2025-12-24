

let appData = JSON.parse(localStorage.getItem("appData")) || {
  client: {
    firstName: "",
    lastName: "",
    image: "",
  },

  income: 0,


  expenses: {
    food: [],
    groceries: [],
    shopping: [],
    transport: [],
    entertainment: [],
    utilities: [],
    health: [],
    other: []
  },

  savings: {
    total: 0,
    history: []
  },

  goals: []
};

localStorage.setItem("appData", JSON.stringify(appData));





const fileInput = document.getElementById("fileInput");
const imgPreview = document.getElementById("imgPreview");
const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const submitBtn = document.getElementById("submitBtn");

fileInput.addEventListener("change", function ()  {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target.result;
      appData.client.image = imageData;
      imgPreview.style.backgroundImage = `url(${imageData})`;
      imgPreview.innerHTML = "";
      imgPreview.style.backgroundSize = "cover";
      imgPreview.style.backgroundPosition = "center";
    };

    reader.readAsDataURL(file);
  }
});

submitBtn.addEventListener("click", () => {
  appData.client.firstName = firstName.value.trim();
  appData.client.lastName = lastName.value.trim();

  if (!appData.client.image) {
    Swal.fire({
      icon: "warning",
      title: "Warning",
      text: "Please select an image",
      confirmButtonText: "OK",
      confirmButtonColor: "#0d6efd",
    });
    return;
  }

  if (!appData.client.firstName && !appData.client.lastName) {
    Swal.fire({
      icon: "warning",
      title: "Missing Information",
      text: "Please enter your first and last name",
      confirmButtonText: "OK",
      confirmButtonColor: "#0d6efd",
    });
    return;
  } else if (!appData.client.firstName) {
    Swal.fire({
      icon: "warning",
      title: "Missing Information",
      text: "Please enter your first name",
      confirmButtonText: "OK",
      confirmButtonColor: "#0d6efd",
    });
    return;
  } else if (!appData.client.lastName) {
    Swal.fire({
      icon: "warning",
      title: "Missing Information",
      text: "Please enter your last name",
      confirmButtonText: "OK",
      confirmButtonColor: "#0d6efd",
    });
    return;
  }

  localStorage.setItem("appData", JSON.stringify(appData));

  window.location.href = "dashboard.html";
});



window.addEventListener("load", () => {
  const storedData = localStorage.getItem("appData");
  if (storedData) {
    const data = JSON.parse(storedData);

    if (data.client.firstName && data.client.lastName) {
      window.location.href = "dashboard.html";
    }
  }
});



