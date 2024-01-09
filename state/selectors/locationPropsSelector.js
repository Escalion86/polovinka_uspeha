import getLocationProps from '@helpers/getLocationProps'
import { selector } from 'recoil'

export const locationPropsSelector = selector({
  key: 'locationPropsSelector',
  get: ({ get }) => getLocationProps(get(locationAtom)),
})

export default locationPropsSelector
