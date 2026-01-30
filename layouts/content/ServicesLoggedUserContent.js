'use client'

import ContentHeader from '@components/ContentHeader'
import { getNounServicesUsers } from '@helpers/getNoun'
import ServicesUsersList from '@layouts/lists/ServicesUsersList'
import asyncServicesUsersByUserIdSelector from '@state/async/asyncServicesUsersByUserIdSelector'
import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'
import { useMemo } from 'react'
import { useAtomValue } from 'jotai'

const ServicesLoggedUserContent = () => {
  const loggedUserActive = useAtomValue(loggedUserActiveAtom)
  const servicesLoggedUser = useAtomValue(
    asyncServicesUsersByUserIdSelector(loggedUserActive._id)
  )
  const servicesWithUser = useMemo(
    () =>
      servicesLoggedUser.map((serviceUser) => ({
        ...serviceUser,
        user: loggedUserActive,
      })),
    [servicesLoggedUser, loggedUserActive]
  )

  // const [isSearching, setIsSearching] = useState(false)
  // const [searchText, setSearchText] = useState('')

  return (
    <>
      <ContentHeader>
        <div className="flex items-center justify-end flex-1 flex-nowrap gap-x-2">
          <div className="text-lg font-bold whitespace-nowrap">
            {getNounServicesUsers(servicesLoggedUser.length)}
          </div>
          {/* <SearchToggleButton
            value={isSearching}
            onChange={() => {
              setIsSearching((state) => !state)
              if (isSearching) setSearchText('')
            }}
          /> */}
        </div>
      </ContentHeader>
      {/* <Search
        searchText={searchText}
        show={isSearching}
        onChange={setSearchText}
        className="mx-1 bg-gray-100"
      /> */}
      <ServicesUsersList servicesUsers={servicesWithUser} showUser={false} />
    </>
  )
}

export default ServicesLoggedUserContent
