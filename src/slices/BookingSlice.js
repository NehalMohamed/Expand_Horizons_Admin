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

//Get Booking All
export const GetAllBooking = createAsyncThunk(
  "booking/GetAllBooking",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/GetAllBooking`,
        formData
        //getAuthHeaders(false)
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const BookingSlice = createSlice({
  name: "booking",
  initialState: {
    BookingData: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(GetAllBooking.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(GetAllBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.BookingData = action.payload;
      })
      .addCase(GetAllBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default BookingSlice.reducer;
