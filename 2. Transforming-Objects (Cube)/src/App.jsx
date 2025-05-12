import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense, useMemo, useRef } from 'react';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { OrbitControls } from '@react-three/drei';
import { useThree } from '@react-three/fiber';

function FloatingCubes({ count = 400 }) {
  const meshRef = useRef();

  const cubes = useMemo(() => {
    const cubeData = Array.from({ length: count }).map(() => {
      const chance = Math.random();
      let color, intensity, size, baseOpacity;

      if (chance > 0.96) {
        color = new THREE.Color(1, 0.2, 0.2);
        intensity = 4;
        size = 0.6 + Math.random() * 0.4;
        baseOpacity = 0.8;
      } else if (chance > 0.85) {
        color = new THREE.Color(0.8, 0, 0);
        intensity = 2 + Math.random() * 1.5;
        size = 0.4 + Math.random() * 0.3;
        baseOpacity = 0.6;
      } else {
        color = new THREE.Color(0.4 + Math.random() * 0.2, 0, 0);
        intensity = 0.5 + Math.random() * 0.8;
        size = 0.2 + Math.random() * 0.3;
        baseOpacity = 0.4;
      }

      return {
        position: [
          (Math.random() - 0.5) * 50,
          (Math.random() - 0.5) * 30,
          (Math.random() - 0.5) * 50,
        ],
        rotation: [
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 0.4,
        ],
        speed: 0.005 + Math.random() * 0.015,
        rotSpeed: Math.random() * 0.008,
        color,
        emissive: color,
        emissiveIntensity: intensity,
        size,
        baseOpacity,
        resetY: -15 - intensity * 2,
      };
    });

    for (let i = 0; i < cubeData.length; i++) {
      for (let j = i + 1; j < cubeData.length; j++) {
        const cubeA = cubeData[i];
        const cubeB = cubeData[j];
        const dist = Math.sqrt(
          (cubeA.position[0] - cubeB.position[0]) ** 2 +
          (cubeA.position[1] - cubeB.position[1]) ** 2 +
          (cubeA.position[2] - cubeB.position[2]) ** 2
        );
        if (dist < 1) {
          cubeB.position = [
            (Math.random() - 0.5) * 50,
            (Math.random() - 0.5) * 30,
            (Math.random() - 0.5) * 50,
          ];
          j = i;
        }
      }
    }

    return cubeData;
  }, [count]);

  useFrame(() => {
    meshRef.current.children.forEach((mesh, i) => {
      const cube = cubes[i];
      mesh.position.y -= cube.speed;
      mesh.rotation.x += cube.rotSpeed;
      mesh.rotation.y += cube.rotSpeed;
      mesh.rotation.z += cube.rotSpeed * 0.2;

      const fadeStartY = cube.resetY + 5;
      if (mesh.position.y < fadeStartY) {
        const fadeRange = fadeStartY - cube.resetY;
        const opacity = cube.baseOpacity * (mesh.position.y - cube.resetY) / fadeRange;
        mesh.material.opacity = Math.max(0, Math.min(cube.baseOpacity, opacity));
      } else {
        mesh.material.opacity = cube.baseOpacity;
      }

      if (mesh.position.y < cube.resetY) {
        mesh.position.y = 15;
        mesh.material.opacity = cube.baseOpacity;
      }
    });
  });

  return (
    <group ref={meshRef}>
      {cubes.map((cube, i) => (
        <mesh key={i} position={cube.position} rotation={cube.rotation}>
          <boxGeometry args={[cube.size, cube.size, cube.size * 0.01]} />
          <meshStandardMaterial
            color={cube.color}
            emissive={cube.emissive}
            emissiveIntensity={cube.emissiveIntensity}
            toneMapped={false}
            roughness={0.1}
            metalness={0.5}
            transparent={true}
            opacity={cube.baseOpacity}
          />
        </mesh>
      ))}
    </group>
  );
}

function CameraLogger() {
  const { camera } = useThree();
  const prevPos = useRef(new THREE.Vector3());

  useFrame(() => {
    if (!camera.position.equals(prevPos.current)) {
      console.log(`Camera position: x=${camera.position.x.toFixed(2)}, y=${camera.position.y.toFixed(2)}, z=${camera.position.z.toFixed(2)}`);
      prevPos.current.copy(camera.position);
    }
  });

  return null;
}
export default function App() {
  return (
    <Canvas gl={{ antialias: true }} style={{ width: '100vw', height: '100vh' }} camera={{ position: [-4.69, 2.28, 25.98], fov: 50 }}>
      <color attach="background" args={['#1a0000']} />
      <fog attach="fog" args={['#ff3333', 50, 500]} />

      <ambientLight intensity={0.0005} />
      <directionalLight
        position={[5, 20, 5]}
        intensity={0.5}
        color="#ff3333"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[0, 20, 0]} intensity={1.2} color="#ff3333" />

      <OrbitControls />
      <CameraLogger />

      <Suspense fallback={null}>
        <FloatingCubes />
      </Suspense>

      <EffectComposer>
        <Bloom
          intensity={1.2}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.6}
          radius={0.7}
        />
      </EffectComposer>
    </Canvas>
  );
}
