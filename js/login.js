// login.js
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const loginMessage = document.getElementById("loginMessage");

  loginMessage.textContent = "";

  try {
    const response = await fetch("api/login.php", {
      method: "POST",
      // credentials: 'include', // uncomment if front-end & back-end are on different domains
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const result = await response.json();

    if (result.status === "success") {
      window.location.href = "index.html";
    } else {
      loginMessage.textContent = result.message || "Invalid credentials.";
    }
  } catch (error) {
    console.error("Error:", error);
    loginMessage.textContent = "Something went wrong. Please try again.";
  }
});
