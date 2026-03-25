export interface KeyFigure {
  name: string;
  role: string;
  cognates?: string;
  akkadianEquiv?: string;
}

export interface MajorBranch {
  name: string;
  originDate?: number;
  regions?: string[];
  description: string;
  subSchools?: string[];
  focus?: string;
}

export interface MajorSect {
  name: string;
  description?: string;
  focus?: string;
}

export interface Period {
  era: string;
  focus: string;
}

export interface Tradition {
  id: string;
  name: string;
  originDate: number;
  originDateLabel?: string;
  endDate: number | null;
  status: string;
  geographicOrigin: string;
  region: string;
  theologicalType: string[];
  keyFigures: KeyFigure[];
  keyConcepts: string[];
  parentTraditions: string[];
  childTraditions: string[];
  syncreticConnections?: string[];
  influencedBy?: string[];
  influenced?: string[];
  evidence?: string;
  majorBranches?: MajorBranch[];
  majorSects?: MajorSect[];
  periods?: Period[];
  nearEasternInfluences?: string;
  importedCults?: string[];
}

export interface Connection {
  id: string;
  from: string;
  to: string;
  type: 'parent_child' | 'influence' | 'syncretism' | 'parent_reaction';
  strength: 'strong' | 'moderate' | 'weak';
  mechanism?: string;
  date?: number;
  evidence?: string;
  note?: string;
}

export interface SyncreticNode {
  id: string;
  name: string;
  date: number;
  traditions: string[];
  description: string;
  location?: string;
}

export interface ScholarlyFramework {
  id: string;
  name: string;
  scholar?: string;
  scholars?: string;
  year?: number;
  description: string;
  traditionsInvolved?: string[];
  keyConcepts?: string[];
  critiques?: string;
  examples?: string;
  useForVisualization: string;
}

export interface TimelineEra {
  id: string;
  label: string;
  startYear: number;
  endYear: number;
}

export interface ReligionData {
  meta: {
    version: string;
    description: string;
  };
  timelineEras: TimelineEra[];
  traditions: Tradition[];
  connections: Connection[];
  syncreticNodes: SyncreticNode[];
  scholarlyFrameworks: ScholarlyFramework[];
  theologicalTypeDefinitions: Record<string, string>;
}

export interface FigureConnection {
  to: string;
  type: string;
  detail: string;
}

export interface SharedFigure {
  id: string;
  name: string;
  type: 'deity' | 'prophet' | 'patriarch' | 'sage' | 'hero' | 'angel' | 'demon' | 'saint';
  date: string;
  dateLabel?: string;
  traditions: string[];
  roles: Record<string, string>;
  aliases: string[];
  connections: FigureConnection[];
}

export interface GraphNode {
  id: string;
  x: number;
  y: number;
  z: number;
  tradition: Tradition;
  color: string;
  radius: number;
  visible: boolean;
}

export interface GraphLink {
  source: string;
  target: string;
  connection: Connection;
}
