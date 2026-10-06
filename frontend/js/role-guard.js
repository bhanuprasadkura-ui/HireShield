const token = getToken();
const role = localStorage.getItem("hireshield_role");
const expectedRole = document.body.dataset.role;

if (!token || role !== expectedRole) {
    window.location.href = "../login.html";
}