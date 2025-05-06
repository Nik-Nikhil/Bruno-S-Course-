import { Canvas } from '@react-three/fiber'
import Cube1 from './components/Cube1'
import Cube2 from './components/Cube2'
import { Leva } from 'leva'
import Title from './components/Title'

function App() {
  return (
    <>
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight />
        <Title />
        <Cube1 />
        <Cube2 />
      </Canvas>
      <Leva collapsed={false} />
    </>
  )
}

export default App
