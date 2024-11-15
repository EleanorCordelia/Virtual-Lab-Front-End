document.addEventListener("DOMContentLoaded", () => {
  const storedToken = localStorage.getItem("token");

  if (!storedToken) {
    window.location.href = "login.html";
    return;
  }

  try {
    const payload = JSON.parse(atob(storedToken.split(".")[1]));
    const currentTime = Date.now() / 1000;

    if (payload.exp < currentTime) {
      localStorage.removeItem("token");
      window.location.href = "login.html";
      return;
    }

    // Token is valid, proceed to update profile
    updateProfileElements(payload);
    fetchUserProgress(storedToken);
  } catch (error) {
    console.error("Token verification failed:", error);
    localStorage.removeItem("token");
    window.location.href = "login.html";
  }

  // Panggil fungsi untuk mengatur foto profil
  setupProfilePicture();
});

function updateProfileElements(payload) {
  const { username, profilePic, email } = payload;

  document.getElementById("profile-image").src =
    profilePic || "images/profile-placeholder.svg";
  document.getElementById("userName").textContent = username;
  document.getElementById("userId").textContent = `User ID: ${
    payload.userId || "N/A"
  }`;
  document.querySelector(".user-info .username").textContent = username;
  document.querySelector(".user-info .profile-pic").src =
    profilePic || "images/profile-placeholder.svg";

  const joinDate = new Date(payload.joinDate);
  document.getElementById(
    "joinDate"
  ).textContent = `Joined: ${joinDate.toLocaleString("default", {
    month: "long",
  })} ${joinDate.getFullYear()}`;
}

function fetchUserProgress(token) {
  fetch("https://ielts9-bd6ed6993727.herokuapp.com//progress", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const progressElement = document.getElementById("progress");
      if (progressElement) {
        progressElement.textContent = `Progress: ${data.progress}%`;
      }
    })
    .catch((error) => console.error("Error fetching user progress:", error));
}

function setupProfilePicture() {
  const profilePictureInput = document.getElementById("fileInput");
  const fileStatus = document.getElementById("file-status");
  const editIcon = document.getElementById("editIcon");
  const profileImage = document.querySelector(".profile-pic");

  if (editIcon && profilePictureInput) {
    editIcon.addEventListener("click", () => {
      profilePictureInput.click();
    });
  } else {
    console.warn("editIcon atau profilePictureInput tidak ditemukan di DOM.");
  }

  if (profilePictureInput) {
    profilePictureInput.addEventListener("change", function (event) {
      const file = event.target.files[0];
      if (file) {
        // Lakukan sesuatu dengan file yang dipilih, misalnya upload
        // ...
      }
    });
  } else {
    console.warn("profilePictureInput tidak ditemukan di DOM.");
  }
}

function setupSignatureCanvas() {
  const canvas = document.getElementById("signatureCanvas");
  const ctx = canvas.getContext("2d");
  const clearButton = document.getElementById("clearSignature");
  const saveButton = document.getElementById("saveSignature");

  let drawing = false;

  // Load saved signature
  const savedSignature = localStorage.getItem("signature");
  if (savedSignature) {
    const img = new Image();
    img.onload = function () {
      ctx.drawImage(img, 0, 0);
    };
    img.src = savedSignature;
  }

  // Start drawing
  canvas.addEventListener("mousedown", function (e) {
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
  });

  // Draw
  canvas.addEventListener("mousemove", function (e) {
    if (drawing) {
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  });

  // Stop drawing
  canvas.addEventListener("mouseup", function () {
    drawing = false;
  });

  // Clear canvas
  clearButton.addEventListener("click", function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    localStorage.removeItem("signature");
    Swal.fire({
      title: "Cleared",
      text: "Tanda tangan telah dihapus.",
      icon: "info",
    });
  });

  // Save signature
  saveButton.addEventListener("click", function () {
    const dataURL = canvas.toDataURL("image/png");
    localStorage.setItem("signature", dataURL);
    Swal.fire({
      title: "Success",
      text: "Tanda tangan berhasil disimpan!",
      icon: "success",
    });
  });
}
