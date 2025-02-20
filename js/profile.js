
import { logout, getToken, getRol, getUserId, getUserEmail } from "./auth.js";
import { APIKEY, BASE_URL } from "./config.js";

const btnLogout = document.getElementById("logout");
if (btnLogout) {
  btnLogout.addEventListener("click", logout);
}

const currentUserRol = getRol();
const currentUserEmail = getUserEmail();

if (currentUserRol === "ADMIN"){
    const container = document.getElementById("perfil-rol");
    container.innerHTML = `<h3>Ha iniciado sesión como ${currentUserRol}</h3>`
} else {
    const container = document.getElementById("perfil-rol");
    container.innerHTML = `<h3>Ha iniciado sesión como ${currentUserRol}</h3><br>
    <p>Estado de sus inscipciones:</p>
    `
    await getStatusInscripcion();
    const email = document.getElementById("current-email");
    email.innerHTML = `<p>Su email actual es: ${currentUserEmail}</p>`
}


async function getStatusInscripcion() {
  const requestOptions = {
    method: "GET",
    headers: {
      apikey: APIKEY,
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  };

  const response = await fetch(
    `${BASE_URL}/rest/v1/usersstudio?user_id=eq.${getUserId()}`,
    requestOptions
  );
  if (!response.ok) {
    alert("Error al encontrar los grupos");
    return;
  }

  const result = await response.json();

  if (result.length > 0) {
    const userInfo = result[0]

    const inscripciones = document.getElementById("inscripciones");

    if (userInfo.taichi_status) {
      inscripciones.innerHTML += `<li><span class="bold">Tai Chi</span> (${userInfo.taichi_status == "PENDING" ? "Pendiente de aprobación" : "Inscripcion Activa"})</li>`
    }
    if (userInfo.pilates_status) {
      inscripciones.innerHTML += `<li><span class="bold">Pilates</span> (${userInfo.pilates_status == "PENDING" ? "Pendiente de aprobación" : "Inscripcion Activa"})</li>`
    }
    console.log("userStatusInscripcion", result[0])
    
  }

}

