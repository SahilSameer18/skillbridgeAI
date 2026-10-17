import api from "./api.js";

export async function getProfile() {
  const response = await api.get("/api/user/profile");
  return response.data;
}

export async function updateProfile(data) {
  const response = await api.put("/api/user/profile", data);
  return response.data;
}

export async function changePassword(data) {
  const response = await api.put("/api/user/change-password", data);
  return response.data;
}

export async function deleteAccount() {
  const response = await api.delete("/api/user");
  return response.data;
}
