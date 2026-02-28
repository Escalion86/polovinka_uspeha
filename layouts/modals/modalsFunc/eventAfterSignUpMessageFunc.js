import DateTimeEvent from '@components/DateTimeEvent'
import Button from '@components/Button'
import FormWrapper from '@components/FormWrapper'
import Note from '@components/Note'
import { getData } from '@helpers/CRUD'
import locationAtom from '@state/atoms/locationAtom'
import modalsAtom from '@state/atoms/modalsAtom'
import useRouter from '@utils/useRouter'
import { useAtomValue, useSetAtom } from 'jotai'
import { useEffect, useState } from 'react'

const eventAfterSignUpMessageFunc = (event, status, comment, subEventId) => {
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
    const router = useRouter()
    const location = useAtomValue(locationAtom)
    const setModals = useSetAtom(modalsAtom)
    const [isGoogleCalendarConnected, setIsGoogleCalendarConnected] = useState(true)

    useEffect(() => {
      let cancelled = false

      const loadGoogleCalendarState = async () => {
        if (!location) return
        const response = await getData(
          `/api/${location}/google-calendar`,
          {},
          null,
          null,
          true
        )
        if (cancelled || !response?.success) return
        setIsGoogleCalendarConnected(Boolean(response?.data?.connected))
      }

      loadGoogleCalendarState()

      return () => {
        cancelled = true
      }
    }, [location])

    // const [check, setCheck] = useState(false)

    // useEffect(() => {
    //   setOnConfirmFunc(closeModal)
    //   setOnConfirm2Func(() =>
    //     onClickConfirm(() => goToUrlForAddEventToCalendar(event))
    //   )
    // }, [check, event.warning])

    // if (!event.warning) return null
    const subEvent =
      event?.subEvents?.length > 1 && subEventId
        ? event?.subEvents.find(({ id }) => id === subEventId)
        : undefined

    return (
      <FormWrapper>
        {/* <div>{`Вы успешно записались${postfixStatus} на мероприятие`}</div> */}
        <div className="text-lg font-bold text-center whitespace-pre-line text-general">
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
        {subEvent && (
          <div>
            Вариант записи на мероприятие: <strong>{subEvent.title}</strong>
          </div>
        )}
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
        {!isGoogleCalendarConnected && (
          <Note className="mt-3">
            Вы можете подключить календарь в опции{' '}
            <strong>«Интеграция Google Календаря»</strong>, чтобы запись на
            мероприятие автоматически добавлялась в ваш Google Календарь.
            <div className="mt-3 flex justify-center">
              <Button
                name="Перейти на страницу интеграции Google календаря"
                thin
                onClick={() => {
                  setModals([])
                  router.push(`/${location}/cabinet/googleCalendarIntegration`)
                }}
              />
            </div>
          </Note>
        )}
      </FormWrapper>
    )
  }

  const postfixStatus = isReserve ? ' в резерв' : ''

  return {
    title: `Успешная запись ${postfixStatus} на мероприятие`,
    confirmButtonName: `Понятно`,
    Children: EventAfterSignUpMessageModal,
  }
}

export default eventAfterSignUpMessageFunc
