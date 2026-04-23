import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const UnrealisticObject = () => {
  const meshRef = useRef();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 1.5;
      meshRef.current.rotation.y += delta * 2.5;
    }
  });

  return (
    <mesh ref={meshRef}>
      <torusKnotGeometry args={[2, 0.4, 100, 16]} />
      {/* Classic Normal material creates a very 90s CG psychedelic rainbow look */}
      <meshNormalMaterial wireframe={false} />
    </mesh>
  );
};

const Hero3D = () => {
  return (
    <div className="hero-3d-container">
      <Canvas camera={{ position: [0, 0, 7], fov: 60 }}>
        {/* Transparent background so the stars show through */}
        <ambientLight intensity={1} />
        <UnrealisticObject />
      </Canvas>
    </div>
  );
};

export default Hero3D;
