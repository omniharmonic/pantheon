import type { ReligionData, Tradition, Connection, SyncreticNode, SharedFigure } from './types';
import rawData from '../../religion-data-model.json';
import rawFigures from '../../shared-figures.json';

const data = rawData as unknown as ReligionData;
const figures = rawFigures as unknown as SharedFigure[];

export function getTraditions(): Tradition[] {
  return data.traditions;
}

export function getConnections(): Connection[] {
  return data.connections;
}

export function getSyncreticNodes(): SyncreticNode[] {
  return data.syncreticNodes;
}

export function getTimelineEras() {
  return data.timelineEras;
}

export function getScholarlyFrameworks() {
  return data.scholarlyFrameworks;
}

export function getTheologicalTypeDefinitions() {
  return data.theologicalTypeDefinitions;
}

export function getTraditionById(id: string): Tradition | undefined {
  return data.traditions.find((t) => t.id === id);
}

export function getConnectionsForTradition(id: string): Connection[] {
  return data.connections.filter((c) => c.from === id || c.to === id);
}

export function getRegions(): string[] {
  const regions = new Set<string>();
  data.traditions.forEach((t) => regions.add(t.region));
  return Array.from(regions).sort();
}

export function getTheologyTypes(): string[] {
  const types = new Set<string>();
  data.traditions.forEach((t) => t.theologicalType.forEach((tt) => types.add(tt)));
  return Array.from(types).sort();
}

export function getConnectionCount(id: string): number {
  return data.connections.filter((c) => c.from === id || c.to === id).length;
}

export function getAllData(): ReligionData {
  return data;
}

// Shared figures across traditions
export function getSharedFigures(): SharedFigure[] {
  return figures;
}

export function getFigureById(id: string): SharedFigure | undefined {
  return figures.find((f) => f.id === id);
}

export function getFiguresForTradition(traditionId: string): SharedFigure[] {
  return figures.filter((f) => f.traditions.includes(traditionId));
}

export function getFigureConnections(figureId: string): { figure: SharedFigure; connection: SharedFigure['connections'][0] }[] {
  const figure = getFigureById(figureId);
  if (!figure || !Array.isArray(figure.connections)) return [];
  return figure.connections
    .map((conn) => {
      const target = getFigureById(conn.to);
      if (!target) return null;
      return { figure: target, connection: conn };
    })
    .filter(Boolean) as { figure: SharedFigure; connection: SharedFigure['connections'][0] }[];
}
