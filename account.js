window.addEventListener("DOMContentLoaded", () => {
  const accountForm = document.getElementById("accountForm");

  // Load saved data if available
  const savedData = JSON.parse(localStorage.getItem("accountData"));
  if (savedData) {
    document.getElementById("firstName").value = savedData.firstName || "";
    document.getElementById("lastName").value = savedData.lastName || "";
    document.getElementById("jobTitle").value = savedData.jobTitle || "";
    document.getElementById("companyName").value = savedData.companyName || "";
    document.getElementById("email").value = savedData.email || "ujjwalbhumi0@gmail.com";
    document.getElementById("phone").value = savedData.phone || "";
    document.getElementById("password").value = savedData.password || "";
    document.getElementById("language").value = savedData.language || "English";
  }

  // Save data on submit
  accountForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const userData = {
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      jobTitle: document.getElementById("jobTitle").value,
      companyName: document.getElementById("companyName").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      password: document.getElementById("password").value,
      language: document.getElementById("language").value,
    };

    localStorage.setItem("accountData", JSON.stringify(userData));
    alert("Account details saved successfully!");
  });
});
