'use client'

import { atom } from 'jotai'

import getLocationProps from '@helpers/getLocationProps'
import locationAtom from '@state/atoms/locationAtom'

const locationPropsSelector = atom((get) => getLocationProps(get(locationAtom)))

export default locationPropsSelector
