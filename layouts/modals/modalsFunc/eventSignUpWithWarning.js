import CheckBox from '@components/CheckBox'
import FormWrapper from '@components/FormWrapper'
import formatDateTime from '@helpers/formatDateTime'
import goToUrlForAddEventToCalendar from '@helpers/goToUrlForAddEventToCalendar'
// import { asyncEventsUsersByEventIdSelector } from '@state/asyncSelectors/asyncEventsUsersByEventIdAtom'
import itemsFuncAtom from '@state/atoms/itemsFuncAtom'
import loggedUserAtom from '@state/atoms/loggedUserAtom'
import { useEffect, useState } from 'react'
import {
  // useRecoilRefresher_UNSTABLE,
  useRecoilValue,
} from 'recoil'

const eventSignUpWithWarning = (
  event,
  status,
  eventSubtypeNum,
  comment,
  fixEventStatus,
  eventSignUpToReserveAfterError
) => {
  const EventSignUpWithWarningModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnConfirm2Func,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
  }) => {
    const loggedUser = useRecoilValue(loggedUserAtom)
    const itemsFunc = useRecoilValue(itemsFuncAtom)

    const [check, setCheck] = useState(false)

    const eventId = event._id

    // const refreshEventState = useRecoilRefresher_UNSTABLE(
    //   asyncEventsUsersByEventIdSelector(eventId)
    // )

    const onClickConfirm = async (onSuccess) => {
      closeModal()
      itemsFunc.event.signUp(
        {
          eventId,
          userId: loggedUser?._id,
          status,
          userStatus: loggedUser.status,
          eventSubtypeNum,
          comment,
        },
        (data) => {
          if (data.error === 'мероприятие закрыто') {
            fixEventStatus(eventId, 'closed')
          }
          if (data.error === 'мероприятие отменено') {
            fixEventStatus(eventId, 'canceled')
          }
          if (data.solution === 'reserve') {
            // refreshEventState()
            eventSignUpToReserveAfterError(
              event,
              data.error,
              eventSubtypeNum,
              comment
            )
          }
        },
        (data) => {
          if (typeof onSuccess === 'function') onSuccess()
        }
      )
    }

    useEffect(() => {
      setOnConfirmFunc(onClickConfirm)
      setOnConfirm2Func(() =>
        onClickConfirm(() => goToUrlForAddEventToCalendar(event))
      )
      setDisableConfirm(!check)
    }, [check])

    return (
      <FormWrapper className="gap-y-2">
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
          // labelPos="left"
          onClick={() => setCheck((checked) => !checked)}
          label="Я сознательно и добровольно беру на себя ответственность за эти риски - как известные, так и неизвестные, в том числе риски, возникшие по причине халатности со стороны лиц, освобождённых от ответственности или иных лиц, и принимаю на себя полную ответственность за мое участие в этом мероприятии"
          required
          error={!check}
          big
        />
        <div className="text-danger leading-[0.875rem]">
          Для записи на мероприятие необходимо поставить галочку, таким образом
          приняв соглашение о рисках
        </div>
      </FormWrapper>
    )
  }

  const postfixStatus = status === 'reserve' ? ' в резерв' : ''

  return {
    title: `Запись${postfixStatus} на мероприятие`,
    text: `Вы уверены что хотите записаться${postfixStatus} на мероприятие?`,
    confirmButtonName: `Записаться${postfixStatus}`,
    // ADD
    confirmButtonName2: `Записаться в резерв и добавить в календарь`,
    Children: EventSignUpWithWarningModal,
  }
}

export default eventSignUpWithWarning
