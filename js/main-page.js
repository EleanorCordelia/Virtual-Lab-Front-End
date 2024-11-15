// main-page.js
document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");

  if (token) {
    localStorage.setItem("token", token);
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  const storedToken = localStorage.getItem("token");

  if (!storedToken) {
    window.location.href = "login.html";
    return;
  }

  // Verify token validity
  try {
    const payload = JSON.parse(atob(storedToken.split(".")[1]));
    const currentTime = Date.now() / 1000;

    if (payload.exp < currentTime) {
      localStorage.removeItem("token");
      window.location.href = "login.html";
      return;
    }

    // Update the navbar with user info
    const username = payload.username;
    const profilePic = payload.profilePic || "images/default-profile.png";
    const userInfo = document.querySelector(".user-info");
    userInfo.innerHTML = `
      <a href="profile.html" class="profile-link">
        <span class="username">${username}</span>
        <img src="${profilePic}" alt="Profile Picture" class="profile-pic">
      </a>
      <button id="logoutBtn" class="btn logout">Logout</button>
    `;

    // Add logout functionality
    const logoutBtn = document.getElementById("logoutBtn");
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      window.location.href = "login.html";
    });

  } catch (error) {
    console.error("Token verification failed:", error);
    localStorage.removeItem("token");
    window.location.href = "login.html";
  }
});