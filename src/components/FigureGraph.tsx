'use client';

import { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Line } from '@react-three/drei';
import * as THREE from 'three';
import type { GraphNode, SharedFigure } from '@/lib/types';
import { useStore } from '@/lib/store';
import { getSharedFigures, getFigureById } from '@/lib/data';
import { FIGURE_TYPE_COLORS, FIGURE_CONNECTION_COLORS } from '@/lib/colors';

interface FigurePosition {
  figure: SharedFigure;
  x: number;
  y: number;
  z: number;
  color: string;
}

/** Compute positions for all figures based on their tradition node positions */
function computeFigurePositions(
  nodeMap: Map<string, GraphNode>
): FigurePosition[] {
  const figures = getSharedFigures();
  const positions: FigurePosition[] = [];

  // Distribute figures around their tradition node(s)
  // Multi-tradition figures sit at the centroid of their traditions
  const traditionFigureCounts = new Map<string, number>();

  figures.forEach((fig) => {
    const tradNodes = fig.traditions
      .map((t) => nodeMap.get(t))
      .filter(Boolean) as GraphNode[];

    if (tradNodes.length === 0) return;

    // Centroid of all parent traditions
    let cx = 0, cy = 0, cz = 0;
    tradNodes.forEach((n) => { cx += n.x; cy += n.y; cz += n.z; });
    cx /= tradNodes.length;
    cy /= tradNodes.length;
    cz /= tradNodes.length;

    // Offset from centroid — use a deterministic spread based on figure index
    // within each tradition to avoid stacking
    const primaryTrad = fig.traditions[0];
    const count = traditionFigureCounts.get(primaryTrad) || 0;
    traditionFigureCounts.set(primaryTrad, count + 1);

    // Golden angle distribution for nice spread
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    const angle = count * goldenAngle;
    const radius = 2.5 + (count * 0.3); // grow slightly with more figures
    const heightOffset = (count % 3 - 1) * 1.2; // layer vertically too

    // If multi-tradition, push further toward centroid (between traditions)
    const spreadFactor = tradNodes.length > 1 ? 0.6 : 1.0;

    // For single-tradition: orbit around the tradition node
    // For multi-tradition: cluster around the midpoint between traditions
    const base = tradNodes.length === 1 ? tradNodes[0] : null;
    const ox = base ? base.x : cx;
    const oy = base ? base.y : cy;
    const oz = base ? base.z : cz;

    positions.push({
      figure: fig,
      x: ox + Math.cos(angle) * radius * spreadFactor,
      y: oy + heightOffset,
      z: oz + Math.sin(angle) * radius * spreadFactor,
      color: FIGURE_TYPE_COLORS[fig.type] || '#8899aa',
    });
  });

  return positions;
}

