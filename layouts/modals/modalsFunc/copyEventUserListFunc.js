import DateTimeEvent from '@components/DateTimeEvent'
import SpeedDatingEditor from '@components/SpeedDatingEditor'
import { modalsFuncAtom } from '@state/atoms'
import eventSelector from '@state/selectors/eventSelector'
import loggedUserActiveRoleSelector from '@state/selectors/loggedUserActiveRoleSelector'
import { useRecoilValue } from 'recoil'

const copyEventUserListFunc = (eventId) => {
  const CopyEventUserListModal = ({
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

    // const mansNames = mans.map(
    //   (user, index) =>
    //     `${index + 1}. ${getUserFullName(user)}${
    //       user.status === 'member' ? ' (клуб)' : ''
    //     } - ${birthDateToAge(user.birthday)}`
    // )
    // const womansNames = womans.map(
    //   (user, index) =>
    //     `${index + 1}. ${getUserFullName(user)}${
    //       user.status === 'member' ? ' (клуб)' : ''
    //     } - ${birthDateToAge(user.birthday)}`
    // )
    // const mansText = mansNames.length > 0 ? `${mansNames.join(`\n`)}` : null
    // const womansText = womansNames.length > 0 ? `${womansNames.join(`\n`)}` : null

    // return copyToClipboard(
    //   `${mansText ? `Мужчины:\n${mansNames.join(`\n`)}\n\n` : ''}${
    //     womansText ? `Женщины:\n${womansNames.join(`\n`)}` : ''
    //   }`
    // )

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
      </div>
    )
  }

  return {
    title: `Генератор списка участников мероприятия`,
    // confirmButtonName: 'Применить',
    Children: CopyEventUserListModal,
  }
}

export default copyEventUserListFunc
