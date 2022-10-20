import React, { useEffect, useRef, useState } from 'react'
import { useRecoilValue } from 'recoil'
import usersAtom from '@state/atoms/usersAtom'
import { UserItem } from '@components/ItemCards'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons'
import cn from 'classnames'
import filterItems from '@helpers/filterItems'

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
      typeof state === 'object'
        ? state.filter((item) => typeof item === 'string' && item !== '')
        : []
    )
    const [showErrorMax, setShowErrorMax] = useState(false)

    const [searchText, setSearchText] = useState('')
    const inputRef = useRef()

    const filteredUsers = filterItems(
      users,
      searchText,
      exceptedIds,
      filterRules
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

    useEffect(() => inputRef.current.focus(), [inputRef])

    useEffect(() => {
      if (!canSelectNone) setDisableConfirm(selectedUsers.length === 0)
    }, [canSelectNone, selectedUsers])

    return (
      <div className="flex flex-col max-h-full">
        <div
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
          {/* {moreOneFilterTurnOnExists ? (
                <div
                  className={cn(
                    moreOneFilter ? 'bg-yellow-400' : 'bg-primary',
                    'hover:bg-toxic text-white flex items-center justify-center font-bold rounded cursor-pointer w-7 h-7'
                  )}
                  onClick={() => setMoreOneFilter(!moreOneFilter)}
                >
                  {'>0'}
                </div>
              ) : null} */}
        </div>

        <div className="flex-1 overflow-y-auto max-h-200">
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
        </div>
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
