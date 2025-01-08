import { atom } from 'jotai'

import getLocationProps from '@helpers/getLocationProps'
import locationAtom from '@state/jotai/atoms/locationAtom'

export const locationPropsSelector = atom((get) =>
  getLocationProps(get(locationAtom))
)

export default locationPropsSelector
