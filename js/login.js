document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const res = await fetch('https://ielts9-bd6ed6993727.herokuapp.com/auth/login', { // Use the full URL of the backend server
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      if(res.ok){
        // Handle successful login
        window.location.href = `https://ielts9.vercel.app/main-page.html?token=${data.token}`; // Redirect to frontend
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }
  });

  // Google OAuth button
  const googleButton = document.querySelector('.oauth-button.google');
  googleButton.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = 'https://ielts9-bd6ed6993727.herokuapp.com/oauth/google';
  });
});