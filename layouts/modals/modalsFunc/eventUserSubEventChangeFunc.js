import EventUsersCounterAndAge from '@components/EventUsersCounterAndAge'
import FormWrapper from '@components/FormWrapper'
import PriceDiscount from '@components/PriceDiscount'
import UserRelationshipIcon from '@components/UserRelationshipIcon'
import { faCancel } from '@fortawesome/free-solid-svg-icons/faCancel'
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import userToEventStatus from '@helpers/userToEventStatus'
// import itemsFuncAtom from '@state/itemsFuncAtom'
import eventsUsersFullByEventIdSelector from '@state/selectors/eventsUsersFullByEventIdSelector'
import userSelector from '@state/selectors/userSelector'
import cn from 'classnames'
import { useCallback, useEffect, useState } from 'react'
import { useAtomValue } from 'jotai'
import eventSelector from '@state/selectors/eventSelector'
import directionSelector from '@state/selectors/directionSelector'
import Note from '@components/Note'
import isEventExpiredFunc from '@helpers/isEventExpired'
import subEventsSummator from '@helpers/subEventsSummator'

const eventUserSubEventChangeFunc = (
  { eventId, userId },
  onConfirm,
  selectedSubEventId
) => {
  const EventUserSubEventChangeModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setBottomLeftComponent,
  }) => {
    const event = useAtomValue(eventSelector(eventId))
    const user = useAtomValue(userSelector(userId))
    const direction = useAtomValue(directionSelector(event.directionId))
    const rules = direction?.rules
    const isEventExpired = isEventExpiredFunc(event)

    const eventUsersFull = useAtomValue(
      eventsUsersFullByEventIdSelector(eventId)
    )
    const eventUser = eventUsersFull.find(
      (eventUser) => eventUser.userId === userId
    )

    // const setEventUser = useAtomValue(itemsFuncAtom).eventsUser.set

    const [subEventId, setSubEventId] = useState(
      selectedSubEventId ?? eventUser.subEventId
    )

    const isFormChanged =
      subEventId !== (selectedSubEventId ?? eventUser.subEventId)

    const onClickConfirm = async () => {
      closeModal()
      // setEventUser({
      //   _id: eventUser?._id,
      //   subEventId,
      // })
      if (onConfirm) onConfirm({ eventId, userId, subEventId })
    }

    const eventUsersFullWithOutOurUser = eventUsersFull.filter(
      (eventUser) => eventUser.userId !== userId
    )

    useEffect(() => {
      setOnShowOnCloseConfirmDialog(isFormChanged)
      setDisableConfirm(!isFormChanged)
      setOnConfirmFunc(onClickConfirm)
    }, [isFormChanged])

    const subEventsUserStatus = event.subEvents.map((subEvent) => {
      const subEventSum = subEventsSummator([subEvent])
      const eventUsersFullOfSubEvent = eventUsersFullWithOutOurUser.filter(
        (eventUser) => eventUser.subEventId === subEvent.id
      )
      return {
        id: subEvent.id,
        userStatus: userToEventStatus({
          event,
          user,
          eventUsersFull: eventUsersFullOfSubEvent,
          subEventSum,
          rules,
          ignoreEventIsExpired: true,
        }),
      }
    })

    const setError = useCallback((set) => {
      setBottomLeftComponent(
        set ? (
          <Note type="error" noMargin>
            Обратите внимание, что данный пользователь не подходит по кретериям
            для данного варианта участия
          </Note>
        ) : null
      )
    }, [])

    useEffect(() => {
      const subEvent = subEventsUserStatus.find(
        (s) => s.id === subEventId
      )?.userStatus
      const canCheck = subEvent.canSignIn || subEvent.canSignInReserve
      setError(!canCheck)
    }, [])

    return (
      <FormWrapper className="gap-y-2">
        {isEventExpired && (
          <Note type="warning" noMargin>
            Обратите внимание, что мероприятие завершено (но не закрыто)
          </Note>
        )}
        {event.subEvents?.length > 1 && (
          <div className="flex flex-col py-1 gap-y-1">
            {event.subEvents?.map((props) => {
              const selected = props.id === subEventId
              const subEvent = subEventsUserStatus.find(
                (s) => s.id === props.id
              )?.userStatus
              const canCheck = subEvent.canSignIn || subEvent.canSignInReserve

              return (
                <div
                  key={props.id}
                  className={cn(
                    'flex overflow-hidden cursor-pointer flex-col border rounded-lg hover:shadow-medium-active duration-300',
                    !canCheck
                      ? 'bg-red-100 border-danger'
                      : selected
                        ? 'bg-green-100 border-success'
                        : 'bg-gray-100 border-gray-400'
                  )}
                  onClick={() => {
                    setError(!canCheck)
                    setSubEventId(props.id)
                  }}
                >
                  <div className="flex items-center border-b border-gray-300 gap-x-1">
                    <div
                      className={cn(
                        'flex items-center justify-center w-12 h-12 min-w-10 min-h-10 border-r border-gray-300'
                      )}
                    >
                      {selected ? (
                        <FontAwesomeIcon
                          className="w-10 h-10 text-success"
                          icon={faCheck}
                        />
                      ) : (
                        !canCheck && (
                          <FontAwesomeIcon
                            className="w-10 h-10 text-danger"
                            icon={faCancel}
                          />
                        )
                      )}
                    </div>
                    <div className="flex-1 px-2 py-2 text-lg font-bold text-center text-general tablet:text-xl">
                      {props.title ? props.title : 'Основной тип участия'}
                    </div>
                    {props.usersRelationshipAccess &&
                      props.usersRelationshipAccess !== 'yes' && (
                        <div className="flex items-center justify-center w-12 h-12 border-l border-gray-300 min-w-10 min-h-10">
                          <UserRelationshipIcon
                            relationship={
                              props.usersRelationshipAccess === 'only'
                            }
                            nameForEvent
                          />
                        </div>
                      )}
                  </div>
                  {props?.description && (
                    <div
                      className="w-full max-w-full px-2 py-1 overflow-hidden list-disc border-b border-gray-300 textarea ql"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(props?.description),
                      }}
                    />
                  )}
                  <div className="flex items-center flex-1 px-2 py-2 gap-x-12">
                    <EventUsersCounterAndAge
                      event={event}
                      subEvent={props}
                      showNoviceAndMemberSum
                      className=""
                      showAges
                      dontShowLabel
                      eventUsersToUse={eventUsersFullWithOutOurUser}
                    />
                    <div className="flex items-center justify-end flex-1">
                      <PriceDiscount item={props} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </FormWrapper>
    )
  }

  return {
    title: `Изменение варианта участия на мероприятии`,
    confirmButtonName: 'Применить',
    Children: EventUserSubEventChangeModal,
  }
}

export default eventUserSubEventChangeFunc
