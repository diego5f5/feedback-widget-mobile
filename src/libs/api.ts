import axios from "axios";

export const api = axios.create({
  baseURL: "https://feedback-widget-server-production-7537.up.railway.app",
});
