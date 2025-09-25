import axios from "axios";

const IMG_URL = "https://jewellery.hisabapp.com/admin/";

// const IMG_URL = "http://192.168.1.103/projects/easyAcers/admin/";


const api = axios.create({
  baseURL: "https://jewellery.hisabapp.com/admin/api/",

  //  baseURL: "http://192.168.1.103/projects/easyAcers/admin/api",

});

// ✅ attach custom property (not inside axios.create)
api.imageUrl = IMG_URL;

// Add the Authorization header to each request
api.interceptors.request.use(
  (config) => {
    const token = "kasejfksjdhfywterjwefbdskgfhsdfjh"; // Get the token from localStorage
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
