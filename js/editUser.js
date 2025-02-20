import { APIKEY, BASE_URL } from "./config.js";
import { logout, getToken, getUserId } from "./auth.js";

async function updateUser(newName, newSurname, NewPhone) {
  const requestOptions = {
    method: "PATCH",
    headers: {
      apikey: APIKEY,
      "Content-Type": "application/json",
      Authorization: `Bearer ${result.access_token}`,
    },
    body: JSON.stringify({
      //   name: "Mandarino",
      //   surname: "Naranjo",
      //   phone: "37921732891",
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
  return result;
}

updateUserEmail("nuevo-email@example.com")
  .then((data) => console.log(data))
  .catch((error) => console.error(error));
