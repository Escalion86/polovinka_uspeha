import Button from '@components/Button'
import DateTimeEvent from '@components/DateTimeEvent'
import FormWrapper from '@components/FormWrapper'
import Note from '@components/Note'
import { faCalendarPlus } from '@fortawesome/free-regular-svg-icons'

import goToUrlForAddEventToCalendar from '@helpers/goToUrlForAddEventToCalendar'

const eventAfterSignUpMessageFunc = (event, status) => {
  const isReserve = status === 'reserve'

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
        {isReserve ? (
          <div>
            Вы записались в резерв мероприятия, а это значит, что на текущий
            момент мест на мероприятии нет, но не расстраивайтесь, довольно
            часто места на мероприятия освобождаются и как только появится
            свободное место - с Вами свяжется администратор по актуальности
            записи, а также вопросам оплаты и организации!
          </div>
        ) : (
          <div>
            За несколько дней до начала мероприятия с Вами свяжется
            администратор по вопросам оплаты и организации!
          </div>
        )}

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

  const postfixStatus = isReserve ? ' в резерв' : ''

  return {
    title: `Успешная запись ${postfixStatus} на мероприятие`,
    confirmButtonName: `Понятно`,
    confirmButtonName2: `Добавить в календарь`,
    Children: EventAfterSignUpMessageModal,
  }
}

export default eventAfterSignUpMessageFunc
