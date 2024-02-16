import EventUsersCounterAndAge from '@components/EventUsersCounterAndAge'
import FormWrapper from '@components/FormWrapper'
import PriceDiscount from '@components/PriceDiscount'
import UserRelationshipIcon from '@components/UserRelationshipIcon'
import { faCancel, faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import userToEventStatus from '@helpers/userToEventStatus'
import itemsFuncAtom from '@state/atoms/itemsFuncAtom'
import eventSelector from '@state/selectors/eventSelector'
import eventsUsersFullByEventIdSelector from '@state/selectors/eventsUsersFullByEventIdSelector'
import userSelector from '@state/selectors/userSelector'
import cn from 'classnames'
import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'

const eventUserSubEventChangeFunc = ({ eventId, userId }, onConfirm) => {
  const EventUserSubEventChangeModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
  }) => {
    const event = useRecoilValue(eventSelector(eventId))
    const user = useRecoilValue(userSelector(userId))
    const eventUsers = useRecoilValue(eventsUsersFullByEventIdSelector(eventId))
    const eventUser = eventUsers.find(
      (eventUser) => eventUser.userId === userId
    )

    const setEventUser = useRecoilValue(itemsFuncAtom).eventsUser.set

    const [subEventId, setSubEventId] = useState(eventUser.subEventId)

    const isFormChanged = subEventId !== eventUser.subEventId

    const onClickConfirm = async () => {
      closeModal()
      setEventUser({
        _id: eventUser?._id,
        subEventId,
      })
      onConfirm({ eventId, userId, subEventId })
    }

    const eventUsersWithOutOurUser = eventUsers.filter(
      (eventUser) => eventUser.userId !== userId
    )

    useEffect(() => {
      setOnShowOnCloseConfirmDialog(isFormChanged)
      setDisableConfirm(!isFormChanged)
      setOnConfirmFunc(onClickConfirm)
    }, [isFormChanged])

    const subEventsUserStatus = event.subEvents.map((subEvent) => {
      const eventUsersOfSubEvent = eventUsersWithOutOurUser.filter(
        (eventUser) => eventUser.subEventId === subEvent.id
      )
      return {
        id: subEvent.id,
        userStatus: userToEventStatus(
          event,
          user,
          eventUsersOfSubEvent,
          subEvent
        ),
      }
    })

    return (
      <FormWrapper className="gap-y-2">
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
                  onClick={() => setSubEventId(props.id)}
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
                      eventUsersToUse={eventUsersWithOutOurUser}
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
