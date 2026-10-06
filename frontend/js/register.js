const registerForm =
    document.getElementById("registerForm");

const registerMessage =
    document.getElementById("registerMessage");


registerForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const name =
            document.getElementById("name").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value;

        const role =
            document.getElementById("role").value;


        registerMessage.textContent =
            "Creating your account...";


        try {

            const response = await fetch(
                `${API_BASE_URL}/users/register`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name: name,
                        email: email,
                        password: password,
                        role: role
                    })
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Registration failed."
                );

            }


            registerMessage.textContent =
                "Account created successfully!";


            registerMessage.style.color =
                "#16a34a";


            registerForm.reset();


            setTimeout(function () {

                window.location.href =
                    "login.html";

            }, 1500);

        }


        catch (error) {

            registerMessage.textContent =
                error.message;

            registerMessage.style.color =
                "#dc2626";

        }

    }
);