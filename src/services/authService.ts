import api from "../api/client";

export async function login(email: string, password: string) {
  const formData = new URLSearchParams();

  formData.append("username", email);
  formData.append("password", password);

  const response = await api.post("/login", formData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return response.data;
}

export async function register(name: string, email: string, password: string) {
  const response = await api.post("/users", {
    name,
    email,
    password,
  });

  return response.data;
}