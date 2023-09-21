import axios from "axios";
const API = axios.create({ baseURL: "http://localhost:5000" });

export const getTimeLinePosts = (id) => API.get(`/post/getTimeLinePosts/${id}`);
export const likePost = (id, userId) =>
  API.put(`/post/likePost/${id}`, { userId: userId });
