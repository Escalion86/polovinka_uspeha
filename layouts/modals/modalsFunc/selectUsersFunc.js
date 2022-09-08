import React, { useEffect, useState } from 'react'
// import useErrors from '@helpers/useErrors'

import { useRecoilValue } from 'recoil'
import eventSelector from '@state/selectors/eventSelector'
import itemsFuncAtom from '@state/atoms/itemsFuncAtom'

// import EditableTextarea from '@components/EditableTextarea'
// import FormWrapper from '@components/FormWrapper'
// import DateTimePicker from '@components/DateTimePicker'
// import ErrorsList from '@components/ErrorsList'
// import AddressPicker from '@components/AddressPicker'
// import InputImages from '@components/InputImages'
// import PriceInput from '@components/PriceInput'
// import CheckBox from '@components/CheckBox'
// import Input from '@components/Input'

// import { DEFAULT_ADDRESS } from '@helpers/constants'
// import { SelectDirection } from '@components/SelectItem'
// import eventsUsersSelector from '@state/selectors/eventsUsersSelector'
// import eventsUsersSelectorByEventId from '@state/selectors/eventsUsersByEventIdSelector'
import { SelectUserList } from '@components/SelectItemList'
// import usersSelectorByEventId from '@state/selectors/usersByEventIdSelector'
// import eventsUsersFullByEventIdSelector from '@state/selectors/eventsUsersFullByEventIdSelector'
import eventAssistantsSelector from '@state/selectors/eventAssistantsSelector'
import eventMansSelector from '@state/selectors/eventMansSelector'
import eventWomansSelector from '@state/selectors/eventWomansSelector'
import eventUsersInReserveSelector from '@state/selectors/eventUsersInReserveSelector'
import eventUsersInBanSelector from '@state/selectors/eventUsersInBanSelector'

import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from '@material-tailwind/react'
import usersAtom from '@state/atoms/usersAtom'
import { UserItem } from '@components/ItemCards'

const selectUsersFunc = (state, filter, onConfirm, exceptedIds, maxUsers) => {
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
    const [selectedUsers, setSelectedUsers] = useState(state ?? [])
    const [showErrorMax, setShowErrorMax] = useState(false)

    var filteredUsers = filter
      ? users.filter((user) => {
          for (const key in filter) {
            // if (Object.hasOwnProperty.call(filter, key)) {
            if (filter[key] !== user[key]) return false

            // }
          }
          return true
        })
      : users

    if (exceptedIds) {
      filteredUsers = filteredUsers.filter(
        (user) => !exceptedIds.includes(user._id)
      )
    }
    const sortedUsers = [...filteredUsers].sort((a, b) =>
      a.secondName && b.secondName
        ? a.secondName.toLocaleLowerCase() < b.secondName.toLocaleLowerCase()
          ? -1
          : 1
        : -1
    )

    const onClick = (userId) => {
      const index = selectedUsers.indexOf(userId)
      if (index >= 0) {
        setShowErrorMax(false)
        setSelectedUsers((state) => state.filter((item) => item !== userId)) //state.splice(index, 1)
      } else {
        if (!maxUsers || selectedUsers.length < maxUsers) {
          setShowErrorMax(false)
          setSelectedUsers((state) => [...state, userId])
        } else {
          setShowErrorMax(true)
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
      // mansIds,
      // womansIds,
      // assistantsIds,
      // reservedParticipantsIds,
      // bannedParticipantsIds,
    ])

    return (
      <div>
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
    )
  }

  return {
    title: `Выбор пользователей`,
    confirmButtonName: 'Применить',
    // showConfirm: true,
    Children: SelectUsersModal,
  }
}

export default selectUsersFunc
