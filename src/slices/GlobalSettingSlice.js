import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";
const BASE_URL = process.env.REACT_APP_API_URL;

// Helper function to get authentication headers
// const getAuthHeaders = (isForm) => {
//   let accessToken = localStorage.getItem("token");
//   if (isForm) {
//     return {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         "Content-Type": "multipart/form-data",
//         "Accept-Language": "en",
//       },
//     };
//   }
//   return {
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//       "Content-Type": "application/json",
//       "Accept-Language": "en",
//     },
//   };
// };

//Get_Currencies
export const Get_Currencies = createAsyncThunk(
  "GlobalSetting/Get_Currencies",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/Get_Currencies`
        // {},
        // getAuthHeaders(false)
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
//Get_Currencies
export const Get_Languages = createAsyncThunk(
  "GlobalSetting/Get_Languages",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/Get_Languages`
        // {},
        // getAuthHeaders(false)
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
const GlobalSettingSlice = createSlice({
  name: "GlobalSetting",
  initialState: {
    loading: false,
    error: null,
    Currencies: [],
    Languages: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(Get_Currencies.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(Get_Currencies.fulfilled, (state, action) => {
        state.loading = false;
        state.Currencies = action.payload;
      })
      .addCase(Get_Currencies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(Get_Languages.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(Get_Languages.fulfilled, (state, action) => {
        state.loading = false;
        state.Languages = action.payload;
      })
      .addCase(Get_Languages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default GlobalSettingSlice.reducer;
