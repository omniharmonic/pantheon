import {
  forceSimulation,
  forceManyBody,
  forceLink,
  forceCenter,
  forceCollide,
  forceX,
  forceY,
  forceZ,
} from 'd3-force-3d';
import type { Tradition, Connection, GraphNode, GraphLink } from './types';
import { getTheologyColor } from './colors';
import { getConnectionCount } from './data';

const REGION_POSITIONS: Record<string, { x: number; y: number; z: number }> = {
  'Central Eurasia': { x: 0, y: 20, z: 0 },
  Mesopotamia: { x: -15, y: 5, z: 10 },
  Levant: { x: -12, y: 0, z: 15 },
  'Levant / Mediterranean': { x: -10, y: -2, z: 18 },
  'Northeast Africa': { x: -20, y: -5, z: 5 },
  'South Asia': { x: 15, y: 5, z: -5 },
  'East Asia': { x: 25, y: 0, z: -15 },
  'Iran / Central Asia': { x: 5, y: 10, z: 5 },
  'Mediterranean / Europe': { x: -8, y: 5, z: 20 },
  'Northern Europe': { x: -5, y: 15, z: 25 },
  'Western/Central Europe': { x: -10, y: 12, z: 22 },
  'Eastern Europe': { x: 0, y: 14, z: 20 },
  'Northeast Europe': { x: 2, y: 16, z: 18 },
  Mesoamerica: { x: -35, y: -10, z: -20 },
  'South America': { x: -30, y: -15, z: -18 },
  'West Africa': { x: -25, y: -12, z: 0 },
  'Caribbean / Americas': { x: -30, y: -8, z: -10 },
  'Southeast Asia': { x: 22, y: -5, z: -10 },
};

interface SimNode {
  id: string;
  x: number;
  y: number;
  z: number;
  fx?: number | null;
  fy?: number | null;
  fz?: number | null;
  tradition: Tradition;
}

interface SimLink {
  source: string | SimNode;
  target: string | SimNode;
  connection: Connection;
}

export function buildForceGraph(
  traditions: Tradition[],
  connections: Connection[]
): { nodes: GraphNode[]; links: GraphLink[] } {
  const traditionIds = new Set(traditions.map((t) => t.id));

  const simNodes: SimNode[] = traditions.map((t) => {
    const regionPos = REGION_POSITIONS[t.region] || { x: 0, y: 0, z: 0 };
    return {
      id: t.id,
      x: regionPos.x + (Math.random() - 0.5) * 8,
      y: regionPos.y + (Math.random() - 0.5) * 8,
      z: regionPos.z + (Math.random() - 0.5) * 8,
      tradition: t,
    };
  });

  const simLinks: SimLink[] = connections
    .filter((c) => traditionIds.has(c.from) && traditionIds.has(c.to))
    .map((c) => ({
      source: c.from,
      target: c.to,
      connection: c,
    }));

  const linkStrength = (l: SimLink) => {
    const s = l.connection.strength;
    if (s === 'strong') return 0.3;
    if (s === 'moderate') return 0.15;
    return 0.08;
  };

  const sim = forceSimulation(simNodes, 3)
    .force(
      'link',
      forceLink(simLinks)
        .id((d: SimNode) => d.id)
        .distance(12)
        .strength(linkStrength)
    )
    .force('charge', forceManyBody().strength(-80).distanceMax(100))
    .force('center', forceCenter(0, 0, 0).strength(0.05))
    .force('collision', forceCollide(3))
    .force(
      'regionX',
      forceX((d: SimNode) => {
        const pos = REGION_POSITIONS[d.tradition.region];
        return pos ? pos.x : 0;
      }).strength(0.08)
    )
    .force(
      'regionY',
      forceY((d: SimNode) => {
        const pos = REGION_POSITIONS[d.tradition.region];
        return pos ? pos.y : 0;
      }).strength(0.08)
    )
    .force(
      'regionZ',
      forceZ((d: SimNode) => {
        const pos = REGION_POSITIONS[d.tradition.region];
        return pos ? pos.z : 0;
      }).strength(0.08)
    )
    .stop();

  // Run simulation ticks
  for (let i = 0; i < 300; i++) {
    sim.tick();
  }

  const maxConnections = Math.max(
    ...traditions.map((t) => getConnectionCount(t.id)),
    1
  );

  const graphNodes: GraphNode[] = simNodes.map((n) => {
    const connCount = getConnectionCount(n.id);
    const radius = 0.8 + (connCount / maxConnections) * 1.5;
    return {
      id: n.id,
      x: n.x,
      y: n.y,
      z: n.z,
      tradition: n.tradition,
      color: getTheologyColor(n.tradition.theologicalType),
      radius,
      visible: true,
    };
  });

  const graphLinks: GraphLink[] = simLinks.map((l) => ({
    source: typeof l.source === 'string' ? l.source : l.source.id,
    target: typeof l.target === 'string' ? l.target : l.target.id,
    connection: l.connection,
  }));

  return { nodes: graphNodes, links: graphLinks };
}
