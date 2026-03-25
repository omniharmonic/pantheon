'use client';

import { useMemo } from 'react';
import { getTraditions, getConnections, getSharedFigures } from '@/lib/data';
import { buildForceGraph } from '@/lib/forceSimulation';
import { useStore } from '@/lib/store';
import type { GraphNode, GraphLink } from '@/lib/types';

export function useForceGraph(): { nodes: GraphNode[]; links: GraphLink[] } {
  const activeRegions = useStore((s) => s.activeRegions);
  const activeTheologyTypes = useStore((s) => s.activeTheologyTypes);
  const timeRange = useStore((s) => s.timeRange);
  const searchQuery = useStore((s) => s.searchQuery);

  const traditions = getTraditions();
  const connections = getConnections();

  const { nodes: allNodes, links: allLinks } = useMemo(
    () => buildForceGraph(traditions, connections),
    [traditions, connections]
  );

  const filteredNodes = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return allNodes.map((node) => {
      let visible = true;

      // Region filter
      if (activeRegions.size > 0 && !activeRegions.has(node.tradition.region)) {
        visible = false;
      }

      // Theology type filter
      if (
        activeTheologyTypes.size > 0 &&
        !node.tradition.theologicalType.some((t) => activeTheologyTypes.has(t))
      ) {
        visible = false;
      }

      // Time range filter
      const originDate = node.tradition.originDate;
      const endDate = node.tradition.endDate ?? 2025;
      if (originDate > timeRange[1] || endDate < timeRange[0]) {
        visible = false;
      }

      // Search filter — also searches shared figures and shows their traditions
      if (query) {
        const nameMatch = node.tradition.name.toLowerCase().includes(query);
        const deityMatch = (node.tradition.keyFigures || []).some((f) =>
          f.name?.toLowerCase().includes(query)
        );
        const conceptMatch = (node.tradition.keyConcepts || []).some((c) =>
          c?.toLowerCase().includes(query)
        );
        // Check shared figures: if a figure name/alias matches, show all traditions it belongs to
        const sharedFigureMatch = getSharedFigures().some(
          (f) =>
            (f.name?.toLowerCase().includes(query) ||
              (f.aliases || []).some((a) => a?.toLowerCase().includes(query))) &&
            (f.traditions || []).includes(node.tradition.id)
        );
        if (!nameMatch && !deityMatch && !conceptMatch && !sharedFigureMatch) {
          visible = false;
        }
      }

      return { ...node, visible };
    });
  }, [allNodes, activeRegions, activeTheologyTypes, timeRange, searchQuery]);

  const filteredLinks = useMemo(() => {
    const visibleIds = new Set(filteredNodes.filter((n) => n.visible).map((n) => n.id));
    return allLinks.filter(
      (l) => visibleIds.has(l.source) && visibleIds.has(l.target)
    );
  }, [allLinks, filteredNodes]);

  return { nodes: filteredNodes, links: filteredLinks };
}
