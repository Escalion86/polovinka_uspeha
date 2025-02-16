'use client'

import { atom } from 'jotai'

import loggedUserActiveRoleNameAtom from '@state/atoms/loggedUserActiveRoleNameAtom'
import isUserPresident from '@helpers/isUserPresident'

const isLoggedUserPresidentSelector = atom((get) =>
  isUserPresident(get(loggedUserActiveRoleNameAtom))
)

export default isLoggedUserPresidentSelector
