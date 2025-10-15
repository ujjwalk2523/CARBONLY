document.addEventListener("DOMContentLoaded", () => {
  // SIGNUP FORM
  const signupForm = document.querySelector('.auth-form[action="/signup"]');
  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = signupForm.querySelector('input[name="email"]').value.trim();
      const password = signupForm.querySelector('input[name="password"]').value;

      if (!email || !password) {
        alert("Email and password are required!");
        return;
      }

      // Load saved users
      let users = JSON.parse(localStorage.getItem("users")) || [];

      // Prevent duplicate accounts
      if (users.find(u => u.email === email)) {
        alert("User already exists! Please log in.");
        window.location.href = "login.html";
        return;
      }

      // Save new user
      users.push({ email, password });
      localStorage.setItem("users", JSON.stringify(users));

      alert("✅ Signup successful! You can now login.");
      window.location.href = "login.html";
    });
  }

  // LOGIN FORM
  const loginForm = document.querySelector('.auth-form[action="/login"]');
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = loginForm.querySelector('input[name="email"]').value.trim();
      const password = loginForm.querySelector('input[name="password"]').value;

      let users = JSON.parse(localStorage.getItem("users")) || [];

      const user = users.find(u => u.email === email && u.password === password);

      if (user) {
        alert("✅ Login successful!");
        localStorage.setItem("loggedInUser", JSON.stringify(user));
        window.location.href = "dashboard.html"; 
      } else {
        alert("❌ Invalid email or password!");
      }
    });
  }
});
