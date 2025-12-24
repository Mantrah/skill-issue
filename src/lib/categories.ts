export type Category = 'nintendo' | 'ea' | 'ubisoft' | 'sony' | 'microsoft' | 'general'

export const categoryConfig: Record<Category, { label: string; color: string; bgLight: string; icon: string }> = {
  nintendo: { label: 'Nintendo', color: '#e11d48', bgLight: '#fef2f2', icon: '🎮' },
  ea: { label: 'EA Sports', color: '#0ea5e9', bgLight: '#f0f9ff', icon: '⚽' },
  ubisoft: { label: 'Ubisoft', color: '#8b5cf6', bgLight: '#faf5ff', icon: '🗡️' },
  sony: { label: 'PlayStation', color: '#2563eb', bgLight: '#eff6ff', icon: '🎯' },
  microsoft: { label: 'Xbox', color: '#22c55e', bgLight: '#f0fdf4', icon: '🎲' },
  general: { label: 'Gaming', color: '#71717a', bgLight: '#f4f4f5', icon: '👾' },
}

export const allCategories: Category[] = ['nintendo', 'ea', 'ubisoft', 'sony', 'microsoft', 'general']
