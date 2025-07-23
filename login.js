let validUsers = [
    { username: "editor", password: "editor" },
    { username: "reviewer", password: "reviewer" }
  ];
  

  document.querySelector("#login-btn").addEventListener('click', function (e) {
    e.preventDefault();

    const enteredUsername = document.getElementById("username").value;
    const enteredPassword = document.getElementById("password").value;

    //to Check if entered credentials match any in the array
    console.log(username);
    localStorage.setItem("username", enteredUsername);
    

    if (validUsers.some(user => 
      user.username === enteredUsername && user.password === enteredPassword))
        {
        window.location.href = "./home.html";
        } else {
            document.getElementById("error").style.display = "block";
                }
  });