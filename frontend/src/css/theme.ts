const DEFAULT_SPACING = 4

export const palette = {
  primary: '#121212',
  secondary: '#1f1f1f',
  accent: '#9c27b0',
  mention: '#FF8000',
  mentionBackground: 'rgba(255, 128, 0, 0.1)',
  link: '#00BCD4',
  background: '#1f1f1f',
  textOnPrimary: '#e0e0e0',
  error: '#ff0033',
  border: 'rgba(255, 255, 255, 0.1)',
  textOpaque: 'rgba(255, 255, 255, 0.4)',
  backgroundWhiteOpaque: 'rgba(255, 255, 255, 0.1)',
  warning: '#806000',
  status: {
    ONLINE: '#76ff03',
    OFFLINE: '#3C3D37',
    DO_NOT_DISTURB: '#ff0000',
  },
}

export const spacing = (mult: number) => `${DEFAULT_SPACING * mult}px`

export const containers = {
  login: '460px',
  sidebar: '240px',
  utils: '80px',
  search: '640px',
}
