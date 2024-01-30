import DateTimeEvent from '@components/DateTimeEvent'
import SpeedDatingEditor from '@components/SpeedDatingEditor'
import { modalsFuncAtom } from '@state/atoms'
import eventAssistantsSelector from '@state/selectors/eventAssistantsSelector'
import eventMansSelector from '@state/selectors/eventMansSelector'
import eventSelector from '@state/selectors/eventSelector'
import eventWomansSelector from '@state/selectors/eventWomansSelector'
import loggedUserActiveRoleSelector from '@state/selectors/loggedUserActiveRoleSelector'
import { useRecoilValue } from 'recoil'

const speedDatingFunc = (eventId) => {
  const SpeedDatingModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
    setOnlyCloseButtonShow,
    setBottomLeftButtonProps,
    setTopLeftComponent,
  }) => {
    const event = useRecoilValue(eventSelector(eventId))
    const eventAssistants = useRecoilValue(eventAssistantsSelector(eventId))
    const eventMans = useRecoilValue(eventMansSelector(eventId))
    const eventWomans = useRecoilValue(eventWomansSelector(eventId))

    return (
      <div className="flex flex-col">
        {/* <div className="text-lg font-bold text-center text-general">
          {event.title}
        </div> */}
        <DateTimeEvent
          wrapperClassName="mb-1 text-base laptop:text-lg font-bold justify-center"
          dateClassName="text-general"
          timeClassName="italic"
          durationClassName="italic text-base font-normal"
          event={event}
          showDayOfWeek
          fullMonth
        />
        <SpeedDatingEditor eventId={eventId} />
      </div>
    )
  }

  return {
    title: `Калькулятор "Быстрые свидания"`,
    // confirmButtonName: 'Применить',
    Children: SpeedDatingModal,
  }
}

export default speedDatingFunc
