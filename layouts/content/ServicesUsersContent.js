import { modalsFuncAtom } from '@state/atoms'
import { useRecoilValue } from 'recoil'
import loggedUserAtom from '@state/atoms/loggedUserAtom'

import { useState } from 'react'

import { getNounServicesUsers } from '@helpers/getNoun'
import isLoggedUserModerSelector from '@state/selectors/isLoggedUserModerSelector'
import loggedUserActiveStatusAtom from '@state/atoms/loggedUserActiveStatusAtom'
import ContentHeader from '@components/ContentHeader'
import sortFunctions from '@helpers/sortFunctions'
import AddButton from '@components/IconToggleButtons/AddButton'

import SearchToggleButton from '@components/IconToggleButtons/SearchToggleButton'
import Search from '@components/Search'
import servicesUsersAtom from '@state/atoms/servicesUsersAtom'
import ServicesUsersList from '@layouts/lists/ServicesUsersList'

const ServicesUsersContent = () => {
  const servicesUsers = useRecoilValue(servicesUsersAtom)
  const isLoggedUserModer = useRecoilValue(isLoggedUserModerSelector)
  const modalsFunc = useRecoilValue(modalsFuncAtom)

  const [isSearching, setIsSearching] = useState(false)
  // const [sort, setSort] = useState({ dateStart: 'asc' })
  // const [showFilter, setShowFilter] = useState(false)
  // const [filter, setFilter] = useState({
  //   status: {
  //     active: true,
  //     finished: false,
  //     closed: false,
  //     canceled: false,
  //   },
  //   participant: {
  //     participant: true,
  //     notParticipant: true,
  //   },
  // })
  const [searchText, setSearchText] = useState('')

  // const sortKey = Object.keys(sort)[0]
  // const sortValue = sort[sortKey]
  // const sortFunc = sortFunctions[sortKey]
  //   ? sortFunctions[sortKey][sortValue]
  //   : undefined

  return (
    <>
      <ContentHeader>
        <div className="flex items-center justify-end flex-1 flex-nowrap gap-x-2">
          <div className="text-lg font-bold whitespace-nowrap">
            {getNounServicesUsers(servicesUsers.length)}
          </div>
          <SearchToggleButton
            value={isSearching}
            onChange={() => {
              setIsSearching((state) => !state)
              if (isSearching) setSearchText('')
            }}
          />
          {isLoggedUserModer && (
            <AddButton onClick={() => modalsFunc.serviceUser.add()} />
          )}
        </div>
      </ContentHeader>
      <Search
        searchText={searchText}
        show={isSearching}
        onChange={setSearchText}
        className="mx-1 bg-gray-100"
      />
      {/* <Filter show={showFilter} options={options} onChange={setFilterOptions} /> */}
      {/* <CardListWrapper> */}
      <ServicesUsersList servicesUsers={servicesUsers} />
    </>
  )
}

export default ServicesUsersContent
