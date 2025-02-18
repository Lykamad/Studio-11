import { APIKEY, BASE_URL } from "./config.js";
import { logout, getToken, getRol } from "./auth.js";

const workshopBox = document.getElementById("workshop-box");
const buttonContainer = document.getElementById("button-container");
const formCreate = document.getElementById("form-create");

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
    return;
  }

  const result = await response.json();
  printWorkshops(result);
}

// Función para pintar talleres
function printWorkshops(allWorkshops) {
  const currentUserRol = getRol();
  workshopBox.innerHTML = "";
  buttonContainer.innerHTML = "";

  // if(currentUserRol === "USER" || "ALUMNO"){
  //   allWorkshops.forEach((workshop) => {
  //     let btnInscribir = "";

  //     btnInscribir = `
  //       <button data-id="${workshop.id}" class="inscription-btn">
  //         Inscríbete
  //       </button>
  //     `;
  //   })
    
  // }

  // Mostrar botón para crear talleres si es ADMIN
  if (currentUserRol === "ADMIN") {
    const btnFormCreate = `
      <button class="form-create-btn" id="btn-form-create">
        Crear Nuevo Taller
      </button>
    `;
    buttonContainer.innerHTML = btnFormCreate;

    // Evento para mostrar/ocultar el formulario
    const btnFormCreateElement = document.getElementById("btn-form-create");
    btnFormCreateElement.addEventListener("click", () => {
      formCreate.classList.toggle("hidden");
    });
  }

  // Recorrer y mostrar talleres
  allWorkshops.forEach((workshop) => {
    let btnDelete = "";
    let btnModif = "";

    // Si el usuario es ADMIN aparecerán los botoner Eliminar y Modificar
    if (currentUserRol === "ADMIN") {
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
        <h2>${workshop.name}</h2>
        <p class="description">${workshop.description}</p>
        <p class="description">Plazas: ${workshop.plazas}</p>
        <p class="description">Fecha: ${workshop.fecha}</p>
        <p class="description">Precio: ${workshop.precio}€</p>
        ${btnDelete} ${btnModif}
        <form></form>
      </div>
    `;
  });

  // Evento para eliminar talleres
  const btnsDelete = document.querySelectorAll(".delete-btn");
  btnsDelete.forEach((button) => {
    const workshopId = button.getAttribute("data-id");
    button.addEventListener("click", () => {
      deleteWorkshop(workshopId);
    });
  });

  // Evento para modificar talleres
  const btnsUpdate = document.querySelectorAll(".modif-btn");
  btnsUpdate.forEach((button) => {
    const workshopId = button.getAttribute("data-id");
    button.addEventListener("click", () => {
      updateWorkshop(workshopId);
    });
  });
}

// Función para crear un nuevo taller
async function createWorkshop() {
  const inputName = document.getElementById("name").value;
  const inputDescription = document.getElementById("description").value;
  const inputPlazas = document.getElementById("plazas").value;
  const inputFecha = document.getElementById("fecha").value;
  const inputPrecio = document.getElementById("precio").value;


  const requestOptions = {
    method: "POST",
    headers: {
      apikey: APIKEY,
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({
      name: inputName,
      description: inputDescription,
      plazas: inputPlazas,
      fecha: inputFecha,
      precio: inputPrecio,
    }),
  };

  const response = await fetch(
    `${BASE_URL}/rest/v1/workshops_Studio11`,
    requestOptions
  );
  if (!response.ok) {
    alert("Error en la creación del taller");
    return false;
  }

  formCreate.classList.add("hidden"); // Ocultar el formulario tras crear el taller
  getWorkshops(); // Actualizar lista de talleres
}

//Función borrar taller
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

//Función modificar taller
async function updateWorkshop(workshopId) {
  const newInputName = document.getElementById("new-name").value;
  const newInputDescription = document.getElementById("new-description").value;
  const newInputPlazas = document.getElementById("new-plazas").value;
  const newInputFecha = document.getElementById("new-fecha").value;
  const newInputPrecio = document.getElementById("new-precio").value;

  const requestOptions = {
    method: "PATCH",
    headers: {
      apikey: APIKEY,
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({
      name: newInputName,
      description: newInputDescription,
      plazas: newInputPlazas,
      fecha: newInputFecha,
      precio: newInputPrecio,
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

// Evento para guardar el taller nuevo
const saveWorkshopBtn = document.getElementById("save-workshop-btn");
saveWorkshopBtn.addEventListener("click", createWorkshop);

getWorkshops();
