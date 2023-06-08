import axios from "axios";

const instance = axios.create({
  baseURL: "http://Chatbot_miniProj-api.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true
});

export default instance;