export default function Cube1() {
  return (
    <mesh position={[0.7,-0.6,1]} scale={[2,0.5,0.5]}>
      <boxGeometry args={[0.5, 0.5,0.5]} />
      <meshBasicMaterial color="red" />
    </mesh>
  )
}