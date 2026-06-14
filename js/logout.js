// logout.js - JavaScript code for the logout functionality of the Mood Lane application. This script handles logout clicks from the sidebar, sends a request to the backend API to destroy the user's session, and redirects the user to the login page.
document.querySelectorAll(".sidebar-nav-button.logout, #logoutBtn").forEach((logoutElement) => {
  logoutElement.addEventListener("click", async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("api/logout.php", {
        method: "GET",
        credentials: "same-origin",
      });

      const result = await response.json();

      if (result.status === "success") {
        window.location.href = "login.html";
        return;
      }

      console.error("Logout failed");
      window.location.href = "login.html";
    } catch (error) {
      console.error("Logout error:", error);
      window.location.href = "login.html";
    }
  });
});
