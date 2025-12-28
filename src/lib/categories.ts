export type Category =
  | 'aaa'
  | 'indie'
  | 'esports'
  | 'moba'
  | 'fps'
  | 'mmorpg'
  | 'rpg'
  | 'nintendo'
  | 'playstation'
  | 'xbox'
  | 'pc'
  | 'mobile'
  | 'battle-royale'
  | 'survival'
  | 'vr'
  | 'retro'
  | 'industry'
  | 'hardware'
  | 'streaming'
  | 'general'

export const categoryConfig: Record<Category, { label: string; color: string; bgLight: string; icon: string }> = {
  // Éditeurs
  aaa: { label: 'AAA', color: '#dc2626', bgLight: '#fef2f2', icon: '🏢' },
  indie: { label: 'Indie', color: '#f59e0b', bgLight: '#fffbeb', icon: '🎨' },

  // Compétitif
  esports: { label: 'Esports', color: '#8b5cf6', bgLight: '#faf5ff', icon: '🏆' },

  // Genres
  moba: { label: 'MOBA', color: '#06b6d4', bgLight: '#ecfeff', icon: '⚔️' },
  fps: { label: 'FPS', color: '#ef4444', bgLight: '#fef2f2', icon: '🎯' },
  mmorpg: { label: 'MMORPG', color: '#6366f1', bgLight: '#eef2ff', icon: '🐉' },
  rpg: { label: 'RPG', color: '#a855f7', bgLight: '#faf5ff', icon: '⚗️' },
  'battle-royale': { label: 'Battle Royale', color: '#f97316', bgLight: '#fff7ed', icon: '🪂' },
  survival: { label: 'Survival', color: '#84cc16', bgLight: '#f7fee7', icon: '🏕️' },

  // Plateformes
  nintendo: { label: 'Nintendo', color: '#e11d48', bgLight: '#fef2f2', icon: '🍄' },
  playstation: { label: 'PlayStation', color: '#2563eb', bgLight: '#eff6ff', icon: '🎮' },
  xbox: { label: 'Xbox', color: '#22c55e', bgLight: '#f0fdf4', icon: '🟢' },
  pc: { label: 'PC', color: '#475569', bgLight: '#f8fafc', icon: '🖥️' },
  mobile: { label: 'Mobile', color: '#ec4899', bgLight: '#fdf2f8', icon: '📱' },
  vr: { label: 'VR', color: '#7c3aed', bgLight: '#f5f3ff', icon: '🥽' },

  // Autres thématiques
  retro: { label: 'Retro', color: '#ca8a04', bgLight: '#fefce8', icon: '👾' },
  industry: { label: 'Industry', color: '#64748b', bgLight: '#f8fafc', icon: '📊' },
  hardware: { label: 'Hardware', color: '#0891b2', bgLight: '#ecfeff', icon: '🔧' },
  streaming: { label: 'Streaming', color: '#9333ea', bgLight: '#faf5ff', icon: '📺' },

  // Fallback
  general: { label: 'Gaming', color: '#71717a', bgLight: '#f4f4f5', icon: '🎲' },
}

export const allCategories: Category[] = [
  'aaa',
  'indie',
  'esports',
  'moba',
  'fps',
  'mmorpg',
  'rpg',
  'nintendo',
  'playstation',
  'xbox',
  'pc',
  'mobile',
  'battle-royale',
  'survival',
  'vr',
  'retro',
  'industry',
  'hardware',
  'streaming',
  'general',
]