const API_BASE_URL = "/api";

function saveToken(token) {
    localStorage.setItem("hireshield_token", token);
}

function getToken() {
    return localStorage.getItem("hireshield_token");
}

function removeToken() {
    localStorage.removeItem("hireshield_token");
}