// scripts/listening.js

document.addEventListener("DOMContentLoaded", function () {
    // Menginisialisasi audio berdasarkan halaman saat ini
    let audio;
    const soundIcon = document.querySelector(".sound-icon img");
    const replaysLeftElement = document.getElementById("replaysLeft");
    let replaysLeft = sessionStorage.getItem("replaysLeft")
        ? parseInt(sessionStorage.getItem("replaysLeft"))
        : 3;

    // Menentukan file audio berdasarkan halaman
    const currentPage = window.location.pathname.split("/").pop();

    if (currentPage === "listening.html") {
        audio = new Audio("music/HowWouldYouFeel.m4a");
    } else if (currentPage === "listening2.html") {
        audio = new Audio("music/PaintMyLove.m4a");
    } else if (currentPage === "listening3.html") {
        audio = new Audio("music/PaintMyLove.m4a");
    }

    // Event listener untuk ikon suara
    if (soundIcon) {
        soundIcon.addEventListener("click", function () {
            if (replaysLeft > 0) {
                audio.currentTime = 0;
                audio.play();
                replaysLeft--;
                replaysLeftElement.textContent = replaysLeft;
                sessionStorage.setItem("replaysLeft", replaysLeft);
            } else {
                alert("No more replays left.");
            }
        });
    }

    // Mengupdate tampilan replays left saat halaman dimuat
    replaysLeftElement.textContent = replaysLeft;
});

// Mengambil elemen tombol Next
const nextButton = document.querySelector('.next-button');

// Menambahkan event listener pada tombol Next
nextButton.addEventListener('click', () => {
  // Mengarahkan pengguna ke halaman listening2.html
  window.location.href = 'listening2.html';
});