// src/components/Weather/Info.jsx
import { useSelector } from 'react-redux';

const Info = () => {
  const { data, loading, error } = useSelector((state) => state.weather);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>No weather data available</div>;

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Weather Information</h2>
      {/* Weather info will go here */}
    </div>
  );
};

export default Info;