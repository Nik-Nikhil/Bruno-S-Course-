import { Canvas } from '@react-three/fiber';

export default function Section() {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gridTemplateRows: '1fr 1fr',
      width: '100vw',
      height: '100vh',
    }}>
      <Canvas><Scene quadrant="Top-Left" /></Canvas>
      <Canvas><Scene quadrant="Top-Right" /></Canvas>
      <Canvas><Scene quadrant="Bottom-Left" /></Canvas>
      <Canvas><Scene quadrant="Bottom-Right" /></Canvas>
    </div>
  );
}

function Scene({ quadrant }) {
  return (
    <>
      {/* Your R3F content */}
      <mesh>
        <boxGeometry />
        <meshStandardMaterial color="orange" />
      </mesh>
    </>
  );
}
