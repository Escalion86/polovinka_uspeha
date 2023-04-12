import React, { useEffect, useRef, useState } from 'react'
import { useRecoilValue } from 'recoil'
import usersAtom from '@state/atoms/usersAtom'

import { UserItem } from '@components/ItemCards'
import filterItems from '@helpers/filterItems'
import Search from '@components/Search'
import ListWrapper from '@layouts/lists/ListWrapper'
import isObject from '@helpers/isObject'

const selectUsersFunc = (
  state,
  filterRules,
  onConfirm,
  exceptedIds,
  maxUsers,
  canSelectNone = true,
  title
) => {
  const SelectUsersModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
    setComponentInFooter,
  }) => {
    const users = useRecoilValue(usersAtom)
    const [selectedUsers, setSelectedUsers] = useState(
      isObject(state)
        ? state.filter((item) => typeof item === 'string' && item !== '')
        : []
    )
    const [showErrorMax, setShowErrorMax] = useState(false)

    const [searchText, setSearchText] = useState('')

    const filteredUsers = filterItems(
      users,
      searchText,
      exceptedIds,
      filterRules,
      ['firstName', 'secondName', 'thirdName']
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

    const onClick = (userId) => {
      const index = selectedUsers.indexOf(userId)
      // Клик по уже выбранному зрителю?
      if (index >= 0) {
        setShowErrorMax(false)
        setSelectedUsers((state) => state.filter((item) => item !== userId)) //state.splice(index, 1)
      } else {
        if (!maxUsers || selectedUsers.length < maxUsers) {
          setShowErrorMax(false)
          setSelectedUsers((state) => [...state, userId])
        } else {
          if (maxUsers === 1) {
            setSelectedUsers([userId])
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
      setOnConfirmFunc(() => {
        onConfirm(selectedUsers)
        closeModal()
      })
      // setOnShowOnCloseConfirmDialog(isFormChanged)
      // setDisableConfirm(!isFormChanged)
    }, [
      selectedUsers,
      maxUsers,
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

    return (
      <div className="flex flex-col w-full h-full max-h-full gap-y-0.5">
        <Search
          searchText={searchText}
          show={true}
          onChange={setSearchText}
          className="h-[38px] min-h-[38px]"
        />
        {/* <div
          className={cn(
            'flex gap-1 items-center border-gray-700 border p-1 mb-1 rounded'
            // { hidden: !isMenuOpen }
          )}
        >
          <input
            ref={inputRef}
            className="flex-1 bg-transparent outline-none"
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
          className={`tablet:flex-none border-gray-700 border-t flex-col tablet:max-h-[calc(100vh-185px)]`}
        >
          <ListWrapper itemCount={sortedUsers.length} itemSize={41}>
            {({ index, style }) => (
              <div style={style} className="border-b border-gray-700">
                <UserItem
                  // style={style}
                  item={sortedUsers[index]}
                  key={sortedUsers[index]._id}
                  active={selectedUsers.includes(sortedUsers[index]._id)}
                  onClick={() => onClick(sortedUsers[index]._id)}
                />
              </div>
            )}
          </ListWrapper>
        </div>
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
