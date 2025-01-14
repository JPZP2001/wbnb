import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Weather Lighting Component
const WeatherLighting = ({ weatherData }) => {
  const lightRef = useRef()
  
  const lightingParams = useMemo(() => {
    if (!weatherData) return {
      ambientIntensity: 0.5,
      directionalIntensity: 1,
      color: '#ffffff'
    }

    const { clouds, weather } = weatherData
    const cloudCover = clouds?.all || 0
    const weatherMain = weather[0]?.main.toLowerCase()
    
    let ambientIntensity = 0.5
    let directionalIntensity = 1
    let color = '#ffffff'

    if (cloudCover > 50) {
      ambientIntensity *= 0.7
      directionalIntensity *= 0.6
      color = '#a0a0a0'
    }

    switch (weatherMain) {
      case 'thunderstorm':
        ambientIntensity *= 0.4
        directionalIntensity *= 0.3
        color = '#666666'
        break
      case 'rain':
      case 'drizzle':
        ambientIntensity *= 0.6
        directionalIntensity *= 0.5
        color = '#8899aa'
        break
      case 'snow':
        ambientIntensity *= 0.8
        directionalIntensity *= 0.7
        color = '#eeeeff'
        break
      case 'clear':
        ambientIntensity *= 1.2
        directionalIntensity *= 1.1
        color = '#fffaf0'
        break
    }

    return { ambientIntensity, directionalIntensity, color }
  }, [weatherData])

  useFrame((state, delta) => {
    if (lightRef.current) {
      lightRef.current.intensity = THREE.MathUtils.lerp(
        lightRef.current.intensity,
        lightingParams.directionalIntensity,
        0.1
      )
    }
  })

  return (
    <>
      <ambientLight 
        intensity={lightingParams.ambientIntensity} 
        color={lightingParams.color} 
      />
      <directionalLight
        ref={lightRef}
        position={[5, 5, 5]}
        intensity={lightingParams.directionalIntensity}
        color={lightingParams.color}
        castShadow
      />
    </>
  )
}

export default WeatherLighting