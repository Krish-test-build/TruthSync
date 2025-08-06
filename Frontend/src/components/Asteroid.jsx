import React, { useRef, useEffect } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three-stdlib'
import * as THREE from 'three'

const Galaxy = () => {
  const modelRef = useRef()
  const gltf = useLoader(GLTFLoader, '/asteroid.glb')
  

  

  return (
    <>
      <ambientLight intensity={1} />
      <directionalLight position={[5, 5, 5]} intensity={2} />

      <group ref={centerGroupRef} position={[-14, -18, 36]}>
        <primitive
          ref={modelRef}
          object={gltf.scene}
          scale={[10, 10, 10]}
          rotation={[Math.PI / 10, 0, 0]}
        />
      </group>
    </>
  )
}

export default Galaxy
