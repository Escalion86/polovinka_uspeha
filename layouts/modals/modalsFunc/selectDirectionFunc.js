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
import { DirectionItem, UserItem } from '@components/ItemCards'
import directionsAtom from '@state/atoms/directionsAtom'

const selectDirectionFunc = (state, filter, onConfirm, exceptedIds) => {
  const SelectDirectionModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
  }) => {
    const directions = useRecoilValue(directionsAtom)
    const [selectedDirection, setSelectedDirection] = useState(state ?? [])

    var filteredDirections = filter
      ? directions.filter((direction) => {
          for (const key in filter) {
            // if (Object.hasOwnProperty.call(filter, key)) {
            if (filter[key] !== direction[key]) return false

            // }
          }
          return true
        })
      : directions

    if (exceptedIds) {
      filteredDirections = filteredDirections.filter(
        (direction) => !exceptedIds.includes(direction._id)
      )
    }

    const onClick = (direction) => {
      setSelectedDirection(direction._id)
    }

    useEffect(() => {
      // const isFormChanged =
      //   assistantsIds !== eventAssistantsIds ||
      //   mansIds !== eventMansIds ||
      //   womansIds !== eventWomansIds ||
      //   reservedParticipantsIds !== eventReservedParticipantsIds ||
      //   bannedParticipantsIds !== eventBannedParticipantsIds

      setOnConfirmFunc(() => {
        onConfirm(selectedDirection)
        closeModal()
      })
      // setOnShowOnCloseConfirmDialog(isFormChanged)
      // setDisableConfirm(!isFormChanged)
    }, [
      selectedDirection,
      // mansIds,
      // womansIds,
      // assistantsIds,
      // reservedParticipantsIds,
      // bannedParticipantsIds,
    ])

    return (
      <div>
        {filteredDirections.map((direction) => (
          <DirectionItem
            key={direction._id}
            item={direction}
            active={selectedDirection === direction._id}
            onClick={onClick}
          />
        ))}
      </div>
    )
  }

  return {
    title: `Выбор направления`,
    confirmButtonName: 'Применить',
    // showConfirm: true,
    Children: SelectDirectionModal,
  }
}

export default selectDirectionFunc
