import './App.css'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

function App() {

  return (
    <Canvas>
      <color attach="background" args={['black']} />
      <ambientLight intensity={1} />     
      <OrbitControls />      
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="red" />
    </mesh>
    </Canvas>    
  )
}

export default App
