import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_AUTH_API_URL;

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/GetUsers`);
      return response.data.users;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);
//get users with role grouping
export const fetchUsersWithRoles = createAsyncThunk(
  "users/GetUsersGrp",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/GetUsersGrp`);
      return response.data.result;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);
//fetch roles
export const fetchRoles = createAsyncThunk(
  "users/fetchRoles",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/GetRoles`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);
//create user
export const CreateUserByAdmin = createAsyncThunk(
  "users/CreateUserByAdmin",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/CreateUserByAdmin`,
        formData,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

//delete user
export const DeleteUser = createAsyncThunk(
  "users/DeleteUser",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/DeleteUser?id=` + userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);
const usersSlice = createSlice({
  name: "users",
  initialState: {
    data: [],
    UsersList: [],
    loading: false,
    error: null,
    searchRole: "",
    User: {},
    Roles: [],
  },
  reducers: {
    setSearchRole: (state, action) => {
      state.searchRole = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch users";
      })
      .addCase(fetchUsersWithRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsersWithRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.UsersList = action.payload;
      })
      .addCase(fetchUsersWithRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch users";
      })
      .addCase(CreateUserByAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(CreateUserByAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.User = action.payload;
      })
      .addCase(CreateUserByAdmin.rejected, (state, action) => {
        state.loading = false;
        state.User = action.payload || "Failed to fetch users";
      })
      .addCase(fetchRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.Roles = action.payload;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch users";
      })
      .addCase(DeleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(DeleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.User = action.payload;
      })
      .addCase(DeleteUser.rejected, (state, action) => {
        state.loading = false;
        state.User = action.payload || "Failed to fetch users";
      });
  },
});

export const { setSearchRole } = usersSlice.actions;
export default usersSlice.reducer;
