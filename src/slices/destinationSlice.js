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
//Get Destination drown down
export const GetDestination_Mains = createAsyncThunk(
  "destinations/GetDestination_Mains",
  async (leaf, { rejectWithValue }) => {
    try {
      // const response = await axios.post(
      //   `${BASE_URL}/GetDestinationMain?leaf=` + leaf,
      //   {},
      //   getAuthHeaders(false)
      // );
      const response = await api.post(
        `/GetDestinationMain?leaf=` + leaf
        //getAuthHeaders(false)
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
//Get Destination list with its translations
export const GetDestinations = createAsyncThunk(
  "destinations/GetDestinations",
  async (formData, { rejectWithValue }) => {
    try {
      // const response = await axios.post(
      //   `${BASE_URL}/GetDestinationWithTranslations`,
      //   formData,
      //   getAuthHeaders(false)
      // );
      const response = await api.post(
        `/GetDestinationWithTranslations`,
        formData
        // getAuthHeaders(false)
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//save main Destination
export const SaveMainDestination = createAsyncThunk(
  "destinations/SaveMainDestination",
  async (formData, { rejectWithValue }) => {
    try {
      // const response = await axios.post(
      //   `${BASE_URL}/SaveMainDestination`,
      //   formData,
      //   getAuthHeaders(false)
      // );
      const response = await api.post(
        `/SaveMainDestination`,
        formData
        //getAuthHeaders(false)
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//save main Destination
export const saveDestinationImage = createAsyncThunk(
  "destinations/saveDestinationImage",
  async (formData, { rejectWithValue }) => {
    try {
      // const response = await axios.post(
      //   `${BASE_URL}/saveDestinationImage`,
      //   formData,
      //   getAuthHeaders(true)
      // );
      const response = await api.post(
        `/saveDestinationImage`,
        formData,
        { isFormData: true }
        //getAuthHeaders(true)
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
//save  Destination translations
export const SaveDestinationTranslations = createAsyncThunk(
  "destinations/SaveDestinationTranslations",
  async (formData, { rejectWithValue }) => {
    try {
      // const response = await axios.post(
      //   `${BASE_URL}/SaveDestinationTranslations`,
      //   formData,
      //   getAuthHeaders(false)
      // );
      const response = await api.post(
        `/SaveDestinationTranslations`,
        formData
        //getAuthHeaders(false)
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const GetImgsByDestination = createAsyncThunk(
  "destinations/GetImgsByDestination",
  async (destination_id, { rejectWithValue }) => {
    try {
      // const response = await axios.post(
      //   `${BASE_URL}/GetImgsByDestination?destination_id=` + destination_id,
      //   {},
      //   getAuthHeaders(false)
      // );
      const response = await api.post(
        `/GetImgsByDestination?destination_id=` + destination_id
        // {},
        // getAuthHeaders(false)
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//save  Destination translations
export const UpdateDestinationImage = createAsyncThunk(
  "destinations/UpdateDestinationImage",
  async (formData, { rejectWithValue }) => {
    try {
      // const response = await axios.post(
      //   `${BASE_URL}/UpdateDestinationImage`,
      //   formData,
      //   getAuthHeaders(false)
      // );
      const response = await api.post(
        `/UpdateDestinationImage`,
        formData
        //getAuthHeaders(false)
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
const destinationSlice = createSlice({
  name: "destinations",
  initialState: {
    destinations: [],
    loading: false,
    error: null,
    DestinationImages: [],
    DestinationMain: [],
  },
  reducers: {
    setDestinations: (state, action) => {
      state.destinations = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(GetDestinations.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(GetDestinations.fulfilled, (state, action) => {
        state.loading = false;
        state.destinations = action.payload;
      })
      .addCase(GetDestinations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(SaveMainDestination.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(SaveMainDestination.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(SaveMainDestination.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(SaveDestinationTranslations.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(SaveDestinationTranslations.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(SaveDestinationTranslations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(saveDestinationImage.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(saveDestinationImage.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(saveDestinationImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(GetImgsByDestination.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(GetImgsByDestination.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.DestinationImages = action.payload;
      })
      .addCase(GetImgsByDestination.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(GetDestination_Mains.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(GetDestination_Mains.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.DestinationMain = action.payload;
      })
      .addCase(GetDestination_Mains.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(UpdateDestinationImage.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(UpdateDestinationImage.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(UpdateDestinationImage.rejected, (state, action) => {
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

export const { setDestinations } = destinationSlice.actions;
export default destinationSlice.reducer;
