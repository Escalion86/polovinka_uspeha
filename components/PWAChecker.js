'use client'

import isPWAAtom from '@state/atoms/isPWAAtom'
import { useEffect } from 'react'
import { useSetAtom } from 'jotai'

const PWAChecker = ({ children }) => {
  const setIsPWA = useSetAtom(isPWAAtom)

  useEffect(() => {
    window
      .matchMedia('(display-mode: standalone)')
      .addEventListener('change', ({ matches }) => setIsPWA(matches))
    setIsPWA(window.matchMedia('(display-mode: standalone)').matches)
    // setInterval(() => {
    //   const test = window.matchMedia('(display-mode: standalone)').matches
    //   console.log('test :>> ', test)
    // }, 1000)
  }, [])

  return children
}

export default PWAChecker
