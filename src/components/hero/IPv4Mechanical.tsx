'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { MotionValue } from 'motion/react';
import * as THREE from 'three';

export function IPv4Mechanical({ progress }: { progress: MotionValue<number> }) {
  const gearRef = useRef<THREE.Group>(null);
  const sparksRef = useRef<THREE.Points>(null);
  const gearGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    const innerRadius = 1.8;
    const outerRadius = 2.2;
    const teeth = 32;
    for (let i = 0; i < teeth * 2; i++) {
      const angle = (i / (teeth * 2)) * Math.PI * 2;
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      if (i === 0) shape.moveTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
      else shape.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
    }
    shape.closePath();
    const holePath = new THREE.Path();
    holePath.absarc(0, 0, 0.6, 0, Math.PI * 2, true);
    shape.holes.push(holePath);
    return new THREE.ExtrudeGeometry(shape, { depth: 0.4, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.1 });
  }, []);
  const sparkCount = 200;
  const sparkPositions = useMemo(() => new Float32Array(sparkCount * 3), []);
  useFrame((state, delta) => {
    const p = progress.get();
    if (!gearRef.current) return;
    gearRef.current.visible = p < 0.6;
    
    const stress = p < 0.45 ? Math.pow(p * 2.2, 3) : 0;
    gearRef.current.rotation.z += delta * (2 + stress * 30);
    
    if (p > 0.2 && p < 0.45) {
      gearRef.current.position.x = (Math.random() - 0.5) * 0.05 * stress;
      gearRef.current.position.y = (Math.random() - 0.5) * 0.05 * stress;
    }
    if (p >= 0.4) {
      const explodeFactor = (p - 0.4) * 15;
      gearRef.current.scale.setScalar(Math.max(0, 1 + explodeFactor));
      gearRef.current.children.forEach(child => {
        if (child instanceof THREE.Mesh) {
          child.material.opacity = Math.max(0, 1 - (p - 0.4) * 8);
          child.material.transparent = true;
        }
      });
    } else {
      gearRef.current.scale.setScalar(1);
    }
    if (sparksRef.current) {
      const sVis = p > 0.1 && p < 0.5;
      sparksRef.current.visible = sVis;
      const positions = sparksRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < sparkCount; i++) {
        if (Math.random() > 0.9) {
          const angle = Math.random() * Math.PI * 2;
          const r = 2.1;
          positions[i * 3] = Math.cos(angle) * r;
          positions[i * 3 + 1] = Math.sin(angle) * r;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
        } else {
          positions[i * 3 + 1] -= delta * 5 * stress;
        }
      }
      sparksRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });
  return (
    <group ref={gearRef}>
      <mesh geometry={gearGeometry}>
        <meshStandardMaterial 
          color="#8b5e34" 
          roughness={0.1} 
          metalness={1} 
          emissive="#ff4500"
          emissiveIntensity={0.5}
        />
      </mesh>
      
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.7, 32]} />
        <meshStandardMaterial color="#222" metalness={0.9} roughness={0.4} />
      </mesh>
      <points ref={sparksRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[sparkPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.06} color="#ff8800" transparent opacity={0.8} />
      </points>
    </group>
  );
}
