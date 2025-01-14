import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getWeatherByCity } from '../services/weatherAPI'

export const fetchWeather = createAsyncThunk(
  'weather/fetchWeather',
  async (city) => {
    const response = await getWeatherByCity(city)
    return response
  }
)

const weatherSlice = createSlice({
  name: 'weather',
  initialState: {
    data: null,
    loading: false,
    error: null,
    city: ''
  },
  reducers: {
    setCity: (state, action) => {
      state.city = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeather.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchWeather.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchWeather.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

export const { setCity } = weatherSlice.actions
export default weatherSlice.reducer