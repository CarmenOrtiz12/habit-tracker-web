import api from "../api/client";

export async function getCurrentUser() {
  const response = await api.get("/me");
  return response.data;
}