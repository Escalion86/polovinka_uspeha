'use client'

let navigationRuntime = null

const createFallbackRuntime = () => ({
  push: () => {},
  replace: () => {},
  prefetch: () => Promise.resolve(),
  pathname: '',
  asPath: '',
  query: {},
})

export const setNavigationRuntime = (router) => {
  navigationRuntime = router ?? null
}

export const getNavigationRuntime = () =>
  navigationRuntime ?? createFallbackRuntime()

