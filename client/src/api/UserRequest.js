import axios from "axios";
const API = axios.create({ baseURL: "http://localhost:5000" });

API.interceptors.request.use((req) => {
  if (localStorage.getItem("profile")) {
    req.headers.Authorization = `Bearer ${
      JSON.parse(localStorage.getItem("profile")).token
    }`;
  }

  return req;
});

export const getUser = (userId) => API.get(`/user/getUser/${userId}`);
export const updateUser = (id, formData) =>
  API.put(`/user/updateUser/${id}`, formData);
export const getAllUsers = () => API.get(`/user/getAllUsers`);
export const followUser = (id, data) => API.put(`/user/followUser/${id}`, data);
export const unFollowUser = (id, data) =>
  API.put(`/user/unFollowUser/${id}`, data);
