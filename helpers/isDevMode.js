const isDevMode =
  typeof window !== 'undefined' &&
  (window?.location.href.includes('dev.') ||
    window?.location.href.includes('localhost'))

export default isDevMode
