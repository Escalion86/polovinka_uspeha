import { atom } from 'jotai'

import windowDimensionsAtom from '@state/atoms/windowDimensionsAtom'

const windowDimensionsNumSelector = atom((get) => {
  const { width } = get(windowDimensionsAtom)
  if (!width) return 0
  if (width < 480) return 1
  if (width < 640) return 2
  if (width < 960) return 3
  if (width < 1200) return 4
  return 5
})

export default windowDimensionsNumSelector
