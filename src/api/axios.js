import axios from "axios";
//import { store } from "../redux/store"; // your redux store
import { logout } from "../slices/AuthSlice"; // your auth slice action
// import { useNavigate } from "react-router-dom";
import { navigate } from "../helper/navigate";
import {
  getAccessToken,
  setAccessToken,
  clearAccessToken,
} from "../helper/TokenHelper";
const BASE_URL = process.env.REACT_APP_API_URL;
const BASE_URL_AUTH = process.env.REACT_APP_AUTH_API_URL;
// create instance
const api = axios.create({
  baseURL: BASE_URL,
  //withCredentials: true, // important for cookie refresh token
});
// Add request interceptor
api.interceptors.request.use(
  async (config) => {
    // const token = getAccessToken();
    let lang = localStorage.getItem("lang");
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.accessToken;
    //config.headers["Content-Type"] = "application/json";
    config.headers["Accept-Language"] = lang;
    if (config.isFormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    } else {
      config.headers["Content-Type"] = "application/json";
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      //window.location.href = "/login";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue = [];
// When multiple API requests fail at the same time (access token expired),
// we don’t want to refresh the token multiple times — just once,
// and queue the others until it’s done.
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};
// Add response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    console.log("originalRequest.url ", originalRequest.url);
    // Skip refresh for login/register endpoints
    if (
      originalRequest.url.includes("/api/LoginUser") ||
      originalRequest.url.includes("/api/RegisterUser") ||
      originalRequest.url.includes("/api/ConfirmOTP") ||
      originalRequest.url.includes("/api/LoginGmail") ||
      originalRequest.url.includes("/api/ExternalRegister")
    ) {
      return Promise.reject(error);
    }
    console.log("error.response?.status", error.response?.status);
    // Handle unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Wait for refresh to finish, then retry
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log("start get refresh");
        // token refresh
        // const refreshResponse = await authApi.post("/refresh");
        // console.log("refreshResponse ", refreshResponse);
        // const newToken = refreshResponse?.data?.user?.accessToken;

        // setAccessToken(newToken);
        const user = JSON.parse(localStorage.getItem("user"));
        const oldAccessToken = user?.accessToken;
        const oldRefreshToken = user?.refreshToken;

        const refreshResponse = await axios.post(BASE_URL_AUTH + "/refresh", {
          AccessToken: oldAccessToken,
          RefreshToken: oldRefreshToken,
        });

        //console.log("refreshResponse ", refreshResponse);
        const newToken = refreshResponse?.data?.user?.accessToken;
        const newRefesh = refreshResponse?.data?.user?.refreshToken;
        localStorage.setItem(
          "user",
          JSON.stringify(refreshResponse?.data?.user)
        );
        processQueue(null, newToken);

        // Retry original request
        originalRequest.headers["Authorization"] = "Bearer " + newToken;
        return api(originalRequest);
      } catch (refreshError) {
        // 🚨 Refresh failed → clear tokens and redirect
        processQueue(refreshError, null);
        clearAccessToken();
        // window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Other errors
    return Promise.reject(error);
  }
);

export default api;
