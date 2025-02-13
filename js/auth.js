import { APIKEY, BASE_URL } from "./config.js";

const inputEmail = document.getElementById("email");
const inputPassword = document.getElementById("password");
const inputName = document.getElementById("name");
const inputSurname = document.getElementById("surname");
const inputPhone= document.getElementById("phone");


// Btn login
const btnLogin = document.getElementById("login");
if (btnLogin) {
  btnLogin.addEventListener("click", login);
}

// Btn registro
const btnRegister = document.getElementById("register");
if (btnRegister) {
  btnRegister.addEventListener("click", register);
}

async function login() {
  const requestOptions = {
    method: "POST",
    headers: {
      apikey: APIKEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: inputEmail.value,
      password: inputPassword.value,
    }),
  };

  const response = await fetch(
    `${BASE_URL}/auth/v1/token?grant_type=password`,
    requestOptions
  );
  if (!response.ok) {
    alert("Error al iniciar sesión");
  }

  const result = await response.json();

  localStorage.setItem("token", result.access_token);
  localStorage.setItem("userId", result.user.id);

  window.location.href = "/profile.html";
}

async function register() {
  const requestOptions = {
    method: "POST",
    headers: {
      apikey: APIKEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: inputEmail.value,
      password: inputPassword.value,
    }),
  };

  const response = await fetch(`${BASE_URL}/auth/v1/signup`, requestOptions);
  if (!response.ok) {
    alert("Error en el registro");
  }

  const result = await response.json();
  
  localStorage.setItem("token", result.access_token);
  localStorage.setItem("userId", result.user.id);

  const requestOptions2 = {
    method: "POST",
    headers: {
      apikey: APIKEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
        user_id: "be79d428-9138-4651-8663-f9ee55571a7e",
        rol: "USER",
        name: inputName.value,
        surname: inputSurname.value,
        phone: inputPhone.value,
    })
  };

  const response2 = await fetch(`${BASE_URL}/rest/v1/users_Studio11`, requestOptions2);
  if (!response2.ok) {
    alert("Error en el registro");
  }

  const result2 = await response2.json();
  console.log(result2);


  window.location.href = "/profile.html";
}

export async function isUserLogged(access_token, userId) {
  const requestOptions = {
    method: "GET",
    headers: {
      apikey: APIKEY,
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
  };

  const response = await fetch(`${BASE_URL}/auth/v1/user`, requestOptions);
  if (!response.ok) {
    alert("Error al iniciar sesión");
    return false;
  }

  const result = await response.json();

  if (result.id == userId) {
    return true;
  }

  return false;
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");

  window.location.href = "/index.html";
}

export function getToken() {
  return localStorage.getItem("token");
}

export function getUserId() {
  return localStorage.getItem("userId");
}
