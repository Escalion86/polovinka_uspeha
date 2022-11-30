import { modalsFuncAtom } from '@state/atoms'
import { useRecoilValue } from 'recoil'
// import Fab from '@components/Fab'
// import usersAtom from '@state/atoms/usersAtom'
import UserCard from '@layouts/cards/UserCard'
import CardListWrapper from '@layouts/wrappers/CardListWrapper'
import { getNounUsers } from '@helpers/getNoun'
import { useMemo, useState } from 'react'
import ContentHeader from '@components/ContentHeader'
import UsersFilter from '@components/Filter/UsersFilter'
import SortingButtonMenu from '@components/SortingButtonMenu'
import sortFunctions from '@helpers/sortFunctions'
import AddButton from '@components/IconToggleButtons/AddButton'
import isLoggedUserAdminSelector from '@state/selectors/isLoggedUserAdminSelector'
import membersSelector from '@state/selectors/membersSelector'

const MembersContent = () => {
  const modalsFunc = useRecoilValue(modalsFuncAtom)
  const members = useRecoilValue(membersSelector)
  const isLoggedUserAdmin = useRecoilValue(isLoggedUserAdminSelector)

  const [sort, setSort] = useState({ name: 'asc' })
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
  })
  // const [statusFilter, setStatusFilter] = useState({
  //   novice: true,
  //   member: true,
  // })

  const sortKey = Object.keys(sort)[0]
  const sortValue = sort[sortKey]
  const sortFunc = sortFunctions[sortKey]
    ? sortFunctions[sortKey][sortValue]
    : undefined

  const visibleUsersIds = useMemo(
    () =>
      members
        .filter(
          (user) => filter.gender[String(user.gender)]
          // && filter.status[user.status ?? 'novice']
        )
        .map((user) => user._id),
    [members, filter]
  )

  // const options = {
  //   genders: {
  //     type: 'genders',
  //     value: ['male', 'famale'],
  //     name: 'Пол',
  //     items: directions,
  //   },
  // }

  return (
    <>
      <ContentHeader>
        <UsersFilter value={filter} onChange={setFilter} hideNullGender />
        {/* // <GenderToggleButtons value={genderFilter} onChange={setGenderFilter} />
        // <StatusUserToggleButtons
        //   value={statusFilter}
        //   onChange={setStatusFilter}
        // /> */}
        <div className="flex items-center justify-end flex-1 flex-nowrap gap-x-2">
          <div className="text-lg font-bold whitespace-nowrap">
            {getNounUsers(visibleUsersIds.length)}
          </div>
          <SortingButtonMenu
            sort={sort}
            onChange={setSort}
            sortKeys={['name', 'createdAt']}
          />
          {/* <FormControl size="small">
            <FilterToggleButton
              value={isFiltered}
              onChange={() => {
                setShowFilter((state) => !state)
              }}
            />
          </FormControl> */}
          {isLoggedUserAdmin && (
            <AddButton onClick={() => modalsFunc.user.edit()} />
          )}
        </div>
      </ContentHeader>
      {/* <Filter show={showFilter} options={options} onChange={setFilterOptions} /> */}
      <CardListWrapper>
        {members?.length > 0 ? (
          [...members]
            .sort(sortFunc)
            .map((user) => (
              <UserCard
                key={user._id}
                userId={user._id}
                hidden={!visibleUsersIds.includes(user._id)}
              />
            ))
        ) : (
          <div className="flex justify-center p-2">Нет пользователей</div>
        )}
        {/* <Fab onClick={() => modalsFunc.user.edit()} show /> */}
      </CardListWrapper>
    </>
  )
}

export default MembersContent
