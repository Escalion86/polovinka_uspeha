import CheckBox from '@components/CheckBox'
import EventUsersCounterAndAge from '@components/EventUsersCounterAndAge'
import FormWrapper from '@components/FormWrapper'
import PriceDiscount from '@components/PriceDiscount'
import UserRelationshipIcon from '@components/UserRelationshipIcon'
import { faCancel, faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import formatDateTime from '@helpers/formatDateTime'
import userToEventStatus from '@helpers/userToEventStatus'
import itemsFuncAtom from '@state/atoms/itemsFuncAtom'
import loggedUserAtom from '@state/atoms/loggedUserAtom'
import eventsUsersFullByEventIdSelector from '@state/selectors/eventsUsersFullByEventIdSelector'
import cn from 'classnames'
import DOMPurify from 'isomorphic-dompurify'
import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'

const eventSignUpFunc = (
  event,
  status,
  comment,
  fixEventStatus,
  eventSignUpToReserveAfterError,
  onSuccess
) => {
  const isReserve = status === 'reserve'

  const EventSignUpModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnConfirm2Func,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
    setConfirmButtonName,
  }) => {
    const loggedUser = useRecoilValue(loggedUserAtom)
    const itemsFunc = useRecoilValue(itemsFuncAtom)
    const eventUsers = useRecoilValue(
      eventsUsersFullByEventIdSelector(event._id)
    )

    const [check, setCheck] = useState(false)
    const [subEventId, setSubEventId] = useState(
      event.subEvents.length > 1 ? undefined : event.subEvents[0].id
    )

    const eventId = event._id

    const onClickConfirm = async () => {
      closeModal()
      itemsFunc.event.signUp(
        {
          eventId,
          userId: loggedUser?._id,
          status,
          userStatus: loggedUser.status,
          comment,
          subEventId,
        },
        (data) => {
          if (data.error === 'мероприятие закрыто') {
            fixEventStatus(eventId, 'closed')
          }
          if (data.error === 'мероприятие отменено') {
            fixEventStatus(eventId, 'canceled')
          }
          if (data.solution === 'reserve') {
            eventSignUpToReserveAfterError(
              event,
              data.error,
              comment,
              subEventId
            )
          }
        },
        (data) => {
          if (typeof onSuccess === 'function') onSuccess(data)
        }
      )
    }

    const subEventsUserStatus = event.subEvents.map((subEvent) => {
      const eventUsersOfSubEvent = eventUsers.filter(
        (eventUser) => eventUser.subEventId === subEvent.id
      )
      return {
        id: subEvent.id,
        userStatus: userToEventStatus(
          event,
          loggedUser,
          eventUsersOfSubEvent,
          subEvent
        ),
      }
    })

    useEffect(() => {
      const subEventUserStatus = subEventId
        ? subEventsUserStatus.find((s) => s.id === subEventId)?.userStatus
        : undefined
      setOnConfirmFunc(onClickConfirm)
      setDisableConfirm(
        !subEventId ||
          (!subEventUserStatus.canSignIn &&
            !subEventUserStatus.canSignInReserve) ||
          (event.warning && !check)
      )
      if (subEventId)
        setConfirmButtonName(
          subEventUserStatus.canSignIn
            ? 'Записаться'
            : subEventUserStatus.canSignInReserve
              ? 'Записаться в резерв'
              : 'Не доступно'
        )
    }, [check, event.warning, subEventId])

    return (
      <FormWrapper className="gap-y-2">
        {event.subEvents?.length > 1 && (
          <div className="flex flex-col py-1 gap-y-1">
            <div className="font-bold text-general">
              Выберите тип участия на мероприятии
            </div>
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
                  onClick={canCheck ? () => setSubEventId(props.id) : undefined}
                >
                  <div className="flex items-center border-b border-gray-300 gap-x-1">
                    <div
                      className={cn(
                        'flex items-center justify-center w-12 h-12 min-w-10 min-h-10 border-r border-gray-300'
                      )}
                    >
                      {selected && (
                        <FontAwesomeIcon
                          className="w-10 h-10 text-success"
                          icon={faCheck}
                        />
                      )}
                      {!canCheck && (
                        <FontAwesomeIcon
                          className="w-10 h-10 text-danger"
                          icon={faCancel}
                        />
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
                      showAges={false}
                      dontShowLabel
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
        {event.warning ? (
          <>
            <div className="text-text leading-[0.875rem]">{`Данное мероприятие предполагает наличие рисков получения травм. Несмотря на то, что соблюдение определённых правил, технических норм, использование специального оборудования и личная дисциплина могут снизить эти риски, опасность получения серьезных травм остаётся. Вы должны осозновать, что мероприятие "${
              event.title
            }" от ${formatDateTime(
              event?.dateStart,
              true,
              false,
              false
            )} является тем видом активности, который может повлечь получение серьёзных травм.`}</div>
            <CheckBox
              checked={check}
              onClick={() => setCheck((checked) => !checked)}
              label="Я сознательно и добровольно беру на себя ответственность за эти риски - как известные, так и неизвестные, в том числе риски, возникшие по причине халатности со стороны лиц, освобождённых от ответственности или иных лиц, и принимаю на себя полную ответственность за мое участие в этом мероприятии"
              required
              error={!check}
              big
            />
            <div className="text-danger leading-[0.875rem]">
              Для записи на мероприятие необходимо поставить галочку, таким
              образом приняв соглашение о рисках
            </div>
          </>
        ) : (
          event.subEvents?.length <= 1 && (
            <div>
              Вы уверены что хотите записаться{postfixStatus} на мероприятие?
            </div>
          )
        )}
      </FormWrapper>
    )
  }

  const postfixStatus = isReserve ? ' в резерв' : ''

  return {
    title: `Запись${postfixStatus} на мероприятие`,
    text: (
      <div className="flex flex-col gap-y-2">
        {isReserve && (
          <div>
            К сожалению, на текущий момент, мест на мероприятии нет, но не
            расстраивайтесь, довольно часто места на мероприятия освобождаются и
            как только появится свободное место - с Вами свяжется администратор
            по актуальности записи!
          </div>
        )}
        {/* <div>
          Вы уверены что хотите записаться{postfixStatus} на мероприятие?
        </div> */}
      </div>
    ),
    confirmButtonName: `Записаться${postfixStatus}`,
    Children: EventSignUpModal,
  }
}

export default eventSignUpFunc
