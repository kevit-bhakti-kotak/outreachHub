let validUsers = [
    { email: "admin@gmail.com", password: "admin123" },
    { email: "krish@gmail.com", password: "krish123" },
    { email: "bhakti@gmail.com", password: "bhakti123" },
    { email: "diya@gmail.com", password: "diya123" },
    { email: "nidhi@gmail.com", password: "nidhi123" }
  ];
  


  document.querySelector("#login-btn").addEventListener('click', function (e) {
    e.preventDefault();

    const enteredEmail = document.getElementById("email").value;
    const enteredPassword = document.getElementById("password").value;

    //to Check if entered credentials match any in the array
    console.log(enteredEmail);
    localStorage.setItem("loggedInEmail", enteredEmail);
    

    if (validUsers.some(user => 
      user.email === enteredEmail && user.password === enteredPassword))
        {
        window.location.href = "./home.html";
        } else {
            document.getElementById("error").style.display = "block";
                }
  });

    
   if (document.querySelector("#welcome-msg")) {
  const email = localStorage.getItem("loggedInEmail");

  if (email) {
    const username = email.split("@")[0];
    document.querySelector("#welcome-msg").textContent = `Welcome ${username}`;
  } 
}