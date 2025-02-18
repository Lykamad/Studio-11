import { APIKEY, BASE_URL } from "./config.js";
import { logout, getToken, getRol } from "./auth.js";

const workshopBox = document.getElementById("workshop-box");
const buttonContainer = document.getElementById("button-container");
const formCreate = document.getElementById("form-create");

const btnLogout = document.getElementById("logout");
if (btnLogout) {
  btnLogout.addEventListener("click", logout);
}

async function getClases() {
  const requestOptions = {
    method: "GET",
    headers: {
      apikey: APIKEY,
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  };

  const response = await fetch(
    `${BASE_URL}/rest/v1/clases_Studio11`,
    requestOptions
  );
  if (!response.ok) {
    alert("Error al encontrar los talleres");
    return;
  }

  const result = await response.json();
  printClases(result);
}

// Función para pintar talleres
function printClases(allClases) {
  const currentUserRol = getRol();
  workshopBox.innerHTML = "";
  buttonContainer.innerHTML = "";

  // Mostrar botón para crear talleres si es ADMIN
  if (currentUserRol === "ADMIN") {
    const btnFormCreate = `
      <button class="form-create-btn" id="btn-form-create">
        Crear Nueva Clase
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
  allClases.forEach((clase) => {
    let btnDelete = "";
    let btnModif = "";

    // Si el usuario es ADMIN aparecerán los botoner Eliminar y Modificar
    if (currentUserRol === "ADMIN") {
      btnDelete = `
        <button data-id="${clase.id}" class="delete-btn">
          Eliminar
        </button>
      `;
      btnModif = `
        <button data-id="${clase.id}" class="modif-btn">
          Modificar
        </button>
      `;
    }

    workshopBox.innerHTML += `
      <div class="workshop-content">
        <h2>${clase.name}</h2>
        <p class="description">${clase.description}</p>
        <p class="description">Plazas: ${clase.plazas}</p>
        <p class="description">Fecha: ${clase.fecha}</p>
        ${btnDelete} ${btnModif}
        <form></form>
      </div>
    `;
  });

  // Evento para eliminar talleres
  const btnsDelete = document.querySelectorAll(".delete-btn");
  btnsDelete.forEach((button) => {
    const claseId = button.getAttribute("data-id");
    button.addEventListener("click", () => {
      deleteClase(claseId);
    });
  });

  // Evento para modificar talleres
  const btnsUpdate = document.querySelectorAll(".modif-btn");
  btnsUpdate.forEach((button) => {
    const claseId = button.getAttribute("data-id");
    button.addEventListener("click", () => {
      updateClase(claseId);
    });
  });
}

// Función para crear un nuevo taller
async function createClase() {
  const inputName = document.getElementById("name").value;
  const inputDescription = document.getElementById("description").value;
  const inputPlazas = document.getElementById("plazas").value;
  const inputFecha = document.getElementById("fecha").value;
  // const newWorkshop = readNewInputs();

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
    }),
  };

  const response = await fetch(
    `${BASE_URL}/rest/v1/clases_Studio11`,
    requestOptions
  );
  if (!response.ok) {
    alert("Error en la creación del taller");
    return false;
  }

  formCreate.classList.add("hidden"); // Ocultar el formulario tras crear el taller
  getClases(); // Actualizar lista de talleres
}

//Función borrar taller
async function deleteClase(claseId) {
  const requestOptions = {
    method: "DELETE",
    headers: {
      apikey: APIKEY,
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  };

  const response = await fetch(
    `${BASE_URL}/rest/v1/clases_Studio11?id=eq.${claseId}`,
    requestOptions
  );
  if (!response.ok) {
    alert("Error en la petición DELETE");
    return false;
  }

  getClases();
}

//Función modificar taller
async function updateClase(claseId) {
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
    `${BASE_URL}/rest/v1/clases_Studio11?id=eq.${claseId}`,
    requestOptions
  );
  if (!response.ok) {
    alert("Error en la petición UPDATE");
    return false;
  }

  getClases();
}

// Evento para guardar el taller nuevo
const saveWorkshopBtn = document.getElementById("save-workshop-btn");
saveWorkshopBtn.addEventListener("click", createClase);

getClases();
