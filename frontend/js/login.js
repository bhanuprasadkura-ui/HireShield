const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

const LOGIN_API_URL =
    "http://localhost:8080/api/auth/login";

loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;

    loginMessage.textContent =
        "Logging in...";

    loginMessage.style.color = "";

    try {

        const response = await fetch(
            LOGIN_API_URL,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email: email,
                    password: password
                })
            }
        );

        const responseText =
            await response.text();

        let data = {};

        if (responseText.trim() !== "") {

            try {

                data = JSON.parse(responseText);

            } catch (jsonError) {

                data = {};
            }
        }

        if (!response.ok) {

            throw new Error(
                data.message ||
                responseText ||
                `Login failed. Server returned ${response.status}.`
            );
        }

        if (!data.token) {

            throw new Error(
                "Login response did not contain a token."
            );
        }

        saveToken(data.token);

        localStorage.setItem(
            "hireshield_role",
            data.role
        );

        localStorage.setItem(
            "hireshield_user",
            JSON.stringify(data)
        );

        loginMessage.textContent =
            "Login successful!";

        loginMessage.style.color =
            "#16a34a";

        if (data.role === "CANDIDATE") {

            window.location.href =
                "candidate/dashboard.html";

        } else if (data.role === "RECRUITER") {

            window.location.href =
                "recruiter/dashboard.html";

        } else {

            window.location.href =
                "index.html";
        }

    } catch (error) {

        console.error(
            "Login error:",
            error
        );

        loginMessage.textContent =
            error.message ||
            "Login failed.";

        loginMessage.style.color =
            "#dc2626";
    }

});