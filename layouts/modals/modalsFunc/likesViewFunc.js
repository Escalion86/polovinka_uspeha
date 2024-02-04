import Button from '@components/Button'
import DateTimeEvent from '@components/DateTimeEvent'
import LikesViewer from '@components/LikesViewer'
import Note from '@components/Note'
import {
  faCheck,
  faEye,
  faEyeSlash,
  faGenderless,
  faHeart,
  faLock,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
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

const likesViewFunc = (eventId) => {
  const LikesViewModal = ({
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
        {!event.likesProcessActive ? (
          <>
            <div className="text-lg font-bold text-center text-danger">
              Прием лайков закрыт!
            </div>
            <Note>
              <div className="flex gap-x-1">
                <FontAwesomeIcon
                  className="w-6 h-6 text-success min-w-6 min-h-6 -mt-0.5"
                  icon={faEye}
                />
                <div> - Посмотрел результат совпадений</div>
              </div>
              <div className="flex gap-x-1">
                <FontAwesomeIcon
                  className="w-6 h-6 text-danger min-w-6 min-h-6 -mt-0.5"
                  icon={faEyeSlash}
                />
                <div> - Не смотрел результат совпадений</div>
              </div>
            </Note>
          </>
        ) : (
          <>
            <Note>
              <div className="flex gap-x-1">
                <FontAwesomeIcon
                  className="w-6 h-6 text-gray-400 min-w-6 min-h-6 -mt-0.5"
                  icon={faGenderless}
                />
                <div>- Пользователь не делал никакой выбор</div>
              </div>
              <div className="flex gap-x-1">
                <FontAwesomeIcon
                  className="w-6 h-6 min-w-6 min-h-6 text-success -mt-0.5"
                  icon={faCheck}
                />
                <div>
                  - Пользователь сделал выбор (если не выбрано никого, значит
                  пользователь указал, что никого не хочет выбирать)
                </div>
              </div>
            </Note>
          </>
        )}
        <LikesViewer eventId={eventId} readOnly={!event.likesProcessActive} />
      </div>
    )
  }

  return {
    title: `Просмотр Лайков`,
    // confirmButtonName: 'Применить',
    bottomLeftComponent: <LikesToggle eventId={eventId} />,
    Children: LikesViewModal,
  }
}

export default likesViewFunc
