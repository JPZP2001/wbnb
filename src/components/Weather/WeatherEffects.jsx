import { useRef, useMemo} from 'react'
import { useFrame } from '@react-three/fiber'

// Rain Particles Component
const RainParticles = ({ count = 1000 }) => {
  const points = useRef()
  
  const particlePositions = useMemo(() => {
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 50
      positions[i * 3 + 1] = Math.random() * 50
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50
    }
    return positions
  }, [count])

  useFrame((state, delta) => {
    const positions = points.current.geometry.attributes.position.array
    for (let i = 0; i < positions.length; i += 3) {
      positions[i + 1] -= delta * 30
      if (positions[i + 1] < 0) {
        positions[i + 1] = 50
        positions[i] = (Math.random() - 0.5) * 50
        positions[i + 2] = (Math.random() - 0.5) * 50
      }
    }
    points.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlePositions.length / 3}
          array={particlePositions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color="#aaaaff"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}

// Snow Particles Component
const SnowParticles = ({ count = 1000 }) => {
  const points = useRef()
  
  const particlePositions = useMemo(() => {
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 50
      positions[i * 3 + 1] = Math.random() * 50
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50
    }
    return positions
  }, [count])

  useFrame((state, delta) => {
    const positions = points.current.geometry.attributes.position.array
    const time = state.clock.getElapsedTime()
    
    for (let i = 0; i < positions.length; i += 3) {
      positions[i] += Math.sin(time + positions[i + 1] * 0.1) * delta * 2
      positions[i + 2] += Math.cos(time + positions[i + 1] * 0.1) * delta * 2
      positions[i + 1] -= delta * 5
      
      if (positions[i + 1] < 0) {
        positions[i + 1] = 50
        positions[i] = (Math.random() - 0.5) * 50
        positions[i + 2] = (Math.random() - 0.5) * 50
      }
    }
    points.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlePositions.length / 3}
          array={particlePositions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.2}
        color="#ffffff"
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  )
}



// Weather Effects Component
const WeatherEffects = ({ weatherData }) => {
  if (!weatherData) return null

  const weatherType = weatherData.weather[0].main.toLowerCase()
  const weatherId = weatherData.weather[0].id

  const getParticleCount = () => {
    if (weatherId >= 200 && weatherId < 300) return 2000
    if (weatherId >= 500 && weatherId < 600) {
      if (weatherId >= 502) return 2000
      if (weatherId >= 501) return 1500
      return 1000
    }
    if (weatherId >= 600 && weatherId < 700) {
      if (weatherId >= 602) return 2000
      if (weatherId >= 601) return 1500
      return 1000
    }
    return 1000
  }

  return (
    <>
      {(weatherType === 'rain' || weatherType === 'drizzle' || weatherType === 'thunderstorm') && (
        <RainParticles count={getParticleCount()} />
      )}
      {weatherType === 'snow' && (
        <SnowParticles count={getParticleCount()} />
      )}
    </>
  )
}

export default WeatherEffects