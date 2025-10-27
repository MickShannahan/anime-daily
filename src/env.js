const _isBrowser = (typeof window !== 'undefined' && window.location && typeof window.location.origin === 'string')
export const dev = _isBrowser ? window.location.origin.includes('localhost') : (process.env.NODE_ENV === 'development')
export const baseURL = dev ? 'http://localhost:3000' : ''
export const MALURL = 'https://api.myanimelist.net/v2'
export const useSockets = false
export const domain = ''
export const clientId = ''
export const audience = ''
