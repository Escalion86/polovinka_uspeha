import { modalsFuncAtom } from '@state/atoms'
import { useRecoilValue } from 'recoil'
import loggedUserAtom from '@state/atoms/loggedUserAtom'

import { useMemo, useState } from 'react'

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
import usersAtom from '@state/atoms/usersAtom'
import filterItems from '@helpers/filterItems'
import UsersFilter from '@components/Filter/UsersFilter'

const ServicesUsersContent = () => {
  const servicesUsers = useRecoilValue(servicesUsersAtom)
  const users = useRecoilValue(usersAtom)
  const isLoggedUserModer = useRecoilValue(isLoggedUserModerSelector)
  const modalsFunc = useRecoilValue(modalsFuncAtom)

  const [filter, setFilter] = useState({
    gender: {
      male: true,
      famale: true,
      // null: true,
    },
    // status: {
    //   novice: true,
    //   member: true,
    // },
  })

  // const usersIds = servicesUsers.map((serviceUser) => serviceUser.userId)
  // const usersWithServices = users.filter((user) => usersIds.includes(user._id))

  const updatedServicesUsers = useMemo(
    () =>
      servicesUsers.map((servicesUser) => {
        const user = users.find((user) => user._id === servicesUser.userId)
        return { ...servicesUser, user }
      }),
    [servicesUsers, users]
  )

  const [isSearching, setIsSearching] = useState(false)
  // const [sort, setSort] = useState({ dateStart: 'asc' })
  // const [showFilter, setShowFilter] = useState(false)

  const [searchText, setSearchText] = useState('')

  // const sortKey = Object.keys(sort)[0]
  // const sortValue = sort[sortKey]
  // const sortFunc = sortFunctions[sortKey]
  //   ? sortFunctions[sortKey][sortValue]
  //   : undefined

  const filteredServicesUsers = useMemo(
    () =>
      updatedServicesUsers.filter(
        (serviceUser) => filter.gender[serviceUser.user.gender]
      ),
    [filter, updatedServicesUsers]
  )

  const visibleServicesUsers = useMemo(() => {
    if (!searchText) return filteredServicesUsers
    return filterItems(
      filteredServicesUsers.filter(),
      searchText,
      [],
      {},
      [
        'firstName',
        'secondName',
        'thirdName',
        'phone',
        'whatsapp',
        'viber',
        'instagram',
        'telegram',
        'vk',
        'email',
      ],
      'user'
    )
  }, [filteredServicesUsers, searchText])

  return (
    <>
      <ContentHeader>
        <UsersFilter value={filter} onChange={setFilter} hideNullGender />
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
      <ServicesUsersList servicesUsers={visibleServicesUsers} />
    </>
  )
}

export default ServicesUsersContent
