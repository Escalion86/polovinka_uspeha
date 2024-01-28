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
import loggedUserActiveRoleSelector from '@state/selectors/loggedUserActiveRoleSelector'
import membersSelector from '@state/selectors/membersSelector'
import { useMemo, useState } from 'react'
import { useRecoilValue } from 'recoil'

const MembersContent = () => {
  const modalsFunc = useRecoilValue(modalsFuncAtom)
  const members = useRecoilValue(membersSelector)
  const loggedUserActiveRole = useRecoilValue(loggedUserActiveRoleSelector)
  const addButton = loggedUserActiveRole?.users?.add
  const seeFullNames = loggedUserActiveRole?.users?.seeFullNames

  const [isSearching, setIsSearching] = useState(false)

  const [filter, setFilter] = useState({
    gender: {
      male: true,
      famale: true,
      // null: false,
    },
    // status: {
    //   novice: true,
    //   member: true,
    // },
    relationship: {
      havePartner: true,
      noPartner: true,
    },
  })
  const [searchText, setSearchText] = useState('')

  const [sort, setSort] = useState({ name: 'asc' })
  const sortFunc = useMemo(() => sortFuncGenerator(sort), [sort])

  const filteredUsers = useMemo(() => {
    const filteredMembers = members.filter(
      (user) =>
        filter.gender[String(user.gender)] &&
        (user.relationship
          ? filter.relationship.havePartner
          : filter.relationship.noPartner)
    )

    if (seeFullNames) return filteredMembers

    return filteredMembers.map((user) => {
      return {
        ...user,
        secondName: user.secondName
          ? user.security?.fullSecondName
            ? user.secondName
            : user.secondName[0].toUpperCase() + '.'
          : '',
        thirdName: user.thirdName
          ? user.security?.fullThirdName
            ? user.thirdName
            : user.thirdName[0].toUpperCase() + '.'
          : '',
      }
    })
  }, [members, filter, seeFullNames])

  const visibleUsers = useMemo(() => {
    if (!searchText) return filteredUsers
    return filterItems(filteredUsers, searchText, [], {}, [
      'firstName',
      'secondName',
      'thirdName',
    ])
  }, [filteredUsers, searchText])

  return (
    <>
      <ContentHeader>
        <UsersFilter value={filter} onChange={setFilter} hideNullGender />
        <div className="flex items-center justify-end flex-1 flex-nowrap gap-x-2">
          <div className="text-lg font-bold whitespace-nowrap">
            {getNounUsers(visibleUsers.length)}
          </div>
          <SortingButtonMenu
            sort={sort}
            onChange={setSort}
            sortKeys={['name', 'createdAt']}
          />
          <SearchToggleButton
            value={isSearching}
            onChange={() => {
              setIsSearching((state) => !state)
              if (isSearching) setSearchText('')
            }}
          />
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

export default MembersContent
