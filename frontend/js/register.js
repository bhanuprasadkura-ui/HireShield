const registerForm = document.getElementById("registerForm");
const registerMessage = document.getElementById("registerMessage");

const REGISTER_API_URL =
    "https://hireshield-m5dh.onrender.com/api/users/register";

registerForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;

    registerMessage.textContent = "Creating your account...";
    registerMessage.style.color = "";

    try {
        const response = await fetch(REGISTER_API_URL, {
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
        });

        const responseText = await response.text();

        let data = {};

        if (responseText.trim() !== "") {
            try {
                data = JSON.parse(responseText);
            } catch {
                data = {};
            }
        }

        if (!response.ok) {
            throw new Error(
                data.message ||
                responseText ||
                `Registration failed. Server returned ${response.status}.`
            );
        }

        registerMessage.textContent = "Account created successfully!";
        registerMessage.style.color = "#16a34a";

        registerForm.reset();

        setTimeout(function () {
            window.location.href = "login.html";
        }, 1500);

    } catch (error) {
        console.error("Registration error:", error);

        registerMessage.textContent =
            error.message || "Registration failed.";

        registerMessage.style.color = "#dc2626";
    }
});