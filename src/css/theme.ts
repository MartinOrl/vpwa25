const DEFAULT_SPACING = 4

export const palette = {
  primary: '#0b192c',
  secondary: '#1e3e62',
  accent: '#EB8317',
  background: '#1E201E',
  textOnPrimary: '#ffffff',
  error: '#ff0033',
  border: 'rgba(255, 255, 255, 0.1)',
  textOpaque: 'rgba(255, 255, 255, 0.4)',
}

export const spacing = (mult: number) => `${DEFAULT_SPACING * mult}px`

export const containers = {
  login: '460px',
  sidebar: '240px',
}
