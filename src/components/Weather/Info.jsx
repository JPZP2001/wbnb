import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchWeather } from '../../store/weatherSlice'
import { getChatGPTResponse } from '../../services/chatGPT';

const Info = () => {
  const [cityInput, setCityInput] = useState('')
  const [clothingRecs, setClothingRecs] = useState('')
  const [activityRecs, setActivityRecs] = useState('')
  const [isLoadingClothing, setIsLoadingClothing] = useState(false)
  const [isLoadingActivities, setIsLoadingActivities] = useState(false)
  const [recsError, setRecsError] = useState('')
  
  const dispatch = useDispatch()
  const { data, loading, error } = useSelector((state) => state.weather)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (cityInput.trim()) {
      dispatch(fetchWeather(cityInput))
      setCityInput('')
    }
  }

  const generatePrompt = (type) => {
    return `Given that it's ${data.weather[0].description} and ${Math.round(data.main.temp)}°C in ${data.name}, 
    provide 3-4 brief ${type === 'clothing' ? 'clothing recommendations' : 'activity suggestions'} 
    appropriate for these weather conditions, dont add descriptions just the recommendations on bullets.`
  }

  const fetchRecommendations = async (type) => {
    const setLoading = type === 'clothing' ? setIsLoadingClothing : setIsLoadingActivities;
    const setRecs = type === 'clothing' ? setClothingRecs : setActivityRecs;
    
    setLoading(true);
    setRecsError('');
  
    try {
      const { response, error } = await getChatGPTResponse(generatePrompt(type));
      
      if (error) {
        throw new Error(error);
      }
      
      setRecs(response);
    } catch (err) {
      setRecsError(err.message || 'Failed to get recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const RecommendationBox = ({ content, title }) => (
    content && (
      <div className="bg-white p-4 rounded-lg shadow-md mt-4 max-w-md">
        <h3 className="font-semibold mb-2">{title}</h3>
        <div className="text-sm" 
             dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br/>') }} />
      </div>
    )
  )

  return (
    <div className="relative container mx-auto px-4 py-8 z-50">
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
            placeholder="Enter city name"
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="responsive-button search"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {loading && (
        <div className="text-center">Loading...</div>
      )}
      
      {error && (
        <div className="text-red-500 text-center bg-red-50 p-4 rounded-lg">
          {error}
        </div>
      )}

      {data && (
        <div className="flex flex-wrap items-start gap-8">
          <div className="flex-shrink-0">
            <h2 className="text-2xl font-semibold mb-4">
              {data.name}, {data.country}
            </h2>
            <div className="flex items-start gap-8">
              <div>
                <p className="text-4xl font-bold">
                  {Math.round(data.main.temp)}°C
                </p>
                <p className="text-gray-500 capitalize">
                  {data.weather[0].description}
                </p>
              </div>
              <div className="flex flex-col space-y-2">
                <p>Humidity: {data.main.humidity}%</p>
                <p>Wind: {data.wind.speed} m/s</p>
              </div>
            </div>

            <div className="recommendation-buttons">
              <button
                onClick={() => fetchRecommendations('clothing')}
                disabled={loading || isLoadingClothing}
                className="responsive-button"
                style={{ marginRight: "2%"}}
              >
                {isLoadingClothing ? 'Loading...' : '👕 Get Clothing Tips'}
              </button>

              <button
                onClick={() => fetchRecommendations('activities')}
                disabled={loading || isLoadingActivities}
                className="responsive-button"
              >
                {isLoadingActivities ? 'Loading...' : '🎯 Get Activity Ideas'}
              </button>
            </div>


            {recsError && (
              <div className="text-red-500 text-sm mt-2">
                {recsError}
              </div>
            )}

            <RecommendationBox 
              content={clothingRecs} 
              title="Recommended Clothing" 
            />
            
            <RecommendationBox 
              content={activityRecs} 
              title="Suggested Activities" 
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default Info