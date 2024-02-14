import CheckBox from '@components/CheckBox'
import FormWrapper from '@components/FormWrapper'
import formatDateTime from '@helpers/formatDateTime'
import itemsFuncAtom from '@state/atoms/itemsFuncAtom'
import loggedUserAtom from '@state/atoms/loggedUserAtom'
import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'

const eventSignUpFunc = (
  event,
  status,
  subTypeId,
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
  }) => {
    const loggedUser = useRecoilValue(loggedUserAtom)
    const itemsFunc = useRecoilValue(itemsFuncAtom)

    const [check, setCheck] = useState(false)

    const eventId = event._id

    const onClickConfirm = async () => {
      closeModal()
      itemsFunc.event.signUp(
        {
          eventId,
          userId: loggedUser?._id,
          status,
          userStatus: loggedUser.status,
          subTypeId,
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
            eventSignUpToReserveAfterError(
              event,
              data.error,
              subTypeId,
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
      setDisableConfirm(event.warning && !check)
    }, [check, event.warning])

    if (!event.warning) return null

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
        <div>
          Вы уверены что хотите записаться{postfixStatus} на мероприятие?
        </div>
      </div>
    ),
    confirmButtonName: `Записаться${postfixStatus}`,
    Children: EventSignUpModal,
  }
}

export default eventSignUpFunc
