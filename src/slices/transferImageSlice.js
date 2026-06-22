import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

export const GetImgsByTransfer = createAsyncThunk(
  "transferImage/GetImgsByTransfer",
  async (category_id, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/TravelAdmin/GetImgsByTransfer?category_id=` + category_id
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const SaveTransferImage = createAsyncThunk(
  "transferImage/SaveTransferImage",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post(`/TravelAdmin/saveTransferImage`, formData, { isFormData: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const UpdateTransferImage = createAsyncThunk(
  "transferImage/UpdateTransferImage",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post(`/TravelAdmin/UpdateTransferImage`, formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const transferImageSlice = createSlice({
  name: "transferImage",
  initialState: {
    TransferImgs: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(GetImgsByTransfer.pending, (state) => {
        state.loading = true;
      })
      .addCase(GetImgsByTransfer.fulfilled, (state, action) => {
        state.loading = false;
        state.TransferImgs = action.payload;
        state.error = null;
      })
      .addCase(GetImgsByTransfer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(SaveTransferImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(SaveTransferImage.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(SaveTransferImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(UpdateTransferImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(UpdateTransferImage.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(UpdateTransferImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default transferImageSlice.reducer;
