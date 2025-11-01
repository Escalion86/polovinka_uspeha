'use client'

import ContactsBlock from '@blocks/ContactsBlock'
import EventsBlock from '@blocks/EventsBlock'
import FooterBlock from '@blocks/FooterBlock'
import FabMenu from '@components/FabMenu'
import StateLoader from '@components/StateLoader'
import Header from '@layouts/Header'
import isPWAAtom from '@state/atoms/isPWAAtom'
import loggedUserActiveRoleSelector from '@state/selectors/loggedUserActiveRoleSelector'
import locationAtom from '@state/atoms/locationAtom'
import useRouter from '@utils/useRouter'
import { useAtom, useAtomValue } from 'jotai'
import { useEffect, useMemo } from 'react'

function LocationEventsClient(props) {
  const [locationState, setLocationState] = useAtom(locationAtom)
  const loggedUserActiveRole = useAtomValue(loggedUserActiveRoleSelector)
  const hideFab = loggedUserActiveRole?.hideFab
  const isPWA = useAtomValue(isPWAAtom)
  const router = useRouter()

  const query = useMemo(() => {
    const newQuery = { ...router.query }
    delete newQuery.location
    return newQuery
  }, [router])

  const { location } = props

  useEffect(() => setLocationState(location), [location, setLocationState])

  if (isPWA) {
    router.push(
      {
        pathname: `/${location}/login`,
        query,
      },
      undefined,
      { shallow: true }
    )
    return null
  }

  if (!locationState) return null

  return (
    <StateLoader {...props}>
      <Header />
      <EventsBlock />
      <ContactsBlock />
      <FooterBlock />
      <FabMenu show={!hideFab} />
    </StateLoader>
  )
}

export default LocationEventsClient
