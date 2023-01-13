import windowDimensionsAtom from '@state/atoms/windowDimensionsAtom'
import { selector } from 'recoil'

const windowDimensionsTailwindSelector = selector({
  key: 'windowDimensionsTailwindSelector',
  get: ({ get }) => {
    const { width } = get(windowDimensionsAtom)
    if (!width) return null
    if (width < 480) return 'phoneV'
    if (width < 640) return 'phoneH'
    if (width < 960) return 'tablet'
    if (width < 1200) return 'laptop'
    return 'desktop'
  },
})

export default windowDimensionsTailwindSelector
