import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";
// const BASE_URL = process.env.REACT_APP_API_URL;

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

//Get Facility with translation
export const GetFacilityWithTranslation = createAsyncThunk(
  "facility/GetFacilityWithTranslation",
  async (_, { rejectWithValue }) => {
    try {
      // const response = await axios.post(
      //   `${BASE_URL}/GetFacilityWithTranslation`,
      //   {},
      //   getAuthHeaders(false)
      // );
      const response = await api.post(
        `/GetFacilityWithTranslation`
        // {},
        // getAuthHeaders(false)
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
//save  facility translations
export const SaveFacilityTranslation = createAsyncThunk(
  "facility/SaveFacilityTranslation",
  async (formData, { rejectWithValue }) => {
    try {
      // const response = await axios.post(
      //   `${BASE_URL}/SaveFacilityTranslation`,
      //   formData,
      //   getAuthHeaders(false)
      // );
      const response = await api.post(
        `/SaveFacilityTranslation`,
        formData
        // getAuthHeaders(false)
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//save  facility main
export const SaveMainFacility = createAsyncThunk(
  "facility/SaveMainFacility",
  async (formData, { rejectWithValue }) => {
    try {
      // const response = await axios.post(
      //   `${BASE_URL}/SaveMainFacility`,
      //   formData,
      //   getAuthHeaders(false)
      // );
      const response = await api.post(
        `/SaveMainFacility`,
        formData
        // getAuthHeaders(false)
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//Get Facility with translation
export const GetFacilityAllWithSelect = createAsyncThunk(
  "facility/GetFacilityAllWithSelect",
  async (trip_id, { rejectWithValue }) => {
    try {
      // const response = await axios.post(
      //   `${BASE_URL}/GetFacilityAllWithSelect?trip_id=` + trip_id,
      //   {},
      //   getAuthHeaders(false)
      // );
      const response = await api.post(
        `/GetFacilityAllWithSelect?trip_id=` + trip_id
        // {},
        // getAuthHeaders(false)
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//Assign Facility To Trip
export const AssignFacilityToTrip = createAsyncThunk(
  "facility/AssignFacilityToTrip",
  async (formData, { rejectWithValue }) => {
    try {
      // const response = await axios.post(
      //   `${BASE_URL}/AssignFacilityToTrip`,
      //   formData,
      //   getAuthHeaders(false)
      // );
      const response = await api.post(
        `/AssignFacilityToTrip`,
        formData
        //getAuthHeaders(false)
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
const facilitySlice = createSlice({
  name: "facility",
  initialState: {
    facilities: [],
    loading: false,
    TripFacility: [],
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(GetFacilityWithTranslation.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(GetFacilityWithTranslation.fulfilled, (state, action) => {
        state.loading = false;
        state.facilities = action.payload;
      })
      .addCase(GetFacilityWithTranslation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(SaveFacilityTranslation.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(SaveFacilityTranslation.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(SaveFacilityTranslation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(SaveMainFacility.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(SaveMainFacility.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })

      .addCase(SaveMainFacility.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(GetFacilityAllWithSelect.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(GetFacilityAllWithSelect.fulfilled, (state, action) => {
        state.loading = false;
        state.TripFacility = action.payload;
      })
      .addCase(GetFacilityAllWithSelect.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(AssignFacilityToTrip.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(AssignFacilityToTrip.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(AssignFacilityToTrip.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default facilitySlice.reducer;
