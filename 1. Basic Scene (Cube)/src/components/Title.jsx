import { Text } from '@react-three/drei'

export default function Title() {
  return (
    <group position={[0, 2, 0]}>
      <Text
        fontSize={0.8}
        color="gold"
        anchorX="center"
        anchorY="middle"
      >
        Basic Scene
      </Text>
      <mesh position={[0, -0.55, 0]}>
        <boxGeometry args={[5, 0.05, 0.01]} />
        <meshBasicMaterial color="gold" />
      </mesh>
    </group>
  )
}
