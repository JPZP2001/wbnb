import { useSelector } from 'react-redux'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Stars } from '@react-three/drei'
import WeatherLighting from './WeatherLighting'
import CloudLayer from './CloudLayer'
import City from './City'
import WeatherEffects from './WeatherEffects'

const Scene = () => {
  const { data: weatherData } = useSelector((state) => state.weather)

  return (
    <div className="absolute top-0 right-0 z-0 bg-transparent rounded-lg overflow-hidden" style={{ width: '100vw', height: '90vh' }}>
      <Canvas shadows gl={{ alpha: true }}>
        <PerspectiveCamera makeDefault position={[15, 15, 15]} />
        <OrbitControls 
          minDistance={5}
          maxDistance={30}
          maxPolarAngle={Math.PI / 2.1}
        />

        <Stars radius={100} depth={50} count={5000} factor={4} fade />
        
        <WeatherLighting weatherData={weatherData} />
        <City />
        <CloudLayer weatherData={weatherData} />
        <WeatherEffects weatherData={weatherData} />
        
        <fog attach="fog" args={['#202020', 5, 50]} />
      </Canvas>
    </div>
  )
}

export default Scene