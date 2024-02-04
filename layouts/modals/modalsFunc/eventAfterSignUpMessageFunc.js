import Button from '@components/Button'
import CheckBox from '@components/CheckBox'
import DateTimeEvent from '@components/DateTimeEvent'
import FormWrapper from '@components/FormWrapper'
import Note from '@components/Note'
import { faCalendarPlus } from '@fortawesome/free-regular-svg-icons'
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

const eventAfterSignUpMessageFunc = (event, status) => {
  const EventAfterSignUpMessageModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnConfirm2Func,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
  }) => {
    // const [check, setCheck] = useState(false)

    // useEffect(() => {
    //   setOnConfirmFunc(closeModal)
    //   setOnConfirm2Func(() =>
    //     onClickConfirm(() => goToUrlForAddEventToCalendar(event))
    //   )
    // }, [check, event.warning])

    // if (!event.warning) return null

    return (
      <FormWrapper>
        {/* <div>{`Вы успешно записались${postfixStatus} на мероприятие`}</div> */}
        <div className="text-lg font-bold text-center text-general">
          {event.title}
        </div>
        <DateTimeEvent
          wrapperClassName="mb-1 text-base laptop:text-lg font-bold justify-center"
          dateClassName="text-general"
          timeClassName="italic"
          durationClassName="italic text-base font-normal"
          event={event}
          showDayOfWeek
          fullMonth
        />
        <div>
          За несколько дней до начала мероприятия с Вами свяжется администратор
          по вопросам оплаты и организации!
        </div>
        <Note>
          {`Вы можете добавить это мероприятие в Google календарь, для этого кликните по
          кнопке ниже`}
        </Note>
        <Button
          name="Добавить в календарь"
          icon={faCalendarPlus}
          onClick={() => goToUrlForAddEventToCalendar(event)}
        />
      </FormWrapper>
    )
  }

  const postfixStatus = status === 'reserve' ? ' в резерв' : ''

  return {
    title: `Успешная запись ${postfixStatus} на мероприятие`,
    confirmButtonName: `Понятно`,
    confirmButtonName2: `Добавить в календарь`,
    Children: EventAfterSignUpMessageModal,
  }
}

export default eventAfterSignUpMessageFunc
