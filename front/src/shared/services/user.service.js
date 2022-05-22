const BASE_URL = "/api/user";
import axios from "axios";

export async function createUser(userForm) {
  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      body: JSON.stringify(userForm),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      return response.json();
    } else {
      throw await response.json();
    }
  } catch (e) {
    throw e;
  }
}

export async function fetchCurrentUser() {
  return await (await fetch(`${BASE_URL}/current`)).json();
}

export async function getUser(id) {
  return await axios.get(`${BASE_URL}/getuser/${id}`);
}
