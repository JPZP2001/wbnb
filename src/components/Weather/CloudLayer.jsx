import { useMemo} from 'react'
import Cloud from './Cloud'

const CloudLayer = ({ weatherData }) => {
  const clouds = useMemo(() => {
    const cloudCover = weatherData?.clouds?.all || 0
    const cloudCount = Math.floor((cloudCover / 100) * 15) + 5
    
    return Array.from({ length: cloudCount }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 50,
        10 + Math.random() * 5,
        (Math.random() - 0.5) * 50
      ],
      scale: Math.random() * 1 + 1,
      speed: Math.random() * 2 + 1
    }))
  }, [weatherData])

  const cloudMaterialProps = useMemo(() => {
    if (!weatherData) return { opacity: 0.8 }
    
    const weatherType = weatherData.weather[0].main.toLowerCase()
    switch (weatherType) {
      case 'thunderstorm':
        return { opacity: 0.9, color: '#333333' }
      case 'rain':
      case 'drizzle':
        return { opacity: 0.85, color: '#888888' }
      case 'snow':
        return { opacity: 0.7, color: '#ffffff' }
      default:
        return { opacity: 0.8, color: '#ffffff' }
    }
  }, [weatherData])

  return (
    <group>
      {clouds.map((cloud, index) => (
        <Cloud
          key={index}
          position={cloud.position}
          scale={cloud.scale}
          speed={cloud.speed}
          {...cloudMaterialProps}
        />
      ))}
    </group>
  )
}

export default CloudLayer