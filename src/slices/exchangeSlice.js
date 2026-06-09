import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

export const GetExchangeRates = createAsyncThunk(
  "Exchange/GetExchangeRates",
  async (rateDate, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/TravelAdmin/GetExchangeRates?rateDate=${rateDate}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const SaveExchangeRate = createAsyncThunk(
  "Exchange/SaveExchangeRate",
  async ({ rates, date }, { rejectWithValue }) => {
    try {
      const payload = rates.map((item) => ({
        id: item.id,
        currency_id: item.currency_id,
        effective_date: item.effective_date || date,
        rate: Number(item.rate),
        created_at: item.created_at || new Date().toISOString(),
      }));
      const response = await api.post("/TravelAdmin/SaveExchangeRate", payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const exchangeSlice = createSlice({
  name: "exchange",
  initialState: {
    rates: [],
    loading: false,
    saving: false,
    error: null,
    saveResult: null,
  },
  reducers: {
    updateRate(state, action) {
      const { currency_code, rate } = action.payload;
      const item = state.rates.find((row) => row.currency_code === currency_code);
      if (item) {
        item.rate = Number(rate);
      }
    },
    clearExchangeMessage(state) {
      state.error = null;
      state.saveResult = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(GetExchangeRates.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.saveResult = null;
      })
      .addCase(GetExchangeRates.fulfilled, (state, action) => {
        state.loading = false;
        state.rates = action.payload.map((item) => ({
          ...item,
          rate: item.rate ?? 0,
        }));
      })
      .addCase(GetExchangeRates.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.msg || action.payload || "Failed to load exchange rates.";
      })
      .addCase(SaveExchangeRate.pending, (state) => {
        state.saving = true;
        state.error = null;
        state.saveResult = null;
      })
      .addCase(SaveExchangeRate.fulfilled, (state, action) => {
        state.saving = false;
        if (action.payload?.success) {
          state.saveResult = "Rates saved successfully.";
        } else {
          state.error = action.payload?.msg || "Unable to save exchange rates.";
        }
      })
      .addCase(SaveExchangeRate.rejected, (state, action) => {
        state.saving = false;
        state.error =
          action.payload?.msg || action.payload || "Unable to save exchange rates.";
      });
  },
});

export const { updateRate, clearExchangeMessage } = exchangeSlice.actions;
export default exchangeSlice.reducer;
