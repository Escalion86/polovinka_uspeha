import FormWrapper from '@components/FormWrapper'
import ToggleButtons from '@components/IconToggleButtons/ToggleButtons'
import { EVENT_USER_STATUSES } from '@helpers/constants'
import eventSelector from '@state/selectors/eventSelector'
import eventsUsersFullByEventIdSelector from '@state/selectors/eventsUsersFullByEventIdSelector'
import { useAtomValue } from 'jotai'
import { useMemo, useState } from 'react'
import { useEffect } from 'react'

const selectUsersByStatusesFromSelectedEventFunc = (eventId, onSelect) => {
  const SelectUsersByStatusesFromSelectedEventModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
  }) => {
    const event = useAtomValue(eventSelector(eventId))
    const eventUsers = useAtomValue(eventsUsersFullByEventIdSelector(eventId))
    const [value, setValue] = useState({
      participant: true,
      assistant: false,
      reserve: false,
      ban: false,
    })

    const usersStatusesCount = useMemo(
      () => ({
        participant: eventUsers.filter(({ status }) => status === 'participant')
          .length,
        assistant: eventUsers.filter(({ status }) => status === 'assistant')
          .length,
        reserve: eventUsers.filter(({ status }) => status === 'reserve').length,
        ban: eventUsers.filter(({ status }) => status === 'ban').length,
      }),
      [eventUsers]
    )

    useEffect(() => {
      setOnConfirmFunc(() => {
        const users = eventUsers
          .filter(({ status }) => value[status])
          .map(({ user }) => user)
        onSelect(users)
        closeModal()
      })
    }, [value, eventUsers])

    const bottonsConfig = useMemo(
      () =>
        EVENT_USER_STATUSES.map((button) => ({
          ...button,
          name: (
            <div className="flex flex-col justify-center">
              <div>{button.name}</div>
              <div>{usersStatusesCount[button.value]} чел.</div>
            </div>
          ),
        })),
      [usersStatusesCount]
    )

    // const selectedStatuses = Object.keys(value).filter((key) => value[key])

    return (
      <FormWrapper flex className="flex-col">
        <div className="flex flex-col items-center justify-center text-lg">
          <div className="flex justify-center w-full text-lg font-bold">
            {event?.title}
          </div>
        </div>
        <div>
          <ToggleButtons
            value={value}
            onChange={setValue}
            buttonsConfig={bottonsConfig}
            // iconsOnly
          />
        </div>
        <div>
          Итого выбрано:{' '}
          {eventUsers.filter(({ status }) => value[status]).length}
        </div>
      </FormWrapper>
    )
  }

  return {
    title: `Выбор участников по их статусу на мероприятии`,
    // declineButtonName: 'Закрыть',
    closeButtonShow: true,
    Children: SelectUsersByStatusesFromSelectedEventModal,
  }
}

export default selectUsersByStatusesFromSelectedEventFunc
