document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        const userData = { username, password };
        const url = "http://localhost:4001/login";

        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        })
        .then((response) => response.json())
        .then((data) => {
            localStorage.setItem('userid',data.userID);
            localStorage.setItem('name',data.name);
            localStorage.setItem('token',data.token);
             if (data.codeNumber === 1) {
                alert("User Login successfully!");
                window.location = "/landing";
            } else {
                alert("Login failed. Please try again.");
            }
        })
        .catch((error) => {
            console.error("Error:", error);
            alert("An error occurred. Please try again later.");
        });
    });
});