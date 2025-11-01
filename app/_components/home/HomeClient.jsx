'use client'

import AboutBlock from '@blocks/AboutBlock'
import ContactsBlock from '@blocks/ContactsBlock'
import DirectionsBlock from '@blocks/DirectionsBlock'
import FooterBlock from '@blocks/FooterBlock'
import ReviewsBlock from '@blocks/ReviewsBlock'
import TitleBlock from '@blocks/TitleBlock'
import FabMenu from '@components/FabMenu'
import StateLoader from '@components/StateLoader'
import Header from '@layouts/Header'
import isPWAAtom from '@state/atoms/isPWAAtom'
import useRouter from '@utils/useRouter'
import { useAtomValue } from 'jotai'

function HomeClient(props) {
  const isPWA = useAtomValue(isPWAAtom)
  const router = useRouter()

  if (isPWA) {
    router.push({ pathname: '/krsk/login' })
    return null
  }

  return (
    <StateLoader className="max-h-screen" {...props}>
      <Header short />
      <TitleBlock />
      <AboutBlock />
      <DirectionsBlock />
      <ReviewsBlock />
      <ContactsBlock />
      <FooterBlock />
      <FabMenu show />
    </StateLoader>
  )
}

export default HomeClient
