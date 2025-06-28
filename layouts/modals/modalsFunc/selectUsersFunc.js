import { UserItem } from '@components/ItemCards'
import Search from '@components/Search'
import filterItems from '@helpers/filterItems'
import isObject from '@helpers/isObject'
import ListWrapper from '@layouts/lists/ListWrapper'
import usersAtomAsync from '@state/async/usersAtomAsync'
import { useEffect, useState } from 'react'
import { useAtomValue } from 'jotai'
import locationAtom from '@state/atoms/locationAtom'
import { fetchUser } from '@helpers/fetchers'
import UsersFilter from '@components/Filter/UsersFilter'
import { useMemo } from 'react'
import loggedUserActiveRoleSelector from '@state/selectors/loggedUserActiveRoleSelector'
import isLoggedUserDevSelector from '@state/selectors/isLoggedUserDevSelector'
import ContentHeader from '@components/ContentHeader'
import Button from '@components/Button'
import { faCheckDouble } from '@fortawesome/free-solid-svg-icons/faCheckDouble'
import { faSquare } from '@fortawesome/free-regular-svg-icons/faSquare'
import compareObjects from '@helpers/compareObjects'
import birthDateToAge from '@helpers/birthDateToAge'

const selectUsersFunc = (
  selectedUsersState,
  filterRules,
  onConfirm,
  exceptedIds,
  acceptedIds,
  maxUsers,
  canSelectNone = true,
  title,
  getFullUsers = false
) => {
  const SelectUsersModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
    setComponentInFooter,
    setTopLeftComponent,
    TopLeftComponent,
  }) => {
    const location = useAtomValue(locationAtom)
    const users = useAtomValue(usersAtomAsync)
    const loggedUserActiveRole = useAtomValue(loggedUserActiveRoleSelector)
    const isLoggedUserDev = useAtomValue(isLoggedUserDevSelector)
    // const isLoggedUserAdmin = useAtomValue(isLoggedUserAdminSelector)
    const seeAllContacts = loggedUserActiveRole?.users?.seeAllContacts

    const defaultUsersState = useMemo(
      () =>
        isObject(selectedUsersState)
          ? selectedUsersState.filter((item) => isObject(item))
          : [],
      [selectedUsersState]
    )

    const [selectedUsers, setSelectedUsers] = useState(defaultUsersState)
    // const [lastSelectedUsersCount, setLastSelectedUsersCount] = useState(
    //   selectedUsers.length
    // )

    const [showErrorMax, setShowErrorMax] = useState(false)

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
      checked: {
        checked: true,
        unchecked: true,
      },
      ages: {
        min: 18,
        max: 70,
      },
    })

    const [searchText, setSearchText] = useState('')

    const acceptedUsers = useMemo(
      () =>
        isObject(acceptedIds)
          ? acceptedIds.length === 0
            ? []
            : users.filter(({ _id }) => acceptedIds.includes(_id))
          : users,
      [acceptedIds, users]
    )

    const acceptedUsersWithAges = useMemo(
      () =>
        acceptedUsers.map((user) => ({
          ...user,
          age: birthDateToAge(user.birthday, new Date(), false),
        })),
      [acceptedUsers]
    )

    const searchByFields = useMemo(() => {
      const addSearchProps = seeAllContacts
        ? ['phone', 'whatsapp', 'viber', 'instagram', 'telegram', 'vk', 'email']
        : []
      const addDevSearchProps = isLoggedUserDev ? ['_id'] : []

      return [
        'firstName',
        'secondName',
        'thirdName',
        ...addSearchProps,
        ...addDevSearchProps,
      ]
    }, [seeAllContacts, isLoggedUserDev])

    const selectedUsersIds = useMemo(
      () => selectedUsers.map((user) => user._id),
      [selectedUsers]
    )

    const filteredUsers = useMemo(
      () =>
        filterItems(
          acceptedUsersWithAges,
          searchText,
          exceptedIds,
          filterRules,
          searchByFields,
          null,
          (user) => {
            // const ages = birthDateToAge(user.birthday)
            return (
              user &&
              (filter.gender[String(user.gender)] ||
                (filter.gender.null &&
                  user.gender !== 'male' &&
                  user.gender !== 'famale')) &&
              filter.status[user?.status ?? 'novice'] &&
              (user.relationship
                ? filter.relationship.havePartner
                : filter.relationship.noPartner) &&
              (((filter.checked.checked ||
                !selectedUsersIds.includes(user._id)) &&
                filter.checked.unchecked) ||
                selectedUsersIds.includes(user._id)) &&
              (!filter.ages ||
                (user.age >= (filter.ages.min || 18) &&
                  user.age <= (filter.ages.max || 70)))
            )
          }
        ),
      [
        acceptedUsersWithAges,
        searchText,
        exceptedIds,
        filterRules,
        filter,
        searchByFields,
        selectedUsersIds,
      ]
    )

    // var filteredUsers = filter
    //   ? users.filter((user) => {
    //       for (const key in filter) {
    //         // if (Object.hasOwnProperty.call(filter, key)) {
    //         if (filter[key] !== user[key]) return false

    //         // }
    //       }
    //       return true
    //     })
    //   : users

    // if (exceptedIds) {
    //   filteredUsers = filteredUsers.filter(
    //     (user) => !exceptedIds.includes(user._id)
    //   )
    // }
    const sortedUsers = [...filteredUsers].sort((a, b) =>
      a.firstName && b.firstName
        ? a.firstName.toLocaleLowerCase() < b.firstName.toLocaleLowerCase()
          ? -1
          : 1
        : -1
    )

    const onClick = (user) => {
      const index = selectedUsers.findIndex((item) => item._id == user._id)
      // Клик по уже выбранному зрителю?
      if (index >= 0) {
        setShowErrorMax(false)
        setSelectedUsers((state) =>
          state.filter((item) => item._id != user._id)
        ) //state.splice(index, 1)
      } else {
        if (!maxUsers || selectedUsers.length < maxUsers) {
          setShowErrorMax(false)
          setSelectedUsers((state) => [...state, user])
        } else {
          if (maxUsers === 1) {
            setSelectedUsers([user])
          } else setShowErrorMax(true)
        }
      }
    }

    useEffect(() => {
      // const isFormChanged =
      //   assistantsIds !== eventAssistantsIds ||
      //   mansIds !== eventMansIds ||
      //   womansIds !== eventWomansIds ||
      //   reservedParticipantsIds !== eventReservedParticipantsIds ||
      //   bannedParticipantsIds !== eventBannedParticipantsIds
      // maxUsers !== 1 &&
      setComponentInFooter(
        <div className="flex text-lg gap-x-1 teblet:text-base flex-nowrap">
          <span>Выбрано:</span>
          <span className="font-bold">{selectedUsers.length}</span>
          {maxUsers && (
            <>
              <span>/</span>
              <span>{maxUsers}</span>
            </>
          )}
          <span>чел.</span>
        </div>
      )
      const isFormChanged = !compareObjects(selectedUsers, defaultUsersState)
      setOnConfirmFunc(
        isFormChanged
          ? async () => {
              if (getFullUsers) {
                const fullUsers = []
                for (const user of selectedUsers) {
                  const fullUser = await fetchUser(location, user._id)
                  fullUsers.push(fullUser)
                }
                closeModal()
                onConfirm(fullUsers)
              } else {
                closeModal()
                onConfirm(selectedUsers)
              }
            }
          : undefined
      )

      // })
      // setOnShowOnCloseConfirmDialog(isFormChanged)
      // setDisableConfirm(!isFormChanged)
    }, [
      selectedUsers,
      maxUsers,
      getFullUsers,
      // mansIds,
      // womansIds,
      // assistantsIds,
      // reservedParticipantsIds,
      // bannedParticipantsIds,
    ])

    // useEffect(() => inputRef.current.focus(), [inputRef])

    useEffect(() => {
      if (!canSelectNone) setDisableConfirm(selectedUsers.length === 0)
    }, [canSelectNone, selectedUsers])

    // useEffect(() => {
    //   if (
    //     !maxUsers
    //     //  &&
    //     // !TopLeftComponent &&
    //     // (lastSelectedUsersCount !== selectedUsers.length ||
    //     //   sortedUsers.length !== lastSelectedUsersCount)
    //   ) {
    //     setTopLeftComponent(() => (
    //       <Button
    //         thin
    //         icon={faListCheck}
    //         name="Выбрать всех по фильтру"
    //         onClick={() => {
    //           setSelectedUsers(sortedUsers)
    //           // setLastSelectedUsersCount(sortedUsers.length)
    //           // setTopLeftComponent()
    //         }}
    //       />
    //     ))
    //   }
    // }, [
    //   // lastSelectedUsersCount, selectedUsers.length,
    //   maxUsers,
    //   selectedUsers.length,
    //   sortedUsers.length,
    // ])

    return (
      <div className="flex flex-col items-stretch w-full h-full max-h-full gap-y-0.5">
        <ContentHeader noBorder>
          <UsersFilter value={filter} onChange={setFilter} />
        </ContentHeader>
        <Search
          searchText={searchText}
          show={true}
          onChange={setSearchText}
          className="h-[38px] min-h-[38px]"
        />

        {/* <div
          className={cn(
            'flex gap-1 items-center border-gray-700 border p-1 mb-1 rounded-sm'
            // { hidden: !isMenuOpen }
          )}
        >
          <input
            ref={inputRef}
            className="flex-1 bg-transparent outline-hidden"
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <FontAwesomeIcon
            className={'w-6 h-6 text-gray-700 cursor-pointer'}
            icon={searchText ? faTimes : faSearch}
            onClick={
              searchText
                ? () => setSearchText('')
                : () => inputRef.current.focus()
            }
          />
        </div> */}
        <div
          style={{ height: sortedUsers.length * 41 + 2 }}
          className={`flex-1 tablet:flex-none border-gray-700 border-t tablet:max-h-[calc(100vh-270px)]`}
        >
          <ListWrapper itemCount={sortedUsers.length} itemSize={41}>
            {({ index, style }) => (
              <div style={style} className="border-b border-gray-700">
                <UserItem
                  // style={style}
                  item={sortedUsers[index]}
                  key={sortedUsers[index]._id}
                  active={
                    !!selectedUsers.find(
                      (user) => user._id == sortedUsers[index]._id
                    )
                  }
                  onClick={() => onClick(sortedUsers[index])}
                />
              </div>
            )}
          </ListWrapper>
        </div>
        {!maxUsers && (
          <div className="flex justify-center gap-2 pt-1 -mx-3 border-t border-gray-400">
            <Button
              thin
              icon={faCheckDouble}
              name="Выбрать всех по фильтру"
              onClick={() => {
                setSelectedUsers(sortedUsers)
              }}
            />
            <Button
              thin
              icon={faSquare}
              name="Отменить выбор"
              onClick={() => {
                setSelectedUsers([])
              }}
            />
          </div>
        )}
        {showErrorMax && (
          <div className="text-danger">
            Выбрано максимальное количество пользователей
          </div>
        )}

        {/* <div className="flex-1 overflow-y-auto">
          {sortedUsers.map((user) => (
            <UserItem
              key={user._id}
              item={user}
              active={selectedUsers.includes(user._id)}
              onClick={() => onClick(user._id)}
            />
          ))}

          {showErrorMax && (
            <div className="text-danger">
              Выбрано максимальное количество пользователей
            </div>
          )}
        </div> */}
      </div>
    )
  }

  return {
    title:
      title ?? (maxUsers === 1 ? `Выбор пользователя` : `Выбор пользователей`),
    confirmButtonName: 'Применить',
    // showConfirm: true,
    Children: SelectUsersModal,
  }
}

export default selectUsersFunc
