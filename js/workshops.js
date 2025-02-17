import { APIKEY, BASE_URL } from "./config.js";
import { logout, getToken, getRol } from "./auth.js";

const workshopBox = document.getElementById("workshop-box");

const btnLogout = document.getElementById("logout");
if (btnLogout) {
  btnLogout.addEventListener("click", logout);
}

async function getWorkshops() {
  const requestOptions = {
    method: "GET",
    headers: {
      apikey: APIKEY,
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  };

  const response = await fetch(
    `${BASE_URL}/rest/v1/workshops_Studio11`,
    requestOptions
  );
  if (!response.ok) {
    alert("Error al encontrar los talleres");
  }

  const result = await response.json();

  console.log(result);
  printWorkshops(result);
}

//Funcion pintar talleres
function printWorkshops(allWorkshops) {
  // el UserId del user actual
  const currentUserRol = getRol();
  // Vaciamos el div
  workshopBox.innerHTML = "";

  allWorkshops.forEach((workshop) => {
    let btnDelete = "";
    let btnModif = "";

    // somos admin?
    if (currentUserRol == "ADMIN") {
      btnDelete = `
                 <button data-id="${workshop.id}" class="delete-btn">
                     Eliminar
                 </button>
                 `;

      btnModif = `
                 <button data-id="${workshop.id}" class="modif-btn">
                     Modificar
                 </button>
                 `;
    }

    workshopBox.innerHTML += `
           <div class="workshop-content">
               <h2 class="">${workshop.name}</h2>
               <p class="description">${workshop.description}</p>
               <p class="description">Plazas: ${workshop.plazas}</p>
               <p class="description">Fecha: ${workshop.fecha}</p>
               <p class="description">Precio: ${workshop.precio}€</p>
               ${btnDelete} ${btnModif}
           </div>
           
           </div>
       `;
  });

  const btnsDelete = document.querySelectorAll(".delete-btn");
  btnsDelete.forEach((button) => {
    const workshopId = button.getAttribute("data-id");

    button.addEventListener("click", () => {
      deleteWorkshop(workshopId);
    });
  });

  const btnsModif = document.querySelectorAll(".modif-btn");
  btnsModif.forEach((button) => {
    const productId = button.getAttribute("data-id");

    button.addEventListener("click", () => {
      updateWorkshop(productId);
    });
  });
}

async function deleteWorkshop(workshopId) {
  const requestOptions = {
    method: "DELETE",
    headers: {
      apikey: APIKEY,
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  };

  const response = await fetch(
    `${BASE_URL}/rest/v1/workshops_Studio11?id=eq.${workshopId}`,
    requestOptions
  );
  if (!response.ok) {
    alert("Error en la petición DELETE");
    return false;
  }

  getWorkshops();
}

async function updateWorkshop(workshopId) {
  const requestOptions = {
    method: "PATCH",
    headers: {
      apikey: APIKEY,
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({
      name: "TALLER MODIFICADO3",
      description:
        "Taller para todos los niveles especializado en pilates aéreo con hamacas y agarres",
      plazas: 15,
      fecha: "2025-02-14 13:14:22",
      precio: 14,
    }),
  };

  const response = await fetch(
    `${BASE_URL}/rest/v1/workshops_Studio11?id=eq.${workshopId}`,
    requestOptions
  );
  if (!response.ok) {
    alert("Error en la petición UPDATE");
    return false;
  }

  getWorkshops();
}

getWorkshops();
