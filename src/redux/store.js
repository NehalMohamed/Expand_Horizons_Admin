import { configureStore } from "@reduxjs/toolkit";
import destinationReducer from "../slices/destinationSlice";
import authReducer from "../slices/AuthSlice";
import tripReducer from "../slices/tripSlice";
import facilityReducer from "../slices/facilitySlice";
import BookingReducer from "../slices/BookingSlice";
import GlobalSettingReducer from "../slices/GlobalSettingSlice";
export const store = configureStore({
  reducer: {
    destinations: destinationReducer,
    auth: authReducer,
    trips: tripReducer,
    facility: facilityReducer,
    booking: BookingReducer,
    GlobalSetting: GlobalSettingReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
