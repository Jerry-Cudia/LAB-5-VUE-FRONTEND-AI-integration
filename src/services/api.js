import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost/mood-backend",
  headers: {
    "Content-Type": "application/json"
  }
});

export default api;
