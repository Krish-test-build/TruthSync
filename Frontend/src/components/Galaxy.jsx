import React, { useRef, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { GLTFLoader, DRACOLoader } from 'three-stdlib';
import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';

const Galaxy = () => {
  const modelRef = useRef();
  const centerGroupRef = useRef();

  const gltf = useLoader(GLTFLoader, '/galaxy1_pruned_draco.glb', (loader) => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/');
    loader.setDRACOLoader(dracoLoader);
  });

useEffect(() => {
  (async () => {
    const BufferGeometryUtils = await import('three/examples/jsm/utils/BufferGeometryUtils.js');

    const geometries = [];
    gltf.scene.traverse((child) => {
      if (child.isMesh && child.geometry) geometries.push(child.geometry);
    });

    if (geometries.length === 0) return;

    try {
      const combinedGeometry = BufferGeometryUtils.mergeBufferGeometries(geometries, false);
      const box = new THREE.Box3().setFromBufferGeometry(combinedGeometry);
      const center = new THREE.Vector3();
      box.getCenter(center);

      modelRef.current.position.sub(center);
      centerGroupRef.current.position.add(center);
    } catch (error) {
      console.error('Error merging geometries:', error);
    }
  })();
}, [gltf]);


  useFrame(() => {
    if (centerGroupRef.current) {
      centerGroupRef.current.rotation.y += 0.002;
    }
  });

  return (
    <>
      <ambientLight intensity={1} />
      <directionalLight position={[5, 5, 5]} intensity={2} />

      <group ref={centerGroupRef} position={[0, 0, 10]}>
        <primitive
          ref={modelRef}
          object={gltf.scene}
          scale={[10, 10, 10]}
          rotation={[Math.PI / 12, 0, Math.PI / 16]}
        />
      </group>
    </>
  );
};

export default Galaxy;
