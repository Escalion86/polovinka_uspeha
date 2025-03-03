// import CheckBox from '@components/CheckBox'
import ContentHeader from '@components/ContentHeader'
import Divider from '@components/Divider'
import FormWrapper from '@components/FormWrapper'
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

    const usersGendersCount = useMemo(
      () => ({
        male: filteredByEventStatusUsers.filter(
          ({ user }) => user.gender === 'male'
        ).length,
        famale: filteredByEventStatusUsers.filter(
          ({ user }) => user.gender === 'famale'
        ).length,
      }),
      [filteredByEventStatusUsers]
    )

    const usersStatusCount = useMemo(
      () => ({
        novice: filteredByEventStatusUsers.filter(
          ({ userStatus }) => userStatus === 'novice'
        ).length,
        member: filteredByEventStatusUsers.filter(
          ({ userStatus }) => userStatus === 'member'
        ).length,
        ban: filteredByEventStatusUsers.filter(
          ({ userStatus }) => userStatus === 'ban'
        ).length,
      }),
      [filteredByEventStatusUsers]
    )

    const usersRelationshipCount = useMemo(
      () => ({
        havePartner: filteredByEventStatusUsers.filter(
          ({ user }) => user.relationship
        ).length,
        noPartner: filteredByEventStatusUsers.filter(
          ({ user }) => !user.relationship
        ).length,
      }),
      [filteredByEventStatusUsers]
    )

    useEffect(() => {
      setOnConfirmFunc(() => {
        const fullyFilteredUsers = filteredByEventStatusUsers
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
        onSelect(fullyFilteredUsers, event)
        // else onSelect(fullyFilteredUsers)
        closeModal()
      })
    }, [eventUsers, filteredByEventStatusUsers, filter])

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
