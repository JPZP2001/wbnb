// src/store/weatherSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchWeather = createAsyncThunk(
  'weather/fetchWeather',
  async (city) => {
    // We'll implement the API call here later
    // For now, we'll just return a mock response
    return {};
  }
);

const weatherSlice = createSlice({
  name: 'weather',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeather.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeather.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchWeather.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default weatherSlice.reducer;

// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import weatherReducer from './weatherSlice';

export const store = configureStore({
  reducer: {
    weather: weatherReducer,
  },
});