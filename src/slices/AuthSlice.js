import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const BASE_URL_AUTH = process.env.REACT_APP_AUTH_API_URL;
const authApi = axios.create({
  baseURL: BASE_URL_AUTH,
  // withCredentials: true, // important for cookie refresh token
});
const NonAuthHeaders = () => {
  let lang = localStorage.getItem("lang");
  return {
    "Accept-Language": lang,
  };
};
const token = localStorage.getItem("token");

const initialState = {
  user: null,
  token: token || null,
  //status: "idle",
  loading: false,
  error: null,
  success: null,
  message: null,
};
// Helper to extract error message from different response formats
const getErrorMessage = (error) => {
  if (error.response?.data?.success === false) {
    return error.response.data.errors || "Operation failed";
  }
  if (error.response?.data?.errors) {
    return error.response.data.errors;
  }
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return "An error occurred";
};

//verify email
export const ConfirmOTP = createAsyncThunk(
  "ConfirmOTP",
  async (payload, thunkAPI) => {
    var response = await authApi
      .post("/ConfirmOTP", payload)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        return thunkAPI.rejectWithValue(getErrorMessage(error));
        //return error.response.data;
      });
    return response;
  }
);
///normal register && gmail Register (different on API path & payload)
export const RegisterUser = createAsyncThunk(
  "auth/register",
  async (data, thunkAPI) => {
    var response = await authApi
      .post(data.path, data.payload, {
        headers: NonAuthHeaders(),
      })
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        return thunkAPI.rejectWithValue(getErrorMessage(error));
        // return error.response.data;
      });
    return response;
  }
);

//normal login & gmail Login (different on API path & payload)
export const LoginUser = createAsyncThunk(
  "auth/login",
  async (data, thunkAPI) => {
    var response = await authApi
      .post(data.path, data.payload, {
        headers: NonAuthHeaders(),
      })
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        return thunkAPI.rejectWithValue(getErrorMessage(error));
        //return error.response.data;
      });
    return response;
  }
);
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    //start register
    builder
      .addCase(RegisterUser.fulfilled, (state, action) => {
        // if (action.payload.status != null && action.payload.status != 200) {
        //   state.user = null;
        //   // state.status = "failed";
        //   state.success = false;
        //   state.loading = false;
        //   state.error = JSON.stringify(action.payload.error);
        // } else {
        //   state.user = action.payload?.user;
        //   //state.status = "succeeded";
        //   state.loading = false;
        //   state.success = action.payload.isSuccessed;
        //   localStorage.setItem("token", action.payload?.user?.accessToken);
        //   localStorage.setItem("user", JSON.stringify(action.payload?.user));
        //   //state.error = action.payload !== null ? action.payload.msg : "";
        //   state.message = action.payload?.message;
        // }
        state.user = action.payload?.user;
        state.loading = false;
        state.success = action.payload.isSuccessed;
        localStorage.setItem("token", action.payload?.user?.accessToken);
        localStorage.setItem("user", JSON.stringify(action.payload?.user));
        state.message = action.payload?.message;
      })

      .addCase(LoginUser.fulfilled, (state, action) => {
        // if (action.payload.status != null && action.payload.status != 200) {
        //   state.user = null;
        //   // state.status = "failed";
        //   state.success = false;
        //   state.loading = false;
        //   state.error = JSON.stringify(action.payload.error);
        // } else {
        //   state.user = action.payload;
        //   //state.status = "succeeded";
        //   state.loading = false;
        //   state.success = action.payload.isSuccessed;
        //   localStorage.setItem("token", action.payload.accessToken);
        //   localStorage.setItem("user", JSON.stringify(action.payload));
        //   state.error = action.payload !== null ? action.payload.msg : "";
        // }
        state.user = action.payload?.user;
        state.loading = false;
        state.success = action.payload.isSuccessed;
        localStorage.setItem("token", action.payload?.user?.accessToken);
        localStorage.setItem("user", JSON.stringify(action.payload?.user));
        state.message = action.payload?.message;
      })
      .addCase(ConfirmOTP.fulfilled, (state, action) => {
        state.user = action.payload?.user;
        state.loading = false;
        state.success = action.payload.isSuccessed;
        localStorage.setItem("token", action.payload?.user?.accessToken);
        localStorage.setItem("user", JSON.stringify(action.payload?.user));
        state.message = action.payload?.message;
      })
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          //state.status = "loading";
          state.loading = true;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          //state.status = "failed";
          state.error = action.payload;
          state.message = action.payload;
          state.success = false;
          state.loading = false;
        }
      );
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
