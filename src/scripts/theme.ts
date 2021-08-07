export const DEFAULT_THEME = 'auto-theme'
export const THEME_LIST = [
  DEFAULT_THEME,
  'sonokai-andromeda-theme',
  'sonokai-default-theme',
  'sonokai-shusia-theme',
  'sonokai-atlantis-theme',
  'sonokai-espresso-theme',
  'nord-dark-theme'
]

export function setTheme(current: string, theme: string): void {
  if (!document.body.classList.contains(theme)) {
    document.body.classList.remove('auto-theme')
    document.body.classList.remove(current)
    document.body.classList.add(theme)
  }
}
