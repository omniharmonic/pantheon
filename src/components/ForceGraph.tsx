'use client';

import { useMemo } from 'react';
import { useForceGraph } from '@/hooks/useForceGraph';
import { getSyncreticNodes } from '@/lib/data';
import { useStore } from '@/lib/store';
import TraditionNode from './TraditionNode';
import ConnectionEdge from './ConnectionEdge';
import SyncreticNode from './SyncreticNode';
import CameraController from './CameraController';
import FigureGraph from './FigureGraph';
import type { GraphNode } from '@/lib/types';

export default function ForceGraph({
  controlsRef,
}: {
  controlsRef: React.RefObject<any>;
}) {
  const { nodes, links } = useForceGraph();
  const syncreticNodes = getSyncreticNodes();
  const selectedTradition = useStore((s) => s.selectedTradition);
  const hoveredTradition = useStore((s) => s.hoveredTradition);

  const nodeMap = useMemo(() => {
    const map = new Map<string, GraphNode>();
    nodes.forEach((n) => map.set(n.id, n));
    return map;
  }, [nodes]);

  // Build connected sets for BOTH selected AND hovered traditions
  const { connectedIds, connectedLinkIds } = useMemo(() => {
    // The "active" node is whichever is selected, or hovered if nothing is selected
    const activeId = selectedTradition?.id || hoveredTradition;
    if (!activeId) return { connectedIds: new Set<string>(), connectedLinkIds: new Set<string>() };

    const cIds = new Set<string>();
    const lIds = new Set<string>();
    cIds.add(activeId);
    links.forEach((link) => {
      if (link.source === activeId || link.target === activeId) {
        cIds.add(link.source);
        cIds.add(link.target);
        lIds.add(link.connection.id);
      }
    });
    return { connectedIds: cIds, connectedLinkIds: lIds };
  }, [selectedTradition, hoveredTradition, links]);

  const hasActive = selectedTradition !== null || hoveredTradition !== null;

  return (
    <>
      <CameraController
        nodeMap={nodeMap}
        controlsRef={controlsRef}
      />

      {/* Connection edges — render first so nodes draw on top */}
      {links.map((link) => (
        <ConnectionEdge
          key={link.connection.id}
          link={link}
          nodeMap={nodeMap}
          highlighted={connectedLinkIds.has(link.connection.id)}
          dimmed={hasActive && !connectedLinkIds.has(link.connection.id)}
        />
      ))}

      {/* Tradition nodes */}
      {nodes.map((node) => (
        <TraditionNode
          key={node.id}
          node={node}
          highlighted={connectedIds.has(node.id)}
          dimmed={hasActive && !connectedIds.has(node.id)}
        />
      ))}

      {/* Syncretic fusion points */}
      {syncreticNodes.map((sn) => (
        <SyncreticNode key={sn.id} syncNode={sn} nodeMap={nodeMap} />
      ))}

      {/* Figure layer */}
      <FigureGraph nodeMap={nodeMap} controlsRef={controlsRef} />
    </>
  );
}
