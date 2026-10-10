const API_BASE_URL = "https://hireshield-m5dh.onrender.com/api";

function saveToken(token) {
    localStorage.setItem("hireshield_token", token);
}

function getToken() {
    return localStorage.getItem("hireshield_token");
}

function removeToken() {
    localStorage.removeItem("hireshield_token");
}