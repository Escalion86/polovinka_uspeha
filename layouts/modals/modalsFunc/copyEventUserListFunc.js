import Button from '@components/Button'
import CheckBox from '@components/CheckBox'
import ComboBox from '@components/ComboBox'
import DateTimeEvent from '@components/DateTimeEvent'
import FormWrapper from '@components/FormWrapper'
import birthDateToAge from '@helpers/birthDateToAge'
import copyToClipboard from '@helpers/copyToClipboard'
import getUserFullName from '@helpers/getUserFullName'
import useSnackbar from '@helpers/useSnackbar'
// import eventAssistantsSelector from '@state/selectors/eventAssistantsSelector'
// import eventMansSelector from '@state/selectors/eventMansSelector'
// import eventParticipantsFullByEventIdSelector from '@state/selectors/eventParticipantsFullByEventIdSelector'
// import eventWomansSelector from '@state/selectors/eventWomansSelector'
import eventsUsersFullByEventIdSelector from '@state/selectors/eventsUsersFullByEventIdSelector'
import { useEffect, useMemo, useState } from 'react'
import { useAtomValue } from 'jotai'
import eventSelector from '@state/selectors/eventSelector'

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
    const event = useAtomValue(eventSelector(eventId))
    const eventUsers = useAtomValue(eventsUsersFullByEventIdSelector(eventId))
    // const assistants = useAtomValue(eventAssistantsSelector(eventId))
    // const participants = useAtomValue(
    //   eventParticipantsFullByEventIdSelector(eventId)
    // )
    // const mans = useAtomValue(eventMansSelector(eventId))
    // const womans = useAtomValue(eventWomansSelector(eventId))
    const { info } = useSnackbar()

    const [showSecondName, setShowSecondName] = useState(true)
    const [showThirdName, setShowThirdName] = useState(false)
    const [showMember, setShowMember] = useState(true)
    const [showAges, setShowAges] = useState(true)
    const [splitByGender, setSplitByGender] = useState(true)
    const [showAssistants, setShowAssistants] = useState(false)
    const [showReserve, setShowReserve] = useState(false)
    const [sort, setSort] = useState('firstName')
    const isSortByParticipantsNumber = sort === 'likesNumSort'

    useEffect(() => {
      if (isSortByParticipantsNumber && !splitByGender) setSplitByGender(true)
    }, [isSortByParticipantsNumber, splitByGender])

    useEffect(() => {
      if (!event?.likesNumSort && isSortByParticipantsNumber) {
        setSort('firstName')
      }
    }, [event?.likesNumSort, isSortByParticipantsNumber])

    const sortEventUsers = (list) =>
      [...list].sort((a, b) => {
        if (sort === 'likesNumSort') {
          const aNum =
            typeof a?.likeSortNum === 'number'
              ? a.likeSortNum
              : Number.MAX_SAFE_INTEGER
          const bNum =
            typeof b?.likeSortNum === 'number'
              ? b.likeSortNum
              : Number.MAX_SAFE_INTEGER
          if (aNum !== bNum) return aNum - bNum
        }

        if (sort === 'createdAt') {
          const aDate = a?.createdAt ? new Date(a.createdAt).getTime() : 0
          const bDate = b?.createdAt ? new Date(b.createdAt).getTime() : 0
          return aDate - bDate
        }

        const aValue = (a?.user?.[sort] || '').toString()
        const bValue = (b?.user?.[sort] || '').toString()
        return aValue.localeCompare(bValue, 'ru', { sensitivity: 'base' })
      })

    const textFormer = ({ user, status }, index, withNumber = true) =>
      `${withNumber ? `${index + 1}. ` : ''}${
        status === 'assistant'
          ? `[Ведущий] `
          : status === 'reserve'
            ? '[Резерв] '
            : ''
      }${getUserFullName(user, showSecondName, showThirdName)}${
        showMember && user.status === 'member' ? ' (ЗП)' : ''
      }${showAges ? ` - ${birthDateToAge(user.birthday)}` : ''}`

    const sortItems = useMemo(() => {
      const items = [
        { value: 'firstName', name: 'По имени' },
        { value: 'secondName', name: 'По фамилии' },
        { value: 'createdAt', name: 'По дате регистрации' },
      ]
      if (event?.likesNumSort) {
        items.push({
          value: 'likesNumSort',
          name: 'По нумерации участников',
        })
      }
      return items
    }, [event?.likesNumSort])

    var formatedText = ''

    event.subEvents.forEach((subEvent, index) => {
      if (index > 0) formatedText += `\n\n`
      if (event.subEvents.length > 1)
        formatedText += `--- ${subEvent.title} ---\n`
      const eventUsersOfSubEventWithoutAssistants = eventUsers.filter(
        ({ subEventId, status }) =>
          status !== 'assistant' && subEventId === subEvent.id
      )
      const assistants = showAssistants
        ? eventUsers.filter(({ status }) => status === 'assistant')
        : []
      const eventUsersOfSubEvent =
        showAssistants && index === 0
          ? [...eventUsersOfSubEventWithoutAssistants, ...assistants]
          : eventUsersOfSubEventWithoutAssistants
      const eventUsersPrepared =
        showAssistants && showReserve
          ? eventUsersOfSubEvent
          : eventUsersOfSubEvent.filter(
              ({ status }) =>
                (showAssistants || status !== 'assistant') &&
                (showReserve || status !== 'reserve')
            )

      const eventUsersSorted = sortEventUsers(eventUsersPrepared)

      if (splitByGender) {
        const mans = eventUsersSorted.filter(
          ({ user }) => user.gender === 'male'
        )
        const womans = eventUsersSorted.filter(
          ({ user }) => user.gender === 'famale'
        )

        const renderGenderBlock = (usersByGender) => {
          if (!isSortByParticipantsNumber) {
            const usersNames = usersByGender.map(textFormer)
            return usersNames.length > 0 ? `${usersNames.join(`\n`)}` : 'нет'
          }

          const numberedUsers = usersByGender.filter(
            ({ status }) => status === 'participant'
          )
          const notNumberedUsers = usersByGender.filter(
            ({ status }) => status !== 'participant'
          )

          const numberedText =
            numberedUsers.length > 0
              ? numberedUsers
                  .map((eventUser, idx) => {
                    const number =
                      typeof eventUser?.likeSortNum === 'number'
                        ? eventUser.likeSortNum
                        : idx
                    return textFormer(eventUser, number)
                  })
                  .join('\n')
              : 'нет'

          const notNumberedText =
            notNumberedUsers.length > 0
              ? `\nБез нумерации:\n${notNumberedUsers
                  .map((eventUser) => textFormer(eventUser, 0, false))
                  .join('\n')}`
              : ''

          return `${numberedText}${notNumberedText}`
        }

        const mansText = renderGenderBlock(mans)
        const womansText = renderGenderBlock(womans)

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
            label="Показывать принадлежность к закрытому пространству"
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
            disabled={isSortByParticipantsNumber}
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
            className="min-w-24 max-w-60"
            items={[...sortItems]}
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
