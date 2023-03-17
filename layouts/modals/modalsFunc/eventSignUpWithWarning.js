import React, { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'

import CheckBox from '@components/CheckBox'
import FormWrapper from '@components/FormWrapper'
import loggedUserAtom from '@state/atoms/loggedUserAtom'
import eventSelector from '@state/selectors/eventSelector'
import formatDateTime from '@helpers/formatDateTime'
import itemsFuncAtom from '@state/atoms/itemsFuncAtom'

const eventSignUpWithWarning = (eventId, status, eventSubtypeNum, comment) => {
  const EventSignUpWithWarningModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
  }) => {
    const loggedUser = useRecoilValue(loggedUserAtom)
    const event = useRecoilValue(eventSelector(eventId))
    const itemsFunc = useRecoilValue(itemsFuncAtom)

    const [check, setCheck] = useState(false)

    const onClickConfirm = async () => {
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
            event_signUpToReserveAfterError(eventId, data.error)
          }
        }
      )
    }

    useEffect(() => {
      setOnConfirmFunc(onClickConfirm)
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
    Children: EventSignUpWithWarningModal,
  }
}

export default eventSignUpWithWarning
