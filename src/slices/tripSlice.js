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

//Get main trips list
export const GetTrip_Mains = createAsyncThunk(
  "trips/GetTrip_Mains",
  async (data, thunkAPI) => {
    try {
      // const response = await axios.post(
      //   `${BASE_URL}/GetTrip_Mains?destination_id=` +
      //     data.destination_id +
      //     "&&trip_type=" +
      //     data.trip_type,
      //   {},
      //   getAuthHeaders(false)
      // );
      const response = await api.post(
        `/GetTrip_Mains?destination_id=` +
          data.destination_id +
          "&&trip_type=" +
          data.trip_type
        // {},
        // getAuthHeaders(false)
      );
      return response.data;
    } catch (error) {
      // return rejectWithValue(error.response.data);
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

//Get  trip categories list
export const GetTripCategories = createAsyncThunk(
  "trips/GetTripCategories",
  async (destination_id, { rejectWithValue }) => {
    try {
      // const response = await axios.post(
      //   `${BASE_URL}/GetTripCategories`,
      //   {},
      //   getAuthHeaders(false)
      // );
      const response = await api.post(
        `/GetTripCategories`
        // {},
        // getAuthHeaders(false)
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
//save trip main
export const SaveMainTrip = createAsyncThunk(
  "trips/SaveMainTrip",
  async (formData, { rejectWithValue }) => {
    try {
      // const response = await axios.post(
      //   `${BASE_URL}/SaveMainTrip`,
      //   formData,
      //   getAuthHeaders(false)
      // );
      const response = await api.post(
        `/SaveMainTrip`,
        formData
        //getAuthHeaders(false)
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//Get trips transaltions list grouping by lang
export const GetTripTranslationGrp = createAsyncThunk(
  "trips/GetTripTranslationGrp",
  async (trip_id, { rejectWithValue }) => {
    try {
      // const response = await axios.post(
      //   `${BASE_URL}/GetTripTranslationGrp?trip_id=` + trip_id,
      //   {},
      //   getAuthHeaders(false)
      // );
      const response = await api.post(
        `/GetTripTranslationGrp?trip_id=` + trip_id
        // {},
        // getAuthHeaders(false)
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
//Get trips prices list grouping by lang
export const GetTrip_Prices = createAsyncThunk(
  "trips/GetTrip_Prices",
  async (trip_id, thunkAPI) => {
    try {
      // const response = await axios.post(
      //   `${BASE_URL}/GetTrip_Prices?trip_id=` + trip_id,
      //   {},
      //   getAuthHeaders(false)
      // );
      const response = await api.post(
        `/GetTrip_Prices?trip_id=` + trip_id
        // {},
        // getAuthHeaders(false)
      );
      return response.data;
    } catch (error) {
      // return rejectWithValue(error.response.data);
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

//get child policy for trip
export const GetTrip_ChildPolicy = createAsyncThunk(
  "trips/GetTrip_ChildPolicy",
  async (trip_id, thunkAPI) => {
    try {
      const response = await api.post(
        `/GetTrip_ChildPolicy?trip_id=` + trip_id
        // {},
        // getAuthHeaders(false)
      );
      return response.data;
    } catch (error) {
      // return rejectWithValue(error.response.data);
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
//save trip translations
export const SaveTripTranslation = createAsyncThunk(
  "trips/SaveTripTranslation",
  async (formData, { rejectWithValue }) => {
    try {
      // const response = await axios.post(
      //   `${BASE_URL}/SaveTripTranslation`,
      //   formData,
      //   getAuthHeaders(false)
      // );
      const response = await api.post(
        `/SaveTripTranslation`,
        formData
        //getAuthHeaders(false)
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//save trip price
export const SaveTripPrices = createAsyncThunk(
  "trips/SaveTripPrices",
  async (formData, { rejectWithValue }) => {
    try {
      // const response = await axios.post(
      //   `${BASE_URL}/SaveTripPrices`,
      //   formData,
      //   getAuthHeaders(false)
      // );
      const response = await api.post(
        `/SaveTripPrices`,
        formData
        //getAuthHeaders(false)
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//save trip child policy
export const SaveTripChildPolicy = createAsyncThunk(
  "trips/SaveTripChildPolicy",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/SaveTripChildPolicy`,
        formData
        // getAuthHeaders(false)
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//save main trip pickups
export const SaveMainTripPickups = createAsyncThunk(
  "trips/SaveMainTripPickups",
  async (formData, { rejectWithValue }) => {
    try {
      // const response = await axios.post(
      //   `${BASE_URL}/SaveMainTripPickups`,
      //   formData,
      //   getAuthHeaders(false)
      // );
      const response = await api.post(
        `/SaveMainTripPickups`,
        formData
        // getAuthHeaders(false)
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//save  trip pickups translations
export const SaveTripPickupsTranslations = createAsyncThunk(
  "trips/SaveTripPickupsTranslations",
  async (formData, { rejectWithValue }) => {
    try {
      // const response = await axios.post(
      //   `${BASE_URL}/SaveTripPickupsTranslations`,
      //   formData,
      //   getAuthHeaders(false)
      // );
      const response = await api.post(
        `/SaveTripPickupsTranslations`,
        formData
        //getAuthHeaders(false)
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
//Get pickups with transaltions list
export const GetPickupsAllForTrip = createAsyncThunk(
  "trips/GetPickupsAllForTrip",
  async (formData, { rejectWithValue }) => {
    try {
      // const response = await axios.post(
      //   `${BASE_URL}/GetPickupsAllForTrip`,
      //   formData,
      //   getAuthHeaders(false)
      // );
      const response = await api.post(
        `/GetPickupsAllForTrip`,
        formData
        //getAuthHeaders(false)
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//Get images for specific trips
export const GetImgsByTrip = createAsyncThunk(
  "trips/GetImgsByTrip",
  async (trip_id, { rejectWithValue }) => {
    try {
      // const response = await axios.post(
      //   `${BASE_URL}/GetImgsByTrip?trip_id=` + trip_id,
      //   {},
      //   getAuthHeaders(false)
      // );
      const response = await api.post(
        `/GetImgsByTrip?trip_id=` + trip_id
        // {},
        // getAuthHeaders(false)
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//save images for trip
export const SaveTripImage = createAsyncThunk(
  "trips/SaveTripImage",
  async (formData, { rejectWithValue }) => {
    try {
      // const response = await axios.post(
      //   `${BASE_URL}/SaveTripImage`,
      //   formData,
      //   getAuthHeaders(true)
      // );
      const response = await api.post(
        `/SaveTripImage`,
        formData,
        { isFormData: true }
        // getAuthHeaders(true)
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//update trip image
export const UpdateTripImage = createAsyncThunk(
  "trips/UpdateTripImage",
  async (formData, { rejectWithValue }) => {
    try {
      // const response = await axios.post(
      //   `${BASE_URL}/UpdateTripImage`,
      //   formData,
      //   getAuthHeaders(false)
      // );
      const response = await api.post(
        `/UpdateTripImage`,
        formData
        //getAuthHeaders(false)
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
//save transfer Category
export const SaveTransferCategory = createAsyncThunk(
  "trips/SaveTransferCategory",
  async (formData, { rejectWithValue }) => {
    try {
      // const response = await axios.post(
      //   `${BASE_URL}/SaveTransferCategory`,
      //   formData,
      //   getAuthHeaders(false)
      // );
      const response = await api.post(
        `/SaveTransferCategory`,
        formData
        //getAuthHeaders(false)
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//get transfer categories list
export const GetTransfer_Categories = createAsyncThunk(
  "trips/GetTransfer_Categories",
  async (formData, { rejectWithValue }) => {
    try {
      // const response = await axios.post(
      //   `${BASE_URL}/GetTransfer_Categories`,
      //   formData,
      //   getAuthHeaders(false)
      // );
      const response = await api.post(
        `/GetTransfer_Categories`,
        formData
        //getAuthHeaders(false)
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
const tripSlice = createSlice({
  name: "trips",
  initialState: {
    TripsMain: [],
    loading: false,
    error: null,
    TripsImages: [],
    TranslationsData: [],
    TripPriceList: [],
    TripPickups: [],
    TripImgs: [],
    TripCategories: [],
    TransferCategories: [],
    ChildPolicyList: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(GetTrip_Mains.fulfilled, (state, action) => {
        state.loading = false;
        state.TripsMain = action.payload;
      })
      .addCase(SaveMainTrip.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(GetTripTranslationGrp.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.TranslationsData = action.payload;
      })
      .addCase(SaveTripTranslation.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(SaveTripTranslation.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(SaveTripTranslation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(SaveTripPrices.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(SaveTripPrices.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(SaveTripPrices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(GetTrip_Prices.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(GetTrip_Prices.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.TripPriceList = action.payload;
      })
      .addCase(GetTrip_Prices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(SaveMainTripPickups.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(SaveMainTripPickups.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(SaveMainTripPickups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(GetPickupsAllForTrip.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(GetPickupsAllForTrip.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.TripPickups = action.payload;
      })
      .addCase(GetPickupsAllForTrip.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(SaveTripPickupsTranslations.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(SaveTripPickupsTranslations.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(SaveTripPickupsTranslations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(GetImgsByTrip.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(GetImgsByTrip.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.TripImgs = action.payload;
      })
      .addCase(GetImgsByTrip.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(SaveTripImage.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(SaveTripImage.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(SaveTripImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(UpdateTripImage.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(UpdateTripImage.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(UpdateTripImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(GetTripCategories.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(GetTripCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.TripCategories = action.payload;
      })
      .addCase(GetTripCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(SaveTransferCategory.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(SaveTransferCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(SaveTransferCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(GetTransfer_Categories.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(GetTransfer_Categories.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.TransferCategories = action.payload;
      })
      .addCase(GetTransfer_Categories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(SaveTripChildPolicy.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(SaveTripChildPolicy.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(SaveTripChildPolicy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(GetTrip_ChildPolicy.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(GetTrip_ChildPolicy.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.ChildPolicyList = action.payload;
      })
      .addCase(GetTrip_ChildPolicy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    // .addMatcher(
    //   (action) => action.type.endsWith("/pending"),
    //   (state) => {
    //     //state.status = "loading";
    //     state.loading = true;
    //   }
    // )
    // .addMatcher(
    //   (action) => action.type.endsWith("/rejected"),
    //   (state, action) => {
    //     state.loading = false;
    //     state.error = action.payload;
    //   }
    // );
  },
});

//export const { setDestinations } = tripSlice.actions;
export default tripSlice.reducer;
