'use client'

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
import modalsFuncAtom from '@state/modalsFuncAtom'
import usersAtomAsync from '@state/async/usersAtomAsync'
import isLoggedUserAdminSelector from '@state/selectors/isLoggedUserAdminSelector'
import isLoggedUserDevSelector from '@state/selectors/isLoggedUserDevSelector'
import loggedUserActiveRoleSelector from '@state/selectors/loggedUserActiveRoleSelector'
import { useMemo, useState } from 'react'
import { useAtomValue } from 'jotai'
import birthDateToAge from '@helpers/birthDateToAge'

const UsersContent = () => {
  const modalsFunc = useAtomValue(modalsFuncAtom)
  const users = useAtomValue(usersAtomAsync)

  // const notCanceledAndFinishedEventsUsers = useAtomValue(
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

  const loggedUserActiveRole = useAtomValue(loggedUserActiveRoleSelector)
  const isLoggedUserDev = useAtomValue(isLoggedUserDevSelector)
  const isLoggedUserAdmin = useAtomValue(isLoggedUserAdminSelector)
  const seeAllContacts = loggedUserActiveRole?.users?.seeAllContacts
  const seeBirthday = loggedUserActiveRole?.users?.seeBirthday
  const addButton = loggedUserActiveRole?.users?.add

  const [isSearching, setIsSearching] = useState(false)
  const [searchText, setSearchText] = useState('')

  const [sort, setSort] = useState({ name: 'asc' })
  const sortFunc = useMemo(() => sortFuncGenerator(sort), [sort])

  const usersWithAges = useMemo(
    () =>
      users.map((user) => ({
        ...user,
        age: birthDateToAge(user.birthday, new Date(), false),
      })),
    [users]
  )

  const minMaxAges = useMemo(
    () =>
      usersWithAges.reduce(
        (acc, user) => ({
          min: user.age < acc.min ? user.age : acc.min,
          max: user.age > acc.max ? user.age : acc.max,
        }),
        { min: 70, max: 18 }
      ),
    [usersWithAges]
  )

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
    ...(seeBirthday
      ? { ages: { min: minMaxAges?.min || 18, max: minMaxAges?.max || 70 } }
      : {}),
  })

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
      usersWithAges.filter(
        (user) =>
          user &&
          (filter.gender[String(user.gender)] ||
            (filter.gender.null &&
              user.gender !== 'male' &&
              user.gender !== 'famale')) &&
          filter.status[user?.status ?? 'novice'] &&
          (user.relationship
            ? filter.relationship.havePartner
            : filter.relationship.noPartner) &&
          (!filter.ages ||
            user.age === undefined ||
            (user.age >= (filter.ages.min || 18) &&
              user.age <= (filter.ages.max || 70)))
      ),
    [
      // updatedUsers,
      usersWithAges,
      filter,
    ]
  )

  const addSearchProps = seeAllContacts
    ? ['phone', 'whatsapp', 'viber', 'instagram', 'telegram', 'vk', 'email']
    : []
  const addDevSearchProps = isLoggedUserDev ? ['_id'] : []

  const visibleUsers = useMemo(() => {
    if (!isSearching || !searchText) return filteredUsers
    return filterItems(filteredUsers, searchText, [], {}, [
      'firstName',
      'secondName',
      'thirdName',
      ...addSearchProps,
      ...addDevSearchProps,
    ])
  }, [filteredUsers, searchText, isSearching])

  return (
    <>
      <ContentHeader>
        <UsersFilter
          value={filter}
          onChange={setFilter}
          minMaxAges={minMaxAges}
        />
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
              ...(isLoggedUserAdmin ? ['signedUpEventsCount'] : []),
              // 'eventsUserCount'
            ]}
          />
          <SearchToggleButton
            value={isSearching}
            onChange={() => {
              setIsSearching((state) => !state)
              // if (isSearching) setSearchText('')
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
