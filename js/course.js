// main-page.js
document.addEventListener("DOMContentLoaded", () => {
  // Get token from URL or localStorage
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");

  // If token exists in URL, save it
  if (token) {
    localStorage.setItem("token", token);
    // Remove token from URL
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  const storedToken = localStorage.getItem("token");
  
  // If no token found, redirect to login
  if (!storedToken) {
    window.location.href = "login.html";
    return;
  }

  // Verify token validity
  try {
    const payload = JSON.parse(atob(storedToken.split(".")[1]));
    const currentTime = Date.now() / 1000;
    
    if (payload.exp < currentTime) {
      // Token expired
      localStorage.removeItem("token");
      window.location.href = "login.html";
      return;
    }

    const username = payload.username;
    const profilePic = payload.profilePic || "images/default-profile.png"; // Use a default image if not available

    // Update the navbar with user info
    const userInfo = document.querySelector(".user-info");
    userInfo.innerHTML = `
      <a href="profile.html" class="profile-link">
        <span class="username">${username}</span>
        <img src="${profilePic}" alt="Profile Picture" class="profile-pic">
      </a>
      <button id="logoutBtn" class="btn logout">Logout</button>
    `;

    // Add logout functionality with SweetAlert
    const logoutBtn = document.getElementById("logoutBtn");

    // Function to get token from localStorage
    const getToken = () => {
      return localStorage.getItem("token");
    };

    // Set the backend server URL
    const backendUrl = "https://ielts9-bd6ed6993727.herokuapp.com"; // Ensure no trailing slash
    console.log("Backend URL set to:", backendUrl); // Debugging statement

    logoutBtn.addEventListener("click", () => {
      Swal.fire({
        title: "Are you sure?",
        text: "You will be logged out!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, logout!",
      }).then((result) => {
        if (result.isConfirmed) {
          // Send logout request to the server
          fetch(`${backendUrl}/auth/logout`, {
            method: "POST",
            credentials: "include", // Include cookies if any
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getToken()}`,
            },
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error("Network response was not ok");
              }
              return response.json();
            })
            .then((data) => {
              console.log(data.message); // Optional: Handle server response
              // Remove token from localStorage and redirect
              localStorage.removeItem("token");
              Swal.fire(
                "Logged Out!",
                "You have been successfully logged out.",
                "success"
              ).then(() => {
                window.location.href = "index.html";
              });
            })
            .catch((error) => {
              console.error("Error during logout:", error);
              // Even if server logout fails, proceed to remove token and redirect
              localStorage.removeItem("token");
              Swal.fire(
                "Logged Out!",
                "You have been successfully logged out.",
                "success"
              ).then(() => {
                window.location.href = "index.html";
              });
            });
        }
      });
    });

    // Register ChartDataLabels plugin if available
    if (typeof ChartDataLabels !== "undefined") {
      Chart.register(ChartDataLabels);
    } else {
      console.error("ChartDataLabels plugin is not loaded.");
    }

    // Initialize Progress Chart
    const progressChartCanvas = document.getElementById("progressChart");

    if (progressChartCanvas) {
      const ctx = progressChartCanvas.getContext("2d");
      let progressChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["Progress"],
          datasets: [
            {
              label: "Your Progress",
              data: [0],
              backgroundColor: ["#cccccc"], // Grey color for 0%
              borderColor: ["#000000"],
              borderWidth: 1,
            },
          ],
        },
        options: {
          indexAxis: "y", // Make the bar horizontal
          scales: {
            x: {
              beginAtZero: true,
              max: 100,
              ticks: {
                stepSize: 25, // Increment ticks by 25%
                callback: function (value) {
                  return value + "%";
                },
              },
            },
            y: {
              beginAtZero: true,
            },
          },
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              enabled: false,
            },
            // Add a plugin to display the percentage label
            datalabels: {
              anchor: "end",
              align: "right",
              formatter: (value) => {
                return value + "%";
              },
              color: "#000",
              font: {
                weight: "bold",
              },
            },
          },
        },
        plugins: [ChartDataLabels], // Ensure ChartDataLabels plugin is included
      });

      console.log("Progress chart initialized.");

      // Fetch user progress
      fetch(`${backendUrl}/auth/progress`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getToken()}`, // Ensure the token is correctly formatted
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log("Fetched progress:", data.progress);
          progressChart.data.datasets[0].data[0] = data.progress;
          progressChart.data.datasets[0].backgroundColor =
            data.progress > 0 ? "#63ce87" : "#cccccc"; // Green if progress > 0
          progressChart.update();
        })
        .catch((error) => console.error("Error fetching progress:", error));

      // Handle course card clicks
      const courseCards = document.querySelectorAll(".course-card");
      courseCards.forEach((card) => {
        const course = card.getAttribute("data-course"); // Get course identifier
        const parentLink = card.parentElement; // Get the parent <a> element
        const targetHref = parentLink.getAttribute("href"); // Get the target URL

        // Optionally, disable the card if already completed
        fetch(`${backendUrl}/auth/progress`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.completedCourses.includes(course)) {
              // Add a class to indicate completion
              card.classList.add("completed");
              // Disable the link
              parentLink.href = "#"; // Prevent navigation
            }
          })
          .catch((error) => console.error("Error checking completed courses:", error));

        card.addEventListener("click", (e) => {
          // Prevent default navigation
          e.preventDefault();

          // Check if the course is already completed
          if (card.classList.contains("completed")) {
            Swal.fire("Info", "You have already completed this course.", "info");
            return;
          }

          // Disable the card to prevent multiple clicks
          card.classList.add("disabled");
          card.style.pointerEvents = "none"; // Prevent further clicks visually

          // Send progress update to the server
          fetch(`${backendUrl}/auth/progress`, {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify({ course }), // Send course identifier
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.message === "Course already completed.") {
                Swal.fire("Info", "You have already completed this course.", "info");
                // Optionally mark as completed
                card.classList.add("completed");
                parentLink.href = "#"; // Prevent navigation
                return;
              }

              console.log("Updated progress:", data.progress);
              // Update progress chart
              progressChart.data.datasets[0].data[0] = data.progress;
              progressChart.data.datasets[0].backgroundColor =
                data.progress > 0 ? "#63ce87" : "#cccccc"; // Green if progress > 0
              progressChart.update();

              // Mark the course as completed
              card.classList.add("completed");
              parentLink.href = "#"; // Prevent navigation

              Swal.fire(
                "Good job!",
                "Your progress has been updated.",
                "success"
              ).then(() => {
                // Redirect to the course page
                window.location.href = targetHref;
              });
            })
            .catch((error) => {
              console.error("Error updating progress:", error);
              // Re-enable the card in case of error
              card.classList.remove("disabled");
              card.style.pointerEvents = "auto"; // Re-enable clicks
              Swal.fire(
                "Error",
                "There was an issue updating your progress. Please try again.",
                "error"
              );
            });
        });
      });
    } else {
      console.error('Canvas element with id "progressChart" not found.');
    }
  } catch (error) {
    console.error("Token verification failed:", error);
    localStorage.removeItem("token");
    window.location.href = "login.html";
  }
});
