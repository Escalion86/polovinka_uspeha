'use client'

import { atom } from 'jotai'

import windowDimensionsAtom from '@state/atoms/windowDimensionsAtom'

const windowDimensionsTailwindSelector = atom((get) => {
  const { width } = get(windowDimensionsAtom)
  if (!width) return null
  if (width < 480) return 'phoneV'
  if (width < 640) return 'phoneH'
  if (width < 960) return 'tablet'
  if (width < 1200) return 'laptop'
  return 'desktop'
})

export default windowDimensionsTailwindSelector
