import Button from '@components/Button'
import CheckBox from '@components/CheckBox'
import ComboBox from '@components/ComboBox'
import DateTimeEvent from '@components/DateTimeEvent'
import FormWrapper from '@components/FormWrapper'
import birthDateToAge from '@helpers/birthDateToAge'
import copyToClipboard from '@helpers/copyToClipboard'
import getUserFullName from '@helpers/getUserFullName'
import useSnackbar from '@helpers/useSnackbar'
import eventAssistantsSelector from '@state/selectors/eventAssistantsSelector'
import eventMansSelector from '@state/selectors/eventMansSelector'
import eventParticipantsFullByEventIdSelector from '@state/selectors/eventParticipantsFullByEventIdSelector'
import eventSelector from '@state/selectors/eventSelector'
import eventWomansSelector from '@state/selectors/eventWomansSelector'
import eventsUsersFullByEventIdSelector from '@state/selectors/eventsUsersFullByEventIdSelector'
import { useState } from 'react'
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
    const eventUsers = useRecoilValue(eventsUsersFullByEventIdSelector(eventId))
    // const assistants = useRecoilValue(eventAssistantsSelector(eventId))
    // const participants = useRecoilValue(
    //   eventParticipantsFullByEventIdSelector(eventId)
    // )
    // const mans = useRecoilValue(eventMansSelector(eventId))
    // const womans = useRecoilValue(eventWomansSelector(eventId))
    const { info } = useSnackbar()

    const [showSecondName, setShowSecondName] = useState(true)
    const [showThirdName, setShowThirdName] = useState(false)
    const [showMember, setShowMember] = useState(true)
    const [showAges, setShowAges] = useState(true)
    const [splitByGender, setSplitByGender] = useState(true)
    const [showAssistants, setShowAssistants] = useState(false)
    const [showReserve, setShowReserve] = useState(false)
    const [sort, setSort] = useState('firstName')

    const textFormer = ({ user, status }, index) =>
      `${index + 1}. ${
        status === 'assistant'
          ? `[Ведущий] `
          : status === 'reserve'
            ? '[Резерв] '
            : ''
      }${getUserFullName(user, showSecondName, showThirdName)}${
        showMember && user.status === 'member' ? ' (клуб)' : ''
      }${showAges ? ` - ${birthDateToAge(user.birthday)}` : ''}`

    var formatedText = ''

    event.subEvents.forEach((subEvent, index) => {
      if (index > 0) formatedText += `\n\n`
      if (event.subEvents.length > 1)
        formatedText += `--- ${subEvent.title} ---\n`
      const eventUsersOfSubEvent = eventUsers.filter(
        ({ subEventId }) => subEventId === subEvent.id
      )
      const eventUsersPrepared =
        showAssistants && showReserve
          ? eventUsersOfSubEvent
          : eventUsersOfSubEvent.filter(
              ({ status }) =>
                (showAssistants || status !== 'assistant') &&
                (showReserve || status !== 'reserve')
            )

      const eventUsersSorted = [...eventUsersPrepared].sort((a, b) =>
        a.user[sort] > b.user[sort] ? 1 : -1
      )

      if (splitByGender) {
        const mans = eventUsersSorted.filter(
          ({ user }) => user.gender === 'male'
        )
        const womans = eventUsersSorted.filter(
          ({ user }) => user.gender === 'famale'
        )

        const mansNames = mans.map(textFormer)
        const womansNames = womans.map(textFormer)
        const mansText =
          mansNames.length > 0 ? `${mansNames.join(`\n`)}` : 'нет'
        const womansText =
          womansNames.length > 0 ? `${womansNames.join(`\n`)}` : 'нет'

        formatedText += `Мужчины:\n${mansText}\nЖенщины:\n${womansText}`
      } else {
        const names = eventUsersSorted.map(textFormer)
        formatedText += names.length > 0 ? `${names.join(`\n`)}` : 'нет'
      }
    })

    const copyText = () => {
      copyToClipboard(formatedText)
      info('Список участников скопирован в буфер обмена')
    }

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
        <FormWrapper>
          <CheckBox
            checked={showSecondName}
            labelPos="left"
            onClick={() => setShowSecondName((checked) => !checked)}
            label="Показывать Фамилию"
          />
          <CheckBox
            checked={showThirdName}
            labelPos="left"
            onClick={() => setShowThirdName((checked) => !checked)}
            label="Показывать Отчество"
          />
          <CheckBox
            checked={showMember}
            labelPos="left"
            onClick={() => setShowMember((checked) => !checked)}
            label="Показывать принадлежность к клубу"
          />
          <CheckBox
            checked={showAges}
            labelPos="left"
            onClick={() => setShowAges((checked) => !checked)}
            label="Показывать возраст"
          />
          <CheckBox
            checked={splitByGender}
            labelPos="left"
            onClick={() => setSplitByGender((checked) => !checked)}
            label="Разбить список по полу"
          />
          <CheckBox
            checked={showAssistants}
            labelPos="left"
            onClick={() => setShowAssistants((checked) => !checked)}
            label="Показывать Ведущих в списке (если есть)"
          />
          <CheckBox
            checked={showReserve}
            labelPos="left"
            onClick={() => setShowReserve((checked) => !checked)}
            label="Показывать Резервных в списке (если есть)"
          />
          <ComboBox
            label="Сортировка"
            className="min-w-24 max-w-40"
            items={[
              { value: 'firstName', name: 'По имени' },
              { value: 'secondName', name: 'По фамилии' },
            ]}
            value={sort}
            onChange={setSort}
          />
          <Button name="Копировать в буфер обмена" onClick={copyText} />
        </FormWrapper>
        <div className="font-bold">Результат:</div>
        <pre>{formatedText}</pre>
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
