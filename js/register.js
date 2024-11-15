document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm');

  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const username = document.getElementById('username').value;

    try {
      const res = await fetch('https://ielts9-bd6ed6993727.herokuapp.com/auth/register', { // URL Heroku
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, username })
      });

      const data = await res.json();
      console.log(data); // Add this line to log the response
      if (res.ok) {
        alert(data.message);
        window.location.href = 'login.html';
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }
  });
});
