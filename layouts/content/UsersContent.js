import ContentHeader from '@components/ContentHeader'
import UsersFilter from '@components/Filter/UsersFilter'
import AddButton from '@components/IconToggleButtons/AddButton'
import SearchToggleButton from '@components/IconToggleButtons/SearchToggleButton'
import Search from '@components/Search'
import SortingButtonMenu from '@components/SortingButtonMenu'
import filterItems from '@helpers/filterItems'
import { getNounUsers } from '@helpers/getNoun'
import sortFuncGenerator from '@helpers/sortFuncGenerator'
import UsersList from '@layouts/lists/UsersList'
import { modalsFuncAtom } from '@state/atoms'
import usersAtom from '@state/atoms/usersAtom'
import loggedUserActiveRoleSelector from '@state/selectors/loggedUserActiveRoleSelector'
import { useMemo, useState } from 'react'
import { useRecoilValue } from 'recoil'

const UsersContent = () => {
  const modalsFunc = useRecoilValue(modalsFuncAtom)
  const users = useRecoilValue(usersAtom)

  // const notCanceledAndFinishedEventsUsers = useRecoilValue(
  //   eventsUsersNotCanceledAndFinishedSelector
  // )

  // const updatedUsers = useMemo(
  //   () =>
  //     users.map((user) => {
  //       const eventsUser = notCanceledAndFinishedEventsUsers.filter(
  //         ({ userId, status }) =>
  //           user._id === userId && status !== 'ban' && status !== 'reserve'
  //       )
  //       return { ...user, eventsUserCount: eventsUser.length }
  //     }),
  //   [users, notCanceledAndFinishedEventsUsers]
  // )

  const loggedUserActiveRole = useRecoilValue(loggedUserActiveRoleSelector)
  const seeAllContacts = loggedUserActiveRole?.users?.seeAllContacts
  const addButton = loggedUserActiveRole?.users?.add

  const [isSearching, setIsSearching] = useState(false)
  const [filter, setFilter] = useState({
    gender: {
      male: true,
      famale: true,
      null: true,
    },
    status: {
      novice: true,
      member: true,
    },
    relationship: {
      havePartner: true,
      noPartner: true,
    },
  })
  const [searchText, setSearchText] = useState('')

  const [sort, setSort] = useState({ name: 'asc' })
  const sortFunc = useMemo(() => sortFuncGenerator(sort), [sort])

  // const visibleUsersIds = useMemo(
  //   () =>
  //     users
  //       .filter(
  //         (user) =>
  //           filter.gender[String(user.gender)] &&
  //           filter.status[user.status ?? 'novice']
  //       )
  //       .map((user) => user._id),
  //   [users, filter]
  // )

  const filteredUsers = useMemo(
    () =>
      // updatedUsers
      users.filter(
        (user) =>
          user &&
          (filter.gender[String(user.gender)] ||
            (filter.gender.null &&
              user.gender !== 'male' &&
              user.gender !== 'famale')) &&
          filter.status[user?.status ?? 'novice'] &&
          (user.relationship
            ? filter.relationship.havePartner
            : filter.relationship.noPartner)
      ),
    [
      // updatedUsers,
      users,
      filter,
    ]
  )

  const addSearchProps = seeAllContacts
    ? ['phone', 'whatsapp', 'viber', 'instagram', 'telegram', 'vk', 'email']
    : []

  const visibleUsers = useMemo(() => {
    if (!searchText) return filteredUsers
    return filterItems(filteredUsers, searchText, [], {}, [
      'firstName',
      'secondName',
      'thirdName',
      ...addSearchProps,
    ])
  }, [filteredUsers, searchText])

  return (
    <>
      <ContentHeader>
        <UsersFilter value={filter} onChange={setFilter} />
        {/* // <GenderToggleButtons value={genderFilter} onChange={setGenderFilter} />
        // <StatusUserToggleButtons
        //   value={statusFilter}
        //   onChange={setStatusFilter}
        // /> */}
        <div className="flex items-center justify-end flex-1 flex-nowrap gap-x-2">
          <div className="text-lg font-bold whitespace-nowrap">
            {getNounUsers(visibleUsers.length)}
          </div>
          <SortingButtonMenu
            sort={sort}
            onChange={setSort}
            sortKeys={[
              'name',
              'birthday',
              'createdAt',
              // 'eventsUserCount'
            ]}
          />
          <SearchToggleButton
            value={isSearching}
            onChange={() => {
              setIsSearching((state) => !state)
              if (isSearching) setSearchText('')
            }}
          />
          {/* <FormControl size="small">
            <FilterToggleButton
              value={isFiltered}
              onChange={() => {
                setShowFilter((state) => !state)
              }}
            />
          </FormControl> */}
          {addButton && <AddButton onClick={() => modalsFunc.user.edit()} />}
        </div>
      </ContentHeader>
      <Search
        searchText={searchText}
        show={isSearching}
        onChange={setSearchText}
        className="mx-1 bg-gray-100"
      />
      {/* <Filter show={showFilter} options={options} onChange={setFilterOptions} /> */}
      <UsersList users={[...visibleUsers].sort(sortFunc)} />
    </>
  )
}

export default UsersContent
