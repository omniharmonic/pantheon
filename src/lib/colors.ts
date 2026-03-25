const THEOLOGY_COLORS: Record<string, string> = {
  polytheism: '#e89c30',
  henotheism: '#d4a843',
  monolatry: '#c4a050',
  monotheism: '#4a90d9',
  dualism: '#d94a6e',
  pantheism: '#5bb57a',
  panentheism: '#4aad8b',
  monism: '#3d9e7a',
  nontheism: '#6bc48a',
  animism: '#9b6bd4',
  shamanism: '#b07ad4',
  ancestor_worship: '#8e62c4',
  philosophical_religion: '#6bc4b0',
  divine_kingship: '#d4b44a',
  sky_worship: '#7ab0e0',
  cosmic_state_theology: '#c4a060',
  ethical_religion: '#4a90d9',
  state_religion: '#d4904a',
  syncretism: '#d4d44a',
  ritualism: '#c48a5a',
  storm_god_theology: '#7a8ac4',
  druidic_priesthood: '#5aa06a',
  national_god_theology: '#c4804a',
  astral_theology: '#7a6ac4',
  imperial_cult: '#c46a4a',
};

const DEFAULT_COLOR = '#8899aa';

export function getTheologyColor(types: string[]): string {
  const primary = types.find(
    (t) =>
      t === 'monotheism' ||
      t === 'polytheism' ||
      t === 'nontheism' ||
      t === 'dualism' ||
      t === 'animism' ||
      t === 'monism'
  );
  if (primary && THEOLOGY_COLORS[primary]) return THEOLOGY_COLORS[primary];
  for (const t of types) {
    if (THEOLOGY_COLORS[t]) return THEOLOGY_COLORS[t];
  }
  return DEFAULT_COLOR;
}

export const CONNECTION_COLORS: Record<string, string> = {
  parent_child: '#ffffff',
  influence: '#66aaff',
  syncretism: '#ffaa44',
  parent_reaction: '#ff6688',
};

export const STATUS_OPACITY: Record<string, number> = {
  active: 1.0,
  active_minority: 0.85,
  extinct: 0.4,
  extinct_absorbed: 0.45,
  extinct_revived: 0.7,
  evolved_into_hinduism: 0.5,
};

export const FIGURE_TYPE_COLORS: Record<string, string> = {
  deity: '#e8a030',
  prophet: '#4a90d9',
  patriarch: '#3db57a',
  sage: '#3da08b',
  hero: '#d94a4a',
  angel: '#5abbd9',
  demon: '#9b4ad4',
  saint: '#d4c44a',
};

export const FIGURE_CONNECTION_COLORS: Record<string, string> = {
  cognate: '#e8a030',
  same_figure: '#4ad94a',
  equivalent: '#4a90d9',
  evolved_from: '#3dc4c4',
  syncretized_with: '#e87830',
  influenced: '#9b6bd4',
  absorbed_into: '#d96aa0',
  demonized_as: '#d94444',
  prefiguration: '#5abbd9',
  spiritual_lineage: '#3db57a',
  prophetic_parallel: '#6a6ad9',
  parent: '#4ad94a',
  child: '#4ad94a',
  consort: '#d96aa0',
  sibling: '#d4c44a',
  adversary: '#d94444',
  mythological_parallel: '#9b4ad4',
  artistic_identification: '#e8a030',
  cultural_adaptation: '#3da08b',
};

export { THEOLOGY_COLORS };
