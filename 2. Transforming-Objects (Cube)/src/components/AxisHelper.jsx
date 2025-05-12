import * as THREE from 'three'

export default function AxisHelper() {
  const axesHelper = new THREE.AxesHelper(1)
  return <primitive object={axesHelper} />
}
