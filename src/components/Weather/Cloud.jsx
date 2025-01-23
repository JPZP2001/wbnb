import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'

const Cloud = ({ position, scale, speed }) => {
  const group = useRef()
  
  const puffs = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 0.5,
        (Math.random() - 0.5) * 2
      ],
      scale: Math.random() * 0.3 + 0.7
    }))
  }, [])

  useFrame((state) => {
    if (group.current) {
      group.current.position.x += speed * 0.001
      if (group.current.position.x > 25) {
        group.current.position.x = -25
      }
    }
  })

  return (
    <group ref={group} position={position} scale={scale}>
      {puffs.map((puff, index) => (
        <mesh key={index} position={puff.position} scale={puff.scale}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial
            color="#ffffff"
            transparent
            opacity={0.8}
            roughness={1}
            metalness={0}
          />
        </mesh>
      ))}
    </group>
  )
}

export default Cloud