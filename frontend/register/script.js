document.addEventListener("DOMContentLoaded", function () {

    const registerForm = document.getElementById("register-form");

    registerForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const firstname = document.getElementById("firstname").value;
        const lastname = document.getElementById("lastname").value;
        const gender = document.getElementById("gender").value;

        const userData = {username,password,firstname,lastname,gender,};
        
        const url = "http://localhost:4001/register";

        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.message == 200) {
                alert("User registered successfully!");
                window.location="/";
            } 
            else {
                alert("Registration failed. Please try again.");
            }
        })
        .catch((error) => {
            console.error("Error:", error);
            alert(error);
        });
    });
});