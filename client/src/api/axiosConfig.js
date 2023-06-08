import axios from "axios";

const instance = axios.create({
  baseURL: "https://Chatbot_miniProj-api.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true
});

export default instance;