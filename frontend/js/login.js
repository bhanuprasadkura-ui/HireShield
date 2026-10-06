const loginForm = document.getElementById("loginForm");

const loginMessage = document.getElementById("loginMessage");


loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();


    const email =
        document.getElementById("email").value.trim();


    const password =
        document.getElementById("password").value;


    loginMessage.textContent =
        "Logging in...";


    try {

        const response = await fetch(
            `${API_BASE_URL}/auth/login`,
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


        if (!response.ok) {

            throw new Error(
                "Invalid email or password."
            );

        }


        const data =
            await response.json();


        /*
         * Save JWT token
         */

        saveToken(data.token);


        /*
         * Save role
         */

        localStorage.setItem(
            "hireshield_role",
            data.role
        );


        /*
         * Save complete login response
         */

        localStorage.setItem(
            "hireshield_user",
            JSON.stringify(data)
        );


        loginMessage.textContent =
            "Login successful!";


        /*
         * Redirect based on role
         */

        if (data.role === "CANDIDATE") {

            window.location.href =
                "candidate/dashboard.html";

        }

        else if (data.role === "RECRUITER") {

            window.location.href =
                "recruiter/dashboard.html";

        }

        else {

            window.location.href =
                "index.html";

        }

    }


    catch (error) {

        loginMessage.textContent =
            error.message;

    }

});