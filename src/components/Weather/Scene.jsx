// src/components/Weather/Scene.jsx
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

const Scene = () => {
  return (
    <div className="h-[500px] bg-gray-900 rounded-lg overflow-hidden">
      <Canvas>
        <OrbitControls />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        {/* 3D scene will go here */}
      </Canvas>
    </div>
  );
};

export default Scene;