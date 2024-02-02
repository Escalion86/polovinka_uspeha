import Button from '@components/Button'
import DateTimeEvent from '@components/DateTimeEvent'
import LikesEditor from '@components/LikesEditor'
import { faHeart, faLock } from '@fortawesome/free-solid-svg-icons'
import itemsFuncAtom from '@state/atoms/itemsFuncAtom'
import eventSelector from '@state/selectors/eventSelector'
import { useRecoilValue } from 'recoil'

const LikesToggle = ({ eventId }) => {
  const event = useRecoilValue(eventSelector(eventId))
  const setEvent = useRecoilValue(itemsFuncAtom).event.set

  const onClick = () => {
    setEvent({
      _id: eventId,
      likesProcessActive: !event.likesProcessActive,
    })
  }

  return (
    <div>
      <Button
        classBgColor={event.likesProcessActive ? 'bg-pink-500' : 'bg-general'}
        // classHoverBgColor="bg-success"
        name={
          event.likesProcessActive ? 'Закрыть и отправить результат' : 'Открыть'
        }
        icon={event.likesProcessActive ? faHeart : faLock}
        onClick={onClick}
      />
    </div>
  )
}

const likesEditFunc = (eventId) => {
  const LikesEditModal = ({
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

    return (
      <div className="flex flex-col">
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
        {!event.likesProcessActive && (
          <div className="text-lg font-bold text-center text-danger">
            Прием лайков закрыт!
          </div>
        )}
        <LikesEditor eventId={eventId} readOnly={!event.likesProcessActive} />
      </div>
    )
  }

  return {
    title: `Редактор Лайков`,
    // confirmButtonName: 'Применить',
    bottomLeftComponent: <LikesToggle eventId={eventId} />,
    Children: LikesEditModal,
  }
}

export default likesEditFunc
