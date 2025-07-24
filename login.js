  document.querySelector("#login-btn").addEventListener('click', async function (e) {
    e.preventDefault();

    const enteredUsername = document.getElementById("username").value;
    const enteredPassword = document.getElementById("password").value;

    const payload = {
    username: enteredUsername,
    password: enteredPassword
  };

    localStorage.setItem("username", enteredUsername);
    
 try {
    const response = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const error = await response.json();
      alert("Login failed: " + error.message);
      return;
    }

    const data = await response.json();

    //  Save token in localStorage
    localStorage.setItem("token", data.access_token);

    // Navigate to contacts page 
    window.location.href = "home.html";

  } catch (error) {
    console.error("Login error:", error);
    alert("An error occurred during login.");
  }
});