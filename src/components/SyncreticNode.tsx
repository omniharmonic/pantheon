'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Line } from '@react-three/drei';
import * as THREE from 'three';
import type { SyncreticNode as SyncreticNodeType, GraphNode } from '@/lib/types';

interface Props {
  syncNode: SyncreticNodeType;
  nodeMap: Map<string, GraphNode>;
}

export default function SyncreticNode({ syncNode, nodeMap }: Props) {
  const meshRef = useRef<THREE.Mesh>(null!);

  // Position at the centroid of all participating traditions
  const positions = syncNode.traditions
    .map((id) => nodeMap.get(id))
    .filter(Boolean) as GraphNode[];

  if (positions.length === 0) return null;

  const centroid = {
    x: positions.reduce((s, p) => s + p.x, 0) / positions.length,
    y: positions.reduce((s, p) => s + p.y, 0) / positions.length,
    z: positions.reduce((s, p) => s + p.z, 0) / positions.length,
  };

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const t = clock.getElapsedTime();
      meshRef.current.rotation.y = t * 0.5;
      meshRef.current.rotation.z = t * 0.3;
      const pulse = 1 + Math.sin(t * 2) * 0.1;
      meshRef.current.scale.setScalar(pulse * 0.6);
    }
  });

  return (
    <group position={[centroid.x, centroid.y, centroid.z]}>
      <mesh ref={meshRef} scale={0.6}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color="#ffaa44"
          emissive="#ffaa44"
          emissiveIntensity={0.6}
          transparent
          opacity={0.7}
          wireframe={false}
        />
      </mesh>
      {/* Glow */}
      <mesh scale={1.2}>
        <octahedronGeometry args={[1, 0]} />
        <meshBasicMaterial
          color="#ffaa44"
          transparent
          opacity={0.08}
          depthWrite={false}
        />
      </mesh>
      <Html
        center
        distanceFactor={50}
        style={{ pointerEvents: 'none', userSelect: 'none', whiteSpace: 'nowrap' }}
        position={[0, 1.5, 0]}
      >
        <div
          className="text-[10px] text-amber-300/70 font-medium"
          style={{ textShadow: '0 0 6px rgba(0,0,0,0.9)' }}
        >
          {syncNode.name}
        </div>
      </Html>

      {/* Lines to each participating tradition */}
      {positions.map((p) => (
        <Line
          key={p.id}
          points={[
            [0, 0, 0],
            [p.x - centroid.x, p.y - centroid.y, p.z - centroid.z],
          ]}
          color="#ffaa44"
          transparent
          opacity={0.15}
          lineWidth={0.5}
        />
      ))}
    </group>
  );
}
