'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import type { GraphNode, GraphLink } from '@/lib/types';
import { CONNECTION_COLORS } from '@/lib/colors';
import { Line } from '@react-three/drei';

interface Props {
  link: GraphLink;
  nodeMap: Map<string, GraphNode>;
  highlighted: boolean;
  dimmed: boolean;
}

export default function ConnectionEdge({ link, nodeMap, highlighted, dimmed }: Props) {
  const sourceNode = nodeMap.get(link.source);
  const targetNode = nodeMap.get(link.target);

  const points = useMemo(() => {
    if (!sourceNode || !targetNode) return null;

    const start = new THREE.Vector3(sourceNode.x, sourceNode.y, sourceNode.z);
    const end = new THREE.Vector3(targetNode.x, targetNode.y, targetNode.z);

    const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    const dir = new THREE.Vector3().subVectors(end, start);
    const offset = new THREE.Vector3()
      .copy(dir)
      .cross(new THREE.Vector3(0, 1, 0))
      .normalize()
      .multiplyScalar(1.5);

    if (offset.length() < 0.01) {
      offset.set(1.5, 0, 0);
    }
    mid.add(offset);

    const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
    return curve.getPoints(24).map((p) => [p.x, p.y, p.z] as [number, number, number]);
  }, [sourceNode, targetNode]);

  if (!points || !sourceNode?.visible || !targetNode?.visible) return null;

  const type = link.connection.type;
  const color = highlighted ? CONNECTION_COLORS[type] || '#ffffff' : CONNECTION_COLORS[type] || '#888888';
  const strength = link.connection.strength;

  // Highlighted connections are bright and thick; dimmed are nearly invisible
  let opacity: number;
  let lineWidth: number;

  if (highlighted) {
    opacity = strength === 'strong' ? 0.9 : strength === 'moderate' ? 0.7 : 0.5;
    lineWidth = type === 'parent_child' ? 3 : 2;
  } else if (dimmed) {
    opacity = 0.04;
    lineWidth = 0.5;
  } else {
    opacity = strength === 'strong' ? 0.4 : strength === 'moderate' ? 0.25 : 0.12;
    lineWidth = type === 'parent_child' ? 1.5 : 0.8;
  }

  const dashed = type === 'influence' || type === 'parent_reaction';

  return (
    <Line
      points={points}
      color={color}
      lineWidth={lineWidth}
      transparent
      opacity={opacity}
      dashed={dashed}
      dashSize={dashed ? 0.8 : undefined}
      gapSize={dashed ? 0.4 : undefined}
    />
  );
}
