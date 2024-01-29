import ContentHeader from '@components/ContentHeader'
import Filter from '@components/Filter'
import UsersFilter from '@components/Filter/UsersFilter'
import AddButton from '@components/IconToggleButtons/AddButton'
import FilterToggleButton from '@components/IconToggleButtons/FilterToggleButton'
import SearchToggleButton from '@components/IconToggleButtons/SearchToggleButton'
import ServiceStatusToggleButtons from '@components/IconToggleButtons/ServiceStatusToggleButtons'
import Search from '@components/Search'
import SortingButtonMenu from '@components/SortingButtonMenu'
import filterItems from '@helpers/filterItems'
import { getNounServicesUsers } from '@helpers/getNoun'
import sortFuncGenerator from '@helpers/sortFuncGenerator'
import ServicesUsersList from '@layouts/lists/ServicesUsersList'
import { modalsFuncAtom } from '@state/atoms'
import servicesUsersAtom from '@state/atoms/servicesUsersAtom'
import usersAtom from '@state/atoms/usersAtom'
import loggedUserActiveRoleSelector from '@state/selectors/loggedUserActiveRoleSelector'
import { useMemo, useState } from 'react'
import { useRecoilValue } from 'recoil'

const defaultFilterValue = {
  services: null,
}

const ServicesUsersContent = () => {
  const modalsFunc = useRecoilValue(modalsFuncAtom)
  const servicesUsers = useRecoilValue(servicesUsersAtom)
  const users = useRecoilValue(usersAtom)
  const loggedUserActiveRole = useRecoilValue(loggedUserActiveRoleSelector)
  const addButton = loggedUserActiveRole?.servicesUsers?.add

  const [filterOptions, setFilterOptions] = useState(defaultFilterValue)

  const [filter, setFilter] = useState({
    gender: {
      male: true,
      famale: true,
      // null: true,
    },
  })

  const [filterService, setFilterService] = useState({
    status: {
      active: true,
      closed: false,
      canceled: false,
    },
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
  const [showFilter, setShowFilter] = useState(false)

  const [searchText, setSearchText] = useState('')

  const [sort, setSort] = useState({ createdAt: 'asc' })
  const sortFunc = useMemo(() => sortFuncGenerator(sort), [sort])

  const filteredServicesUsers = useMemo(
    () =>
      updatedServicesUsers.filter(
        (serviceUser) =>
          filter.gender[serviceUser.user.gender] &&
          (serviceUser.status
            ? filterService.status[serviceUser.status]
            : filterService.status.active) &&
          (!filterOptions.services ||
            filterOptions.services === serviceUser.serviceId)
      ),
    [filter, filterService, updatedServicesUsers, filterOptions]
  )

  const visibleServicesUsers = useMemo(() => {
    if (!searchText) return filteredServicesUsers
    return filterItems(
      filteredServicesUsers,
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

  const filteredAndSortedServicesUsers = useMemo(
    () => [...visibleServicesUsers].sort(sortFunc),
    [visibleServicesUsers, sort]
  )

  const isFiltered = filterOptions.services

  return (
    <>
      <ContentHeader>
        <UsersFilter value={filter} onChange={setFilter} hideNullGender />
        <ServiceStatusToggleButtons
          value={filterService.status}
          onChange={(value) =>
            setFilterService((state) => ({ ...state, status: value }))
          }
        />
        <div className="flex items-center justify-end flex-1 flex-nowrap gap-x-2">
          <div className="text-lg font-bold whitespace-nowrap">
            {getNounServicesUsers(filteredAndSortedServicesUsers.length)}
          </div>
          <SortingButtonMenu
            sort={sort}
            onChange={setSort}
            sortKeys={['createdAt']}
          />
          <FilterToggleButton
            value={isFiltered}
            onChange={() => {
              setShowFilter((state) => !state)
            }}
          />
          <SearchToggleButton
            value={isSearching}
            onChange={() => {
              setIsSearching((state) => !state)
              if (isSearching) setSearchText('')
            }}
          />
          {addButton && (
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
      <Filter
        show={showFilter}
        onChange={setFilterOptions}
        filterOptions={filterOptions}
        defaultFilterValue={defaultFilterValue}
        setShowFilter={setShowFilter}
      />
      <ServicesUsersList servicesUsers={filteredAndSortedServicesUsers} />
    </>
  )
}

export default ServicesUsersContent
