'use client'

import { signOut } from 'next-auth/react'
import { useEffect } from 'react'

export default function SignOut({ callbackUrl }) {
  useEffect(() => {
    signOut({ redirect: !callbackUrl ? false : true, callbackUrl })
  }, [])

  return null
}
