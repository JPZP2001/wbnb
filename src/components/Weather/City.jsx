import { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import * as THREE from 'three';

const City = () => {
  const { data: weatherData } = useSelector((state) => state.weather);
  const [buildings, setBuildings] = useState([]);
  const [streetLamps, setStreetLamps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isNight, setIsNight] = useState(false);

  // Street lamp positions generator
  const generateStreetLamps = () => {
    const lamps = [];
    const gridSize = 4;
    const spacing = 3.5;
    
    // Place lamps along grid intersections
    for (let x = -gridSize; x <= gridSize; x += 2) {
      for (let z = -gridSize; z <= gridSize; z += 2) {
        if (Math.random() < 0.7) { // 70% chance to place a lamp
          lamps.push({
            position: [x * spacing, 2.5, z * spacing],
            rotation: Math.random() * Math.PI * 2
          });
        }
      }
    }
    return lamps;
  };

  const generateRandomBuildings = () => {
    const gridSize = 4;
    const spacing = 3.5;
    const buildings = [];
    
    for (let x = -gridSize; x <= gridSize; x++) {
      for (let z = -gridSize; z <= gridSize; z++) {
        if (Math.random() < 0.3) continue;

        const xPos = x * spacing + (Math.random() - 0.5);
        const zPos = z * spacing + (Math.random() - 0.5);
        
        const height = Math.random() * 12 + 2;
        const width = Math.random() * 1.2 + 0.6;
        const depth = Math.random() * 1.2 + 0.6;
        
        const style = Math.floor(Math.random() * 4);
        const hasSetback = Math.random() > 0.5;
        const setbackHeight = hasSetback ? height * 0.7 : height;
        const topWidth = hasSetback ? width * 0.7 : width;
        const topDepth = hasSetback ? depth * 0.7 : depth;
        
        const numFloors = Math.min(Math.floor(height * 1.8), 12);
        const windowsPerFloor = {
          width: Math.min(Math.max(3, Math.floor(width * 3)), 5),
          depth: Math.min(Math.max(3, Math.floor(depth * 3)), 5)
        };
        
        buildings.push({
          position: [xPos, height/2, zPos],
          height,
          width,
          depth,
          style,
          hasSetback,
          setbackHeight,
          topWidth,
          topDepth,
          numFloors,
          windowsPerFloor,
          rotation: Math.random() * Math.PI * 0.25 - Math.PI * 0.125,
          baseColor: isNight ? '#1a1a1a' : '#FAFAFA',
          accentColor: isNight ? '#0f0f0f' : '#F5F5F5'
        });
      }
    }
    
    return buildings;
  };

  const checkIsNight = (weatherData) => {
    if (!weatherData?.dt || !weatherData?.sys?.sunrise || !weatherData?.sys?.sunset) return false;
    const current = weatherData.dt;
    return current < weatherData.sys.sunrise || current > weatherData.sys.sunset;
  };

  useEffect(() => {
    if (!weatherData?.coord) {
      const newBuildings = generateRandomBuildings();
      const newLamps = generateStreetLamps();
      setBuildings(newBuildings);
      setStreetLamps(newLamps);
      setIsLoading(false);
      return;
    }

    setIsNight(checkIsNight(weatherData));
    const newBuildings = generateRandomBuildings();
    const newLamps = generateStreetLamps();
    setBuildings(newBuildings);
    setStreetLamps(newLamps);
    setIsLoading(false);
  }, [weatherData, isNight]);

  // Reusable geometries and materials
  const windowGeometry = useMemo(() => new THREE.BoxGeometry(0.12, 0.25, 0.05), []);
  const buildingMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    roughness: 0.5,
    metalness: 0.3
  }), []);
  const streetLampGeometry = useMemo(() => new THREE.CylinderGeometry(0.05, 0.05, 3, 8), []);
  const streetTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    // Draw asphalt texture
    ctx.fillStyle = isNight ? '#000000' : '#FAFAFA'
    ctx.fillRect(0, 0, 512, 512);
    
    // Draw road lines
    ctx.strokeStyle = isNight ? '#000000' : '#E6E6E6'
    ctx.lineWidth = 10;
    
    // Grid pattern
    for (let i = 0; i < 512; i += 64) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 512);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(512, i);
      ctx.stroke();
    }
    
    return new THREE.CanvasTexture(canvas);
  }, []);

  const StreetLamp = ({ position, rotation }) => {
    return (
      <group position={position} rotation={[0, rotation, 0]}>
        {/* Lamp post */}
        <mesh castShadow geometry={streetLampGeometry}>
          <meshStandardMaterial color="#202020" />
        </mesh>
        
        {/* Lamp head */}
        <mesh position={[0, 1.4, 0.2]} rotation={[Math.PI/2, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.4, 8]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        
        {/* Light */}
        {isNight && (
          <pointLight
            position={[0, 1.4, 0.2]}
            intensity={0.8}
            distance={14}
            decay={0.3}
            color="#FFFFFF"
          />
        )}
        
        {/* Light bulb glow */}
        {isNight && (
          <mesh position={[0, 1.4, 0.2]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshBasicMaterial color="#FFE4A3" />
          </mesh>
        )}
      </group>
    );
  };

  const WindowInstanced = ({ windows, isNight }) => {
    const instancedMesh = useMemo(() => {
      const matrix = new THREE.Matrix4();
      const mesh = new THREE.InstancedMesh(
        windowGeometry,
        new THREE.MeshStandardMaterial({
          color: isNight ? '#303030' : '#F2F2F2',
          emissive: isNight ? '#FFE6AE' : '#F2F2F2',
          emissiveIntensity: isNight ? 0.8 : 0.3,
          metalness: 0.9,
          roughness: 0.1
        }),
        windows.length
      );

      windows.forEach((window, i) => {
        matrix.setPosition(window.position[0], window.position[1], window.position[2]);
        mesh.setMatrixAt(i, matrix);
      });

      return mesh;
    }, [windows, isNight]);

    return <primitive object={instancedMesh} />;
  };

  const BuildingMesh = ({ building, isNight }) => {
    const windows = useMemo(() => {
      const windowsList = [];
      const floorHeight = building.height / building.numFloors;

      for (let floor = 0; floor < building.numFloors; floor++) {
        const y = (floor * floorHeight) - (building.height / 2) + (floorHeight / 2);
        const isInSetback = building.hasSetback && y > (building.setbackHeight - building.height) / 2;
        const currentWidth = isInSetback ? building.topWidth : building.width;
        const currentDepth = isInSetback ? building.topDepth : building.depth;

        // All four sides now have windows
        for (let w = 0; w < building.windowsPerFloor.width; w++) {
          const xOffset = (w - (building.windowsPerFloor.width - 1) / 2) * (currentWidth / building.windowsPerFloor.width);
          // Front and back windows
          windowsList.push(
            { position: [xOffset, y, currentDepth / 2] },
            { position: [xOffset, y, -currentDepth / 2] }
          );
        }

        for (let d = 0; d < building.windowsPerFloor.depth; d++) {
          const zOffset = (d - (building.windowsPerFloor.depth - 1) / 2) * (currentDepth / building.windowsPerFloor.depth);
          // Side windows
          windowsList.push(
            { position: [currentWidth / 2, y, zOffset] },
            { position: [-currentWidth / 2, y, zOffset] }
          );
        }
      }

      return windowsList;
    }, [building]);

    return (
      <group position={building.position} rotation={[0, building.rotation, 0]}>
        {/* Main building body */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[building.width, building.height, building.depth]} />
          <meshStandardMaterial {...buildingMaterial} color={building.baseColor} />
        </mesh>

        {/* Building setback if present */}
        {building.hasSetback && (
          <mesh 
            castShadow 
            position={[0, (building.height - building.setbackHeight) / 2, 0]}
          >
            <boxGeometry 
              args={[building.topWidth, building.height - building.setbackHeight, building.topDepth]} 
            />
            <meshStandardMaterial {...buildingMaterial} color={building.accentColor} />
          </mesh>
        )}

        {/* Decorative elements based on building style */}
        {building.style === 1 && (
          <mesh 
            castShadow 
            position={[0, building.height/2 + 0.2, 0]}
          >
            <boxGeometry args={[building.width * 0.8, 0.4, building.depth * 0.8]} />
            <meshStandardMaterial {...buildingMaterial} color={building.accentColor} />
          </mesh>
        )}

        {building.style === 2 && (
          <mesh 
            castShadow 
            position={[0, building.height/2 + 0.3, 0]}
          >
            <cylinderGeometry args={[building.width * 0.3, building.width * 0.4, 0.6, 8]} />
            <meshStandardMaterial {...buildingMaterial} color={building.accentColor} />
          </mesh>
        )}

        {building.style === 3 && (
          <mesh 
            castShadow 
            position={[0, building.height/2, 0]}
          >
            <coneGeometry args={[building.width * 0.4, 1, 4]} />
            <meshStandardMaterial {...buildingMaterial} color={building.accentColor} />
          </mesh>
        )}

        <WindowInstanced windows={windows} isNight={isNight} />
      </group>
    );
  };

  return (
    <group>
      {/* Ground with street texture */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial 
          map={streetTexture}
          roughness={0.8}
          metalness={0.2}
          color={isNight ? "#151515" : "#F5F5F5"}
        >
          <primitive attach="map" object={streetTexture} />
        </meshStandardMaterial>
      </mesh>
      
      {/* Buildings */}
      {buildings.map((building, index) => (
        <BuildingMesh 
          key={index} 
          building={building} 
          isNight={isNight}
        />
      ))}
      
      {/* Street Lamps */}
      {streetLamps.map((lamp, index) => (
        <StreetLamp
          key={`lamp-${index}`}
          position={lamp.position}
          rotation={lamp.rotation}
        />
      ))}
    </group>
  );
};

export default City;