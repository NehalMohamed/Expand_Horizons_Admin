import { configureStore } from "@reduxjs/toolkit";
import destinationReducer from "../slices/destinationSlice";
import authReducer from "../slices/AuthSlice";
import tripReducer from "../slices/tripSlice";
import facilityReducer from "../slices/facilitySlice";
import BookingReducer from "../slices/BookingSlice";
import GlobalSettingReducer from "../slices/GlobalSettingSlice";
import profileReducer from "../slices/profileSlice";
import usersReducer from "../slices/usersSlice";
export const store = configureStore({
  reducer: {
    destinations: destinationReducer,
    auth: authReducer,
    trips: tripReducer,
    facility: facilityReducer,
    booking: BookingReducer,
    GlobalSetting: GlobalSettingReducer,
    users: usersReducer,
    profile: profileReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
