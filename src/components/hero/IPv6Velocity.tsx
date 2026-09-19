'use client';

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { MotionValue } from 'motion/react';
import * as THREE from 'three';

const RAIL_COUNT = 36;
const PULSE_COUNT = 64;
const TRACK_LENGTH = 120;

const ALNUM_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const PALETTE = ['#ffffff', '#fde047', '#d4af37', '#f59e0b', '#fbbf24'];

function pseudoRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function generateRandomString(seed: number): string {
  const getChar = (idx: number) =>
    ALNUM_CHARS[Math.floor(pseudoRandom(seed * 73.1 + idx * 17.9) * ALNUM_CHARS.length)];
  const chunkCount = 3 + Math.floor(pseudoRandom(seed * 7.7) * 3);
  const delims = [':', ':', '-', '::', '.'];
  const delim = delims[Math.floor(pseudoRandom(seed * 13.3) * delims.length)];
  const chunks: string[] = [];
  for (let c = 0; c < chunkCount; c++) {
    const chunkLen = 3 + Math.floor(pseudoRandom(seed * 29.1 + c * 11.3) * 3);
    let chunk = '';
    for (let j = 0; j < chunkLen; j++) {
      chunk += getChar(c * 6 + j);
    }
    chunks.push(chunk);
  }
  return chunks.join(delim);
}

function createTextTexture(text: string, color: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, 1024, 128);
  ctx.font = '900 44px monospace, ui-monospace, "Courier New"';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = color;
  ctx.shadowBlur = 18;
  ctx.fillStyle = '#ffffff';
  ctx.fillText(text, 512, 64);
  ctx.fillStyle = color;
  ctx.fillText(text, 512, 64);

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

interface IPv6VelocityProps {
  progress: MotionValue<number>;
  mousePosRef: React.MutableRefObject<{ x: number; y: number }>;
}

export function IPv6Velocity({ progress, mousePosRef }: IPv6VelocityProps) {
  const groupRef = useRef<THREE.Group>(null);
  const railsRef = useRef<THREE.Group>(null);
  const pulsesRef = useRef<THREE.Group>(null);

  const currentRot = useRef({ x: 0, y: 0 });
  const currentShift = useRef({ x: 0, y: 0 });

  const [textures, setTextures] = useState<THREE.CanvasTexture[]>([]);

  const railData = useMemo(() => {
    const data = [];
    for (let i = 0; i < RAIL_COUNT; i++) {
      const angle = (i / RAIL_COUNT) * Math.PI * 2;
      const radius = 6 + pseudoRandom(i * 19.3) * 8;
      data.push({
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
      });
    }
    return data;
  }, []);

  const pulseData = useMemo(() => {
    const data = [];
    for (let i = 0; i < PULSE_COUNT; i++) {
      const railIndex = Math.floor(pseudoRandom(i * 37.1) * RAIL_COUNT);
      const rail = railData[railIndex];
      const theta = Math.atan2(rail.y, rail.x);

      const xCol = new THREE.Vector3(0, 0, -1);
      const yCol = new THREE.Vector3(Math.sin(theta), -Math.cos(theta), 0);
      const zCol = new THREE.Vector3(-Math.cos(theta), -Math.sin(theta), 0);
      const mat = new THREE.Matrix4().makeBasis(xCol, yCol, zCol);
      const rot = new THREE.Euler().setFromRotationMatrix(mat);

      const color = PALETTE[i % PALETTE.length];
      const length = 12 + pseudoRandom(i * 41.2) * 6;
      const height = length / 8;

      data.push({
        railIndex,
        offset: (pseudoRandom(i * 53.7) - 0.5) * TRACK_LENGTH,
        speed: (45 + pseudoRandom(i * 79.9) * 90) * 0.75,
        color,
        length,
        height,
        rotation: [rot.x, rot.y, rot.z] as [number, number, number],
      });
    }
    return data;
  }, [railData]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const list: THREE.CanvasTexture[] = [];
    const count = 8;
    for (let i = 0; i < count; i++) {
      const text = generateRandomString(i + 1);
      const color = PALETTE[i % PALETTE.length];
      list.push(createTextTexture(text, color));
    }
    setTextures(list);

    return () => {
      list.forEach((t) => t.dispose());
    };
  }, []);

  useFrame((state, delta) => {
    const p = progress.get();
    if (!groupRef.current) return;

    const visibility = THREE.MathUtils.smoothstep(p, 0.45, 0.6);
    const flowIntensity = THREE.MathUtils.smoothstep(p, 0.6, 0.9);

    groupRef.current.visible = visibility > 0.001;
    groupRef.current.position.z = -50 + flowIntensity * 40;

    const mouse = mousePosRef.current;

    const targetRotY = mouse.x * 0.4 * flowIntensity;
    const targetRotX = -mouse.y * 0.25 * flowIntensity;
    const targetShiftX = mouse.x * 2.2 * flowIntensity;
    const targetShiftY = mouse.y * 1.5 * flowIntensity;

    const lerpSpeed = 1 - Math.pow(0.04, delta);
    currentRot.current.x += (targetRotX - currentRot.current.x) * lerpSpeed;
    currentRot.current.y += (targetRotY - currentRot.current.y) * lerpSpeed;
    currentShift.current.x += (targetShiftX - currentShift.current.x) * lerpSpeed;
    currentShift.current.y += (targetShiftY - currentShift.current.y) * lerpSpeed;

    groupRef.current.rotation.x = currentRot.current.x;
    groupRef.current.rotation.y = currentRot.current.y;
    groupRef.current.position.x = currentShift.current.x;
    groupRef.current.position.y = currentShift.current.y;

    if (pulsesRef.current && textures.length > 0) {
      pulsesRef.current.children.forEach((child, i) => {
        const d = pulseData[i];
        d.offset -= d.speed * delta * flowIntensity;
        if (d.offset < -TRACK_LENGTH / 2) {
          d.offset = TRACK_LENGTH / 2;
        }

        const rail = railData[d.railIndex];
        child.position.set(rail.x, rail.y, d.offset);

        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          (mesh.material as THREE.MeshBasicMaterial).opacity =
            flowIntensity * (0.85 + Math.sin(state.clock.elapsedTime * 6 + i) * 0.15);
        }
      });
    }

    if (railsRef.current) {
      railsRef.current.children.forEach((child) => {
        const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
        mat.opacity = visibility * 0.15;
      });
    }
  });

  return (
    <group ref={groupRef}>
      <group ref={railsRef}>
        {railData.map((rail, i) => (
          <mesh key={`rail-${i}`} position={[rail.x, rail.y, 0]}>
            <boxGeometry args={[0.015, 0.015, TRACK_LENGTH]} />
            <meshBasicMaterial
              color="#fde047"
              transparent
              opacity={0}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>
      <group ref={pulsesRef}>
        {textures.length > 0 &&
          pulseData.map((pulse, i) => (
            <mesh
              key={`char-stream-${i}`}
              rotation={pulse.rotation}
            >
              <planeGeometry args={[pulse.length, pulse.height]} />
              <meshBasicMaterial
                map={textures[i % textures.length]}
                transparent
                opacity={0}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
                side={THREE.DoubleSide}
              />
            </mesh>
          ))}
      </group>
      <mesh position={[0, 0, -TRACK_LENGTH / 2]}>
        <planeGeometry args={[120, 120]} />
        <meshBasicMaterial color="#030305" transparent opacity={0.92} />
      </mesh>
      <pointLight position={[0, 0, 10]} intensity={2} color="#d4af37" distance={40} />
    </group>
  );
}
