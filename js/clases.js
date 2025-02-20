import { APIKEY, BASE_URL } from "./config.js";
import { logout, getToken, getRol } from "./auth.js";

let allClases = [];
let allGrupos = [];


const workshopBox = document.getElementById("workshop-box");
const buttonContainer = document.getElementById("button-container");
const formCreate = document.getElementById("form-create");

// Edit modal
const editModal = document.getElementById("edit-modal");
if (editModal) {
  const closeModal = document.getElementById("close-modal");
  closeModal.addEventListener("click", hideEditModal);

  document.getElementById("save-edit").addEventListener("click", async () => {
    updateClase();
  });
}

// Group modal
const groupModal = document.getElementById("group-modal");
if (groupModal) {
  const closeModal = document.getElementById("close-modal2");
  closeModal.addEventListener("click", hideGroupsModal);


  };

const claseId = document.getElementById("claseId");
const nameEdit = document.getElementById("nameEdit");
const descriptionEdit = document.getElementById("descriptionEdit");
const plazasEdit = document.getElementById("plazasEdit");

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
    alert("Error al encontrar las clases");
    return;
  }

  const result = await response.json();
  allClases = result;
  printClases(result);
}

async function getGruposClases() {
  const requestOptions = {
    method: "GET",
    headers: {
      apikey: APIKEY,
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  };

  const response = await fetch(
    `${BASE_URL}/rest/v1/grupos_Studio11`,
    requestOptions
  );
  if (!response.ok) {
    alert("Error al encontrar los grupos");
    return;
  }

  const result = await response.json();
  allGrupos = result;
  console.log(allGrupos)
}

function printGrupos(claseName){ 
  const category = claseName == "Pilates" ? "Pilates" : "TaiChi";
  const currentGrupos = allGrupos.filter(grupo => grupo.categoria === category);
  const grupos = document.getElementById("grupos");
  grupos.innerHTML = "";
  currentGrupos.forEach((grupo) => {
    grupos.innerHTML += `<option value="${grupo.id}">${grupo.dias} - ${grupo.hora}</option>`;
  })
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
    let btnInscribir = "";

    // Si el usuario es ADMIN aparecerán los botones Eliminar y Modificar
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
    } else if (currentUserRol === "ALUMNO"){ //Si no se es ADMIN se mostrará el botón Inscribir
      btnInscribir = `
        <button data-id="${clase.id}" data-name="${clase.name}" class="inscribir-btn">
          Incribirse
        </button>
      `;
      
    } else {
      btnInscribir = `
        <button class="inscribir2-btn" type="button">
        <a href="../contacto.html">  Consulta más info de ${clase.name} </a>
        </button>
      `;
    }

    workshopBox.innerHTML += `
      <div class="workshop-content">
        <h2>${clase.name}</h2>
        <p class="description">${clase.description}</p>
        <p class="description">Plazas: ${clase.plazas}</p>
        ${btnDelete} ${btnModif} ${btnInscribir}
      </div>
    `;
  });

  // Evento para eliminar clases
  const btnsDelete = document.querySelectorAll(".delete-btn");
  btnsDelete.forEach((button) => {
    const claseId = button.getAttribute("data-id");
    button.addEventListener("click", () => {
      deleteClase(claseId);
    });
  });

  // Evento para modificar clases
  const btnsUpdate = document.querySelectorAll(".modif-btn");
  btnsUpdate.forEach((button) => {
    const claseId = button.getAttribute("data-id");
    button.addEventListener("click", () => {
      showEditModal(claseId);
    });
  });



  const btnsInscribir = document.querySelectorAll(".inscribir-btn");
  btnsInscribir.forEach((button) => {
    const claseId = button.getAttribute("data-id");
    const claseName = button.getAttribute("data-name"); 
    button.addEventListener("click", () => {
      showGroups(claseId);
      printGrupos(claseName);
    });
  });
}

// Función para crear un nueva clase
async function createClase() {
  const inputName = document.getElementById("name").value;
  const inputDescription = document.getElementById("description").value;
  const inputPlazas = document.getElementById("plazas").value;

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

  formCreate.classList.add("hidden"); // Ocultar el formulario tras crear la clase
  getClases(); // Actualizar lista de clases
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


// Funcion para enseñar el modal cuando modificamos una clase
function showEditModal(dataId) {
  editModal.style.display = "flex";
  const clase = allClases.find((clase) => clase.id == dataId);
  nameEdit.value = clase.name;
  descriptionEdit.value = clase.description;
  plazasEdit.value = clase.plazas;
  claseId.value = dataId;
}

function hideEditModal() {
  editModal.style.display = "none";
}

function showGroups(dataId){
  groupModal.style.display = "flex";
}

function hideGroupsModal() {
  groupModal.style.display = "none";
}

//Función modificar clase
async function updateClase() {
  const dataUpdate = {
    name: nameEdit.value,
    description: descriptionEdit.value,
    plazas: plazasEdit.value,
  };

  const requestOptions = {
    method: "PATCH",
    headers: {
      apikey: APIKEY,
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(dataUpdate),
  };

  const response = await fetch(
    `${BASE_URL}/rest/v1/clases_Studio11?id=eq.${claseId.value}`,
    requestOptions
  );
  if (!response.ok) {
    alert("Error en la petición UPDATE");
    return false;
  }

  hideEditModal();
  getClases();
}

// Evento para guardar el clase nueva
const saveWorkshopBtn = document.getElementById("save-workshop-btn");
saveWorkshopBtn.addEventListener("click", createClase);

getClases();
getGruposClases();