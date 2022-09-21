import { modalsFuncAtom } from '@state/atoms'
import { useRecoilValue } from 'recoil'
import Fab from '@components/Fab'
import usersAtom from '@state/atoms/usersAtom'
import UserCard from '@layouts/cards/UserCard'
import CardListWrapper from '@layouts/wrappers/CardListWrapper'
import { getNounUsers } from '@helpers/getNoun'
import { useMemo, useState } from 'react'
import ContentHeader from '@components/ContentHeader'
import { Button, ButtonGroup } from '@mui/material'
import { faMars, faVenus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import GenderToggleButtons from '@components/IconToggleButtons/GenderToggleButtons'
import StatusUserToggleButtons from '@components/IconToggleButtons/StatusUserToggleButtons'
import UsersFilter from '@components/Filter/UsersFilter'

const UsersContent = () => {
  const modalsFunc = useRecoilValue(modalsFuncAtom)
  const users = useRecoilValue(usersAtom)
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
  })
  // const [statusFilter, setStatusFilter] = useState({
  //   novice: true,
  //   member: true,
  // })

  const visibleUsersIds = useMemo(
    () =>
      users
        .filter(
          (user) =>
            filter.gender[String(user.gender)] &&
            filter.status[user.status ?? 'novice']
        )
        .map((user) => user._id),
    [users, filter]
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
        <UsersFilter value={filter} onChange={setFilter} />
        {/* // <GenderToggleButtons value={genderFilter} onChange={setGenderFilter} />
        // <StatusUserToggleButtons
        //   value={statusFilter}
        //   onChange={setStatusFilter}
        // /> */}
        <div className="flex items-center justify-end flex-1 flex-nowrap gap-x-2">
          <div className="text-lg font-bold whitespace-nowrap">
            {getNounUsers(visibleUsersIds.length)}
          </div>
          {/* <FormControl size="small">
            <FilterToggleButton
              value={isFiltered}
              onChange={() => {
                setShowFilter((state) => !state)
              }}
            />
          </FormControl> */}
        </div>
      </ContentHeader>
      {/* <Filter show={showFilter} options={options} onChange={setFilterOptions} /> */}
      <CardListWrapper>
        {users?.length > 0 ? (
          users.map((user) => (
            <UserCard
              key={user._id}
              userId={user._id}
              hidden={!visibleUsersIds.includes(user._id)}
            />
          ))
        ) : (
          <div className="flex justify-center p-2">Нет пользователей</div>
        )}
        <Fab onClick={() => modalsFunc.user.edit()} show />
      </CardListWrapper>
    </>
  )
}

export default UsersContent