// Individual figure node
function FigureNode({
  pos,
  highlighted,
  dimmed,
}: {
  pos: FigurePosition;
  highlighted: boolean;
  dimmed: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);
  const setSelectedFigure = useStore((s) => s.setSelectedFigure);
  const setHoveredFigure = useStore((s) => s.setHoveredFigure);
  const selectedFigure = useStore((s) => s.selectedFigure);

  const isSelected = selectedFigure?.id === pos.figure.id;
  const isActive = isSelected || hovered || highlighted;

  const baseScale = 0.35;
  const targetScale = isSelected
    ? baseScale * 2.0
    : hovered
    ? baseScale * 1.6
    : highlighted
    ? baseScale * 1.3
    : dimmed
    ? baseScale * 0.5
    : baseScale;

  const targetOpacity = dimmed ? 0.1 : isActive ? 1.0 : 0.6;

  useFrame(() => {
    if (meshRef.current) {
      const s = meshRef.current.scale.x;
      meshRef.current.scale.setScalar(THREE.MathUtils.lerp(s, targetScale, 0.1));
    }
  });

  const color = new THREE.Color(pos.color);

  return (
    <group position={[pos.x, pos.y, pos.z]}>
      {/* Small node sphere */}
      <mesh
        ref={meshRef}
        scale={baseScale}
        onClick={(e) => {
          e.stopPropagation();
          if (selectedFigure?.id === pos.figure.id) {
            setSelectedFigure(null);
          } else {
            setSelectedFigure(pos.figure);
          }
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          setHoveredFigure(pos.figure.id);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          setHoveredFigure(null);
          document.body.style.cursor = 'auto';
        }}
      >
        {/* Icosahedron to differentiate from tradition spheres */}
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isActive ? 0.9 : dimmed ? 0.05 : 0.4}
          transparent
          opacity={targetOpacity}
          roughness={0.2}
          metalness={0.3}
        />
      </mesh>

      {/* Label (only show on hover or selected or highlighted) */}
      {(hovered || isSelected || (highlighted && !dimmed)) && (
        <Html
          center
          distanceFactor={30}
          zIndexRange={[1, 0]}
          style={{
            pointerEvents: 'none',
            userSelect: 'none',
            whiteSpace: 'nowrap',
          }}
          position={[0, baseScale + 0.6, 0]}
        >
          <div
            className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full transition-all ${
              isSelected
                ? 'bg-white/20 text-white backdrop-blur-sm font-bold'
                : 'bg-black/40 text-white/80 backdrop-blur-sm'
            }`}
            style={{ textShadow: '0 0 6px rgba(0,0,0,0.9)' }}
          >
            {pos.figure.name}
            {pos.figure.traditions.length > 1 && (
              <span className="text-[8px] text-white/40 ml-1">
                ×{pos.figure.traditions.length}
              </span>
            )}
          </div>
        </Html>
      )}
    </group>
  );
}

// Figure connection edge
function FigureEdge({
  from,
  to,
  type,
  highlighted,
  dimmed,
}: {
  from: FigurePosition;
  to: FigurePosition;
  type: string;
  highlighted: boolean;
  dimmed: boolean;
}) {
  const points = useMemo(() => {
    const start = new THREE.Vector3(from.x, from.y, from.z);
    const end = new THREE.Vector3(to.x, to.y, to.z);

    // Simple straight line for figure connections (keeps it cleaner)
    const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    // Slight upward arc to avoid z-fighting with tradition edges
    mid.y += 0.5;

    const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
    return curve.getPoints(12).map((p) => [p.x, p.y, p.z] as [number, number, number]);
  }, [from.x, from.y, from.z, to.x, to.y, to.z]);

  const color = FIGURE_CONNECTION_COLORS[type] || '#666688';

  return (
    <Line
      points={points}
      color={highlighted ? color : color}
      lineWidth={highlighted ? 1.5 : 0.4}
      transparent
      opacity={highlighted ? 0.7 : dimmed ? 0.03 : 0.12}
      dashed={false}
    />
  );
}

// Main figure graph layer
export default function FigureGraph({
  nodeMap,
}: {
  nodeMap: Map<string, GraphNode>;
}) {
  const showFigureLayer = useStore((s) => s.showFigureLayer);
  const selectedFigure = useStore((s) => s.selectedFigure);
  const hoveredFigure = useStore((s) => s.hoveredFigure);

  const figurePositions = useMemo(() => {
    if (!showFigureLayer) return [];
    return computeFigurePositions(nodeMap);
  }, [showFigureLayer, nodeMap]);

  const posMap = useMemo(() => {
    const map = new Map<string, FigurePosition>();
    figurePositions.forEach((p) => map.set(p.figure.id, p));
    return map;
  }, [figurePositions]);

  // Build connection set for highlighting
  const { connectedIds, connectedEdges } = useMemo(() => {
    const activeFigureId = selectedFigure?.id || hoveredFigure;
    if (!activeFigureId) return { connectedIds: new Set<string>(), connectedEdges: new Set<string>() };

    const cIds = new Set<string>();
    const eIds = new Set<string>();
    cIds.add(activeFigureId);

    const fig = getFigureById(activeFigureId);
    if (fig) {
      fig.connections.forEach((conn) => {
        if (posMap.has(conn.to)) {
          cIds.add(conn.to);
          eIds.add(`${activeFigureId}-${conn.to}`);
          eIds.add(`${conn.to}-${activeFigureId}`);
        }
      });
    }

    // Also check reverse connections (figures that connect TO this one)
    figurePositions.forEach((p) => {
      p.figure.connections.forEach((conn) => {
        if (conn.to === activeFigureId) {
          cIds.add(p.figure.id);
          eIds.add(`${p.figure.id}-${activeFigureId}`);
          eIds.add(`${activeFigureId}-${p.figure.id}`);
        }
      });
    });

    return { connectedIds: cIds, connectedEdges: eIds };
  }, [selectedFigure, hoveredFigure, figurePositions, posMap]);

  const hasActiveFigure = (selectedFigure !== null || hoveredFigure !== null);

  // Build edges
  const edges = useMemo(() => {
    const result: { from: FigurePosition; to: FigurePosition; type: string; key: string }[] = [];
    const seen = new Set<string>();

    figurePositions.forEach((fromPos) => {
      fromPos.figure.connections.forEach((conn) => {
        const toPos = posMap.get(conn.to);
        if (!toPos) return;
        const edgeKey = [fromPos.figure.id, conn.to].sort().join('-');
        if (seen.has(edgeKey)) return;
        seen.add(edgeKey);
        result.push({
          from: fromPos,
          to: toPos,
          type: conn.type,
          key: `${fromPos.figure.id}-${conn.to}`,
        });
      });
    });

    return result;
  }, [figurePositions, posMap]);

  if (!showFigureLayer || figurePositions.length === 0) return null;

  return (
    <>
      {/* Figure edges first */}
      {edges.map((edge) => (
        <FigureEdge
          key={edge.key}
          from={edge.from}
          to={edge.to}
          type={edge.type}
          highlighted={connectedEdges.has(edge.key)}
          dimmed={hasActiveFigure && !connectedEdges.has(edge.key)}
        />
      ))}

      {/* Figure nodes */}
      {figurePositions.map((pos) => (
        <FigureNode
          key={pos.figure.id}
          pos={pos}
          highlighted={connectedIds.has(pos.figure.id)}
          dimmed={hasActiveFigure && !connectedIds.has(pos.figure.id)}
        />
      ))}
    </>
  );
}
