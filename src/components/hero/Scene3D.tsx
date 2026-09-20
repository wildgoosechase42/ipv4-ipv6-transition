'use client';

import React from 'react';
import { Canvas } from '@react-three/fiber';
import { MotionValue } from 'motion/react';
import { IPv4Mechanical } from './IPv4Mechanical';
import { IPv6Velocity } from './IPv6Velocity';
import { ContactShadows, PerspectiveCamera } from '@react-three/drei';

interface Scene3DProps {
  progress: MotionValue<number>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  mousePosRef: React.MutableRefObject<{ x: number; y: number }>;
}

export function Scene3D({ progress, canvasRef, mousePosRef }: Scene3DProps) {
  return (
    <Canvas
      ref={canvasRef}
      gl={{ 
        antialias: true, 
        alpha: true, 
        powerPreference: 'high-performance' 
      }}
      dpr={[1, 1.5]}
      className="w-full h-full"
    >
      <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} />

      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
      <spotLight
        position={[0, 10, 0]}
        intensity={2}
        angle={0.6}
        penumbra={1}
        color="#ff4500"
      />
      <spotLight
        position={[0, -10, 5]}
        intensity={3}
        angle={0.6}
        penumbra={1}
        color="#00ffff"
      />
      <IPv4Mechanical progress={progress} />
      <IPv6Velocity progress={progress} mousePosRef={mousePosRef} />
    </Canvas>
  );
}

export default Scene3D;
