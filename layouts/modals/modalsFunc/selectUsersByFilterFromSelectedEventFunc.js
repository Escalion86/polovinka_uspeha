import ContentHeader from '@components/ContentHeader'
import Divider from '@components/Divider'
import FormWrapper from '@components/FormWrapper'
import CheckBox from '@components/CheckBox'
import GenderToggleButtons from '@components/IconToggleButtons/GenderToggleButtons'
import RelationshipUserToggleButtons from '@components/IconToggleButtons/RelationshipUserToggleButtons'
import StatusUserToggleButtons from '@components/IconToggleButtons/StatusUserToggleButtons'
import ToggleButtons from '@components/IconToggleButtons/ToggleButtons'
import { EVENT_USER_STATUSES } from '@helpers/constants'
import eventSelector from '@state/selectors/eventSelector'
import eventsUsersFullByEventIdSelector from '@state/selectors/eventsUsersFullByEventIdSelector'
import { useAtomValue } from 'jotai'
import { useMemo, useState } from 'react'
import { useEffect } from 'react'

const selectUsersByFilterFromSelectedEventFunc = (eventId, onSelect) => {
  const SelectUsersByFilterFromSelectedEventModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
  }) => {
    const event = useAtomValue(eventSelector(eventId))
    const eventUsers = useAtomValue(eventsUsersFullByEventIdSelector(eventId))
    const subEvents = event?.subEvents ?? []
    const [withEventText, setWithEventText] = useState(true)
    const [statusInEvent, setStatusInEvent] = useState({
      participant: true,
      assistant: false,
      reserve: false,
      ban: false,
    })

    const [filter, setFilter] = useState({
      gender: {
        male: true,
        famale: true,
        // null: true,
      },
      status: {
        novice: true,
        member: true,
      },
      relationship: {
        havePartner: true,
        noPartner: true,
      },
    })
    const [subEventsFilter, setSubEventsFilter] = useState({})

    // const [checkAddEventDescription, setCheckAddEventDescription] =
    //   useState(true)

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

    const filteredByEventStatusUsers = useMemo(
      () => eventUsers.filter(({ status }) => statusInEvent[status]),
      // .map(({ user }) => user),
      [eventUsers, statusInEvent]
    )

    useEffect(() => {
      if (!event) {
        if (Object.keys(subEventsFilter).length) setSubEventsFilter({})
        return
      }

      const hasMultipleSubEvents = subEvents.length > 1
      const hasUsersWithoutSubEvent = eventUsers.some(
        ({ subEventId }) => !subEventId
      )

      if (!hasMultipleSubEvents && !hasUsersWithoutSubEvent) {
        if (Object.keys(subEventsFilter).length) setSubEventsFilter({})
        return
      }

      const nextState = {}

      if (subEvents.length) {
        subEvents.forEach(({ id }) => {
          if (hasMultipleSubEvents) {
            nextState[id] =
              subEventsFilter[id] !== undefined ? subEventsFilter[id] : true
          }
        })
      }

      if (!hasMultipleSubEvents && subEvents.length === 1) {
        const [onlySubEvent] = subEvents
        if (onlySubEvent?.id !== undefined)
          nextState[onlySubEvent.id] =
            subEventsFilter[onlySubEvent.id] !== undefined
              ? subEventsFilter[onlySubEvent.id]
              : true
      }

      if (hasUsersWithoutSubEvent) {
        nextState.null =
          subEventsFilter.null !== undefined ? subEventsFilter.null : true
      }

      if (!Object.values(nextState).some(Boolean)) {
        const firstKey = Object.keys(nextState)[0]
        if (firstKey !== undefined) nextState[firstKey] = true
      }

      const nextKeys = Object.keys(nextState)
      const currentKeys = Object.keys(subEventsFilter)
      const isSameLength = nextKeys.length === currentKeys.length
      const isSame =
        isSameLength &&
        nextKeys.every((key) => subEventsFilter[key] === nextState[key])

      if (!isSame) setSubEventsFilter(nextState)
    }, [event, eventUsers, subEventsFilter])

    const shouldShowSubEventsFilter = Object.keys(subEventsFilter).length > 0

    const filteredBySubEventUsers = useMemo(() => {
      if (!shouldShowSubEventsFilter) return filteredByEventStatusUsers
      return filteredByEventStatusUsers.filter(({ subEventId }) => {
        const key = subEventId ?? 'null'
        return subEventsFilter[key]
      })
    }, [
      filteredByEventStatusUsers,
      shouldShowSubEventsFilter,
      subEventsFilter,
    ])

    const usersGendersCount = useMemo(
      () => ({
        male: filteredBySubEventUsers.filter(
          ({ user }) => user.gender === 'male'
        ).length,
        famale: filteredBySubEventUsers.filter(
          ({ user }) => user.gender === 'famale'
        ).length,
      }),
      [filteredBySubEventUsers]
    )

    const usersStatusCount = useMemo(
      () => ({
        novice: filteredBySubEventUsers.filter(
          ({ userStatus }) => userStatus === 'novice'
        ).length,
        member: filteredBySubEventUsers.filter(
          ({ userStatus }) => userStatus === 'member'
        ).length,
        ban: filteredBySubEventUsers.filter(
          ({ userStatus }) => userStatus === 'ban'
        ).length,
      }),
      [filteredBySubEventUsers]
    )

    const usersRelationshipCount = useMemo(
      () => ({
        havePartner: filteredBySubEventUsers.filter(
          ({ user }) => user.relationship
        ).length,
        noPartner: filteredBySubEventUsers.filter(
          ({ user }) => !user.relationship
        ).length,
      }),
      [filteredBySubEventUsers]
    )

    const usersSubEventsCount = useMemo(() => {
      if (!shouldShowSubEventsFilter) return {}

      const counts = {}
      Object.keys(subEventsFilter).forEach((key) => {
        counts[key] = 0
      })

      filteredByEventStatusUsers.forEach(({ subEventId }) => {
        const key = subEventId ?? 'null'
        if (counts[key] !== undefined) counts[key] += 1
      })

      Object.keys(counts).forEach((key) => {
        counts[key] = ` (${counts[key]} чел.)`
      })

      return counts
    }, [
      filteredByEventStatusUsers,
      shouldShowSubEventsFilter,
      subEventsFilter,
    ])

    const subEventsOptions = useMemo(() => {
      if (!shouldShowSubEventsFilter) return []

      const options = []

      if (Object.prototype.hasOwnProperty.call(subEventsFilter, 'null')) {
        options.push({ value: 'null', name: 'Без варианта' })
      }

      subEvents.forEach(({ id, title }) => {
        if (Object.prototype.hasOwnProperty.call(subEventsFilter, id))
          options.push({ value: id, name: title })
      })

      return options
    }, [subEvents, shouldShowSubEventsFilter, subEventsFilter])

    const handleSubEventToggle = (key) => {
      setSubEventsFilter((prev) => {
        const nextState = {
          ...prev,
          [key]: !prev[key],
        }

        if (!Object.values(nextState).some(Boolean)) return prev

        return nextState
      })
    }

    useEffect(() => {
      setOnConfirmFunc(() => {
        const fullyFilteredUsers = filteredBySubEventUsers
          .filter(
            ({ user }) =>
              user &&
              filter.gender[String(user.gender)] &&
              filter.status[user?.status ?? 'novice'] &&
              (user.relationship
                ? filter.relationship.havePartner
                : filter.relationship.noPartner)
          )
          .map(({ user }) => user)
        // if (checkAddEventDescription)
        onSelect(fullyFilteredUsers, event, withEventText)
        // else onSelect(fullyFilteredUsers)
        closeModal()
      })
    }, [eventUsers, filteredBySubEventUsers, filter, withEventText])

    const statusInEventBottonsConfig = useMemo(
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

    // const usersGendersBottonsConfig = useMemo(
    //   () =>
    //     GENDERS.map((button) => ({
    //       ...button,
    //       name: (
    //         <div className="flex flex-col justify-center">
    //           <div>{button.name}</div>
    //           <div>{usersStatusesCount[button.value]} чел.</div>
    //         </div>
    //       ),
    //     })),
    //   [usersStatusesCount]
    // )

    // const selectedStatuses = Object.keys(value).filter((key) => value[key])

    return (
      <FormWrapper flex className="flex-col">
        <div className="flex flex-col items-center justify-center text-lg">
          <div className="flex justify-center w-full text-lg font-bold">
            {event?.title}
          </div>
        </div>
        {/* <div> */}
        <Divider title="Фильтр по статусу на мероприятии" />
        <ContentHeader noBorder>
          <ToggleButtons
            value={statusInEvent}
            onChange={setStatusInEvent}
            buttonsConfig={statusInEventBottonsConfig}
          />
        </ContentHeader>
        {shouldShowSubEventsFilter && (
          <>
            <Divider title="Фильтр по вариантам участия" />
            <ContentHeader noBorder>
              <div className="flex flex-col gap-y-1">
                {subEventsOptions.map(({ value, name }) => (
                  <CheckBox
                    key={value}
                    checked={!!subEventsFilter[value]}
                    onClick={() => handleSubEventToggle(value)}
                    label={`${name}${usersSubEventsCount[value] ?? ''}`}
                  />
                ))}
              </div>
            </ContentHeader>
          </>
        )}
        {/* </div> */}
        <Divider title="Фильтр по пользователям" />
        <ContentHeader noBorder>
          <GenderToggleButtons
            value={filter.gender}
            onChange={(value) =>
              setFilter((state) => ({ ...state, gender: value }))
            }
            hideNullGender
            names={usersGendersCount}
          />
          <StatusUserToggleButtons
            value={filter.status}
            onChange={(value) =>
              setFilter((state) => ({ ...state, status: value }))
            }
            names={usersStatusCount}
          />
          <RelationshipUserToggleButtons
            value={filter.relationship}
            onChange={(value) =>
              setFilter((state) => ({ ...state, relationship: value }))
            }
            names={usersRelationshipCount}
          />
          {/* <UsersFilter value={filter} onChange={setFilter} /> */}
        </ContentHeader>
        <div>
          Итого выбрано:{' '}
          {eventUsers.filter(({ status }) => statusInEvent[status]).length}
        </div>
        <CheckBox
          checked={withEventText}
          label="Взять текст из мероприятия"
          onChange={() => setWithEventText((prev) => !prev)}
        />
        {/* <CheckBox
          checked={checkAddEventDescription}
          onChange={() => setCheckAddEventDescription}
        /> */}
      </FormWrapper>
    )
  }

  return {
    title: `Выбор участников на мероприятии по фильтру`,
    // declineButtonName: 'Закрыть',
    closeButtonShow: true,
    Children: SelectUsersByFilterFromSelectedEventModal,
  }
}

export default selectUsersByFilterFromSelectedEventFunc
