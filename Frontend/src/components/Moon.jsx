import React, { useRef, useEffect } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three-stdlib'
import * as THREE from 'three'

const Moon = () => {
  const modelRef = useRef()

  const gltf = useLoader(GLTFLoader, '/star.glb')

  useEffect(() => {
    if (gltf.scene) {
      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          if (child.material.map) {
            child.material.map.encoding = THREE.sRGBEncoding
          }
          child.material.needsUpdate = true
        }
      })
    }
  }, [gltf])

  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.005
      modelRef.current.rotation.x -= 0.005
      modelRef.current.rotation.z += 0.005
    }
  })


  return (
    <>
    <ambientLight intensity={1}/>
    <directionalLight position={[5, 5, 5]} intensity={2}/>
      <primitive
        ref={modelRef}
        object={gltf.scene}
        scale={[5.2, 5.2, 5.2]}
        rotation={[0, 0, 0]}
      />
    </>
  )
}

export default Moon