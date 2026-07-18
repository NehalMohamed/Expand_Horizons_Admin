import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;

const NonAuthHeaders = () => {
  let lang = localStorage.getItem("lang");
  return {
    "Accept-Language": lang,
  };
};

export const GetExchangeRates = createAsyncThunk(
  "Exchange/GetExchangeRates",
  async (rateDate, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/TravelAdmin/GetExchangeRates?rateDate=${rateDate}`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const SaveExchangeRate = createAsyncThunk(
  "Exchange/SaveExchangeRate",
  async ({ rates, date }, { rejectWithValue }) => {
    try {
      const payload = rates.map((item) => ({
        id: item.id,
        currency_id: item.currency_id,
        currency_code: item.currency_code,
        effective_date: item.effective_date || date,
        rate: Number(item.rate),
        created_at: item.created_at || new Date().toISOString(),
      }));
      const response = await api.post("/TravelAdmin/SaveExchangeRate", payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const GetCompanySetting = createAsyncThunk(
  "Exchange/GetCompanySetting",
  async (companyId = 1, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/TravelAdmin/Get_CompanySetting?company_id=${companyId}`,
        {},
        { headers: NonAuthHeaders() },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

const exchangeSlice = createSlice({
  name: "exchange",
  initialState: {
    rates: [],
    loading: false,
    saving: false,
    error: null,
    saveResult: null,
    companyCurrencyCode: "EUR",
  },
  reducers: {
    updateRate(state, action) {
      const { currency_code, rate } = action.payload;
      const item = state.rates.find(
        (row) => row.currency_code === currency_code,
      );
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
          action.payload?.msg ||
          action.payload ||
          "Failed to load exchange rates.";
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
          action.payload?.msg ||
          action.payload ||
          "Unable to save exchange rates.";
      })
      .addCase(GetCompanySetting.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(GetCompanySetting.fulfilled, (state, action) => {
        state.loading = false;
        state.companyCurrencyCode = action.payload?.currency_code || "EUR";
        console.log("full ", state.loading);
      })
      .addCase(GetCompanySetting.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.msg ||
          action.payload ||
          "Unable to load company settings.";
      });
  },
});

export const { updateRate, clearExchangeMessage } = exchangeSlice.actions;
export default exchangeSlice.reducer;
