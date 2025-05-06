import { Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useControls } from 'leva'
import { useRef } from 'react'

export default function Cube2() {
  const { positionX, positionY, positionZ, color, wireframe } = useControls('Cube2 Controls', {
    positionX: { value: 2, min: -2, max: 2, step: 0.1 },
    positionY: { value: 0, min: -2, max: 2, step: 0.1 },
    positionZ: { value: 0, min: -2, max: 2, step: 0.1 },
    color: { value: '#00ff00' },
    wireframe: true
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
        position={[0,-1, 0]}
        fontSize={0.4}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Wireframe Cube
      </Text>
    </group>
  )
}
