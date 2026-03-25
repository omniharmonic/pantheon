'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import type { GraphNode } from '@/lib/types';
import { useStore } from '@/lib/store';
import { STATUS_OPACITY } from '@/lib/colors';
import { getTraditionById } from '@/lib/data';

interface Props {
  node: GraphNode;
  highlighted: boolean;
  dimmed: boolean;
}

export default function TraditionNode({ node, highlighted, dimmed }: Props) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const glowRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);

  const selectedTradition = useStore((s) => s.selectedTradition);
  const setSelectedTradition = useStore((s) => s.setSelectedTradition);
  const setHoveredTradition = useStore((s) => s.setHoveredTradition);

  const isSelected = selectedTradition?.id === node.id;
  const isActive = isSelected || hovered || highlighted;
  const statusOpacity = STATUS_OPACITY[node.tradition.status] ?? 0.7;
  const baseScale = node.radius;

  // Dimmed nodes shrink and fade; highlighted/selected pop
  const targetScale = isSelected
    ? baseScale * 1.5
    : hovered
    ? baseScale * 1.3
    : highlighted
    ? baseScale * 1.15
    : dimmed
    ? baseScale * 0.7
    : baseScale;

  const targetOpacity = dimmed ? statusOpacity * 0.15 : statusOpacity;

  useFrame(() => {
    if (meshRef.current) {
      const s = meshRef.current.scale.x;
      meshRef.current.scale.setScalar(THREE.MathUtils.lerp(s, targetScale, 0.1));
    }
    if (glowRef.current) {
      const s = glowRef.current.scale.x;
      const glowTarget = isActive ? baseScale * 2.5 : dimmed ? baseScale * 0.5 : baseScale * 1.8;
      glowRef.current.scale.setScalar(THREE.MathUtils.lerp(s, glowTarget, 0.1));
    }
  });

  if (!node.visible) return null;

  const color = new THREE.Color(node.color);

  return (
    <group position={[node.x, node.y, node.z]}>
      {/* Glow sphere */}
      <mesh ref={glowRef} scale={baseScale * 1.8}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={(isActive ? 0.18 : dimmed ? 0.01 : 0.06) * statusOpacity}
          depthWrite={false}
        />
      </mesh>

      {/* Main sphere */}
      <mesh
        ref={meshRef}
        scale={baseScale}
        onClick={(e) => {
          e.stopPropagation();
          const tradition = getTraditionById(node.id);
          if (tradition) {
            // Toggle: click same node again to deselect
            if (selectedTradition?.id === node.id) {
              setSelectedTradition(null);
            } else {
              setSelectedTradition(tradition);
            }
          }
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredTradition(node.id);
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHoveredTradition(null);
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
      >
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isActive ? 0.8 : dimmed ? 0.05 : 0.3}
          transparent
          opacity={targetOpacity}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>

      {/* Ring highlight for selected connected nodes */}
      {highlighted && !isSelected && (
        <mesh scale={baseScale * 1.6} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.9, 1.0, 32]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.4}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* Label */}
      <Html
        center
        distanceFactor={40}
        zIndexRange={[1, 0]}
        style={{
          pointerEvents: 'none',
          userSelect: 'none',
          whiteSpace: 'nowrap',
          transition: 'opacity 0.3s',
          opacity: dimmed ? 0.1 : 1,
        }}
        position={[0, baseScale + 1.2, 0]}
      >
        <div
          className={`text-xs font-medium px-2 py-0.5 rounded-full transition-all ${
            isSelected
              ? 'bg-white/25 text-white backdrop-blur-sm scale-110 font-bold'
              : hovered || highlighted
              ? 'bg-white/15 text-white backdrop-blur-sm'
              : 'bg-transparent text-white/70'
          }`}
          style={{ textShadow: '0 0 8px rgba(0,0,0,0.8)' }}
        >
          {node.tradition.name}
        </div>
      </Html>
    </group>
  );
}
