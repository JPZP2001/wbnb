import axios from 'axios'
import { WEATHER_API_KEY, WEATHER_API_BASE_URL } from '../utils/constants'

const getCoordinates = async (city) => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/geo/1.0/direct`,
      {
        params: {
          q: city,
          limit: 1,
          appid: WEATHER_API_KEY
        }
      }
    )
    
    if (response.data.length === 0) {
      throw new Error('City not found')
    }
    
    return {
      lat: response.data[0].lat,
      lon: response.data[0].lon,
      name: response.data[0].name, // Get the properly formatted city name
      country: response.data[0].country
    }
  } catch (error) {
    throw error.response?.data?.message || 'Failed to get city coordinates'
  }
}

export const getWeatherByCity = async (city) => {
  try {
    // First get coordinates
    const coordinates = await getCoordinates(city)
    
    // Then get weather data using coordinates
    const response = await axios.get(`${WEATHER_API_BASE_URL}/weather`, {
      params: {
        lat: coordinates.lat,
        lon: coordinates.lon,
        appid: WEATHER_API_KEY,
        units: 'metric'
      }
    })

    // Combine the weather data with additional location info
    return {
      ...response.data,
      name: coordinates.name,
      country: coordinates.country
    }
  } catch (error) {
    throw error.response?.data?.message || error.message || 'Failed to fetch weather data'
  }
}