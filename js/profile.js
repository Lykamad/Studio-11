
import { logout, getToken, getRol } from "./auth.js";

const btnLogout = document.getElementById("logout");
if (btnLogout) {
  btnLogout.addEventListener("click", logout);
}

const currentUserRol = getRol();

if (currentUserRol === "ADMIN"){
    const container = document.querySelectorAll("perfil-rol");
    container.innerHTML = `<h2>Ha iniaciado como ${currentUserRol}</h2>`
}
