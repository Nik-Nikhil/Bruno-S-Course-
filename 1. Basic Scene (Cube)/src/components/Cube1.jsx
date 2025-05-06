import { Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useControls } from 'leva'
import { useRef } from 'react'

export default function Cube1() {
  const { positionX, positionY, positionZ, color, wireframe } = useControls('Cube1 Controls', {
    positionX: { value: -2, min: -4, max: 2, step: 0.1 },
    positionY: { value: 0, min: -2, max: 2, step: 0.1 },
    positionZ: { value: 0, min: -2, max: 2, step: 0.1 },
    color: { value: '#ff4d00' },
    
  })
  const cubeRef = useRef()

  useFrame((state, delta) => {
    if (cubeRef.current) {
      cubeRef.current.rotation.y += delta
    }
  })

  return (
    <group position={[positionX, positionY, positionZ]}>
      <mesh ref={cubeRef}>
        <boxGeometry />
        <meshBasicMaterial color={color} wireframe={wireframe} />
      </mesh>
      <Text
        position={[-0.2,-1, 0]}
        fontSize={0.4}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Solid Cube
      </Text>
    </group>
  )
}
