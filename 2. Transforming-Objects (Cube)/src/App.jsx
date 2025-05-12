import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Suspense, useMemo, useRef } from 'react';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useControls, Leva } from 'leva';

function FloatingCubes({ count = 400 }) {
  const meshRef = useRef();

  const {
    '🟥 Color': bCol, '🟥 bInt': bInt, '🟥 Opacity': bOpa, '🟥 Size Min': bMin, '🟥 Size Max': bMax,
    '🟧 Color': nCol, '🟧 bInt': nInt, '🟧 Opacity': nOpa, '🟧 Size Min': nMin, '🟧 Size Max': nMax,
    '🟨 Color': dCol, '🟨 bInt': dInt, '🟨 Opacity': dOpa, '🟨 Size Min': dMin, '🟨 Size Max': dMax,
  } = useControls('Cube Settings', {
    '🟥 Color': { value: '#ff3333' },
    '🟥 bInt': { value: 4, min: 0, max: 10 },
    '🟥 Opacity': { value: 0.8, min: 0, max: 1 },
    '🟥 Size Min': { value: 0.6, min: 0, max: 2 },
    '🟥 Size Max': { value: 1.0, min: 0, max: 2 },

    '🟧 Color': { value: '#cc0000' },
    '🟧 bInt': { value: 2.5, min: 0, max: 10 },
    '🟧 Opacity': { value: 0.6, min: 0, max: 1 },
    '🟧 Size Min': { value: 0.4, min: 0, max: 2 },
    '🟧 Size Max': { value: 0.7, min: 0, max: 2 },

    '🟨 Color': { value: '#660000' },
    '🟨 bInt': { value: 0.8, min: 0, max: 10 },
    '🟨 Opacity': { value: 0.4, min: 0, max: 1 },
    '🟨 Size Min': { value: 0.2, min: 0, max: 2 },
    '🟨 Size Max': { value: 0.5, min: 0, max: 2 },
  });

  const cubes = useMemo(() => {
    const cubeData = Array.from({ length: count }).map(() => {
      const chance = Math.random();
      let color, intensity, size, baseOpacity;

      if (chance > 0.96) {
        color = new THREE.Color(bCol);
        intensity = bInt;
        size = bMin + Math.random() * (bMax - bMin);
        baseOpacity = bOpa;
      } else if (chance > 0.85) {
        color = new THREE.Color(nCol);
        intensity = nInt;
        size = nMin + Math.random() * (nMax - nMin);
        baseOpacity = nOpa;
      } else {
        color = new THREE.Color(dCol);
        intensity = dInt;
        size = dMin + Math.random() * (dMax - dMin);
        baseOpacity = dOpa;
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
        const a = cubeData[i], b = cubeData[j];
        const dist = Math.sqrt(
          (a.position[0] - b.position[0]) ** 2 +
          (a.position[1] - b.position[1]) ** 2 +
          (a.position[2] - b.position[2]) ** 2
        );
        if (dist < 1) {
          b.position = [
            (Math.random() - 0.5) * 50,
            (Math.random() - 0.5) * 30,
            (Math.random() - 0.5) * 50,
          ];
          j = i;
        }
      }
    }

    return cubeData;
  }, [count, bCol, bInt, bOpa, bMin, bMax, nCol, nInt, nOpa, nMin, nMax, dCol, dInt, dOpa, dMin, dMax]);

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
      console.log(`Camera: x=${camera.position.x.toFixed(2)}, y=${camera.position.y.toFixed(2)}, z=${camera.position.z.toFixed(2)}`);
      prevPos.current.copy(camera.position);
    }
  });

  return null;
}

export default function App() {
  return (
    <>
      <Canvas
        gl={{ antialias: true }}
        style={{ width: '100vw', height: '100vh' }}
        camera={{ position: [-4.69, 2.28, 25.98], fov: 50 }}
      >
        <color attach="background" args={['#1a0000']} />
        <fog attach="fog" args={['#ff3333', 50, 500]} />

        <ambientLight intensity={0.0005} />
        <directionalLight position={[5, 20, 5]} intensity={0.5} color="#ff3333" castShadow />
        <pointLight position={[0, 20, 0]} intensity={1.2} color="#ff3333" />

        {/* <OrbitControls /> */}
        <CameraLogger />

        <Suspense fallback={null}>
          <FloatingCubes />
        </Suspense>

        <EffectComposer>
          <Bloom intensity={1.2} luminanceThreshold={0.2} luminanceSmoothing={0.6} radius={0.7} />
        </EffectComposer>
      </Canvas>

      <Leva collapsed={false} />
    </>
  );
}
