import FormWrapper from '@components/FormWrapper'
import Textarea from '@components/Textarea'
import { SelectUserList } from '@components/SelectItemList'
import { SelectEvent } from '@components/SelectItem'
import ComboBox from '@components/ComboBox'
import useSnackbar from '@helpers/useSnackbar'
import { postData } from '@helpers/CRUD'
import achievementsAtom from '@state/atoms/achievementsAtom'
import achievementsUsersAtom from '@state/atoms/achievementsUsersAtom'
import eventsAtom from '@state/atoms/eventsAtom'
import locationAtom from '@state/atoms/locationAtom'
import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'
import { useAtom, useAtomValue } from 'jotai'
import { useEffect, useMemo, useState } from 'react'

const achievementIssueFunc = () => {
  const AchievementIssueModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
  }) => {
    const snackbar = useSnackbar()
    const location = useAtomValue(locationAtom)
    const loggedUser = useAtomValue(loggedUserActiveAtom)
    const achievements = useAtomValue(achievementsAtom)
    const events = useAtomValue(eventsAtom)
    const [achievementsUsers, setAchievementsUsers] = useAtom(
      achievementsUsersAtom
    )

    const [selectedUsersIds, setSelectedUsersIds] = useState([])
    const [selectedAchievementId, setSelectedAchievementId] = useState('')
    const [selectedEventId, setSelectedEventId] = useState('')
    const [comment, setComment] = useState('')
    const [isIssuing, setIsIssuing] = useState(false)

    const achievementsOptions = useMemo(
      () =>
        achievements.map(({ _id, name }) => ({
          value: String(_id),
          name: name?.trim() || 'Без названия',
        })),
      [achievements]
    )

    const selectedEvent = useMemo(
      () => events.find(({ _id }) => String(_id) === String(selectedEventId)),
      [events, selectedEventId]
    )

    const isDisabled =
      !selectedAchievementId || selectedUsersIds.length === 0 || isIssuing

    const hasChanges =
      selectedUsersIds.length > 0 ||
      selectedAchievementId ||
      selectedEventId ||
      comment.trim()

    useEffect(() => {
      setDisableConfirm(isDisabled)
      setOnShowOnCloseConfirmDialog(hasChanges && !isIssuing)
    }, [isDisabled, hasChanges, isIssuing])

    useEffect(() => {
      setOnConfirmFunc(() => async () => {
        if (isDisabled) return

        setIsIssuing(true)
        const createdRecords = []
        const skippedUsers = []
        const normalizedAchievementId = String(selectedAchievementId)
        const normalizedEventId = selectedEventId
          ? String(selectedEventId)
          : null

        try {
          for (const userId of selectedUsersIds) {
            const userAssignments = (achievementsUsers ?? []).filter(
              (item) =>
                String(item.achievementId) === normalizedAchievementId &&
                String(item.userId) === String(userId)
            )

            const hasSameEvent = userAssignments.some((item) => {
              const itemEventId = item.eventId ? String(item.eventId) : null
              if (!itemEventId && !normalizedEventId) return false
              return itemEventId === normalizedEventId
            })

            if (hasSameEvent) {
              skippedUsers.push(userId)
              continue
            }

            const payload = {
              achievementId: selectedAchievementId,
              userId,
              eventId: selectedEventId || null,
              eventName: selectedEvent?.title ?? '',
              comment: comment.trim(),
            }

            const created = await postData(
              `/api/${location}/achievementsusers`,
              payload,
              null,
              null,
              false,
              loggedUser?._id
            )

            if (created) createdRecords.push(created)
          }

          if (createdRecords.length > 0) {
            setAchievementsUsers((state) => [...state, ...createdRecords])
            snackbar.success(
              `Достижение выдано ${createdRecords.length} пользовател${
                createdRecords.length === 1 ? 'ю' : 'ям'
              }`
            )
          }

          if (skippedUsers.length > 0) {
            snackbar.info(
              `Пропущено ${skippedUsers.length} пользовател${
                skippedUsers.length === 1 ? 'я' : 'ей'
              } с уже выданным достижением для выбранного мероприятия`
            )
          }

          closeModal()
        } catch (error) {
          snackbar.error('Не удалось выдать достижение')
        } finally {
          setIsIssuing(false)
        }
      })
    }, [
      selectedAchievementId,
      selectedUsersIds,
      selectedEventId,
      comment,
      isDisabled,
      achievementsUsers,
      selectedEvent,
      location,
      loggedUser,
      closeModal,
      setAchievementsUsers,
      snackbar,
    ])

    return (
      <FormWrapper className="flex flex-col gap-y-3">
        <SelectUserList
          label="Пользователи"
          usersId={selectedUsersIds}
          onChange={(users) =>
            setSelectedUsersIds(
              Array.isArray(users)
                ? users.map((user) => (user?._id ? user._id : user)).filter(Boolean)
                : []
            )
          }
          canSelectNone={false}
          required
          showCounter
        />
        <ComboBox
          label="Достижение"
          value={selectedAchievementId}
          onChange={(value) => setSelectedAchievementId(value ?? '')}
          items={achievementsOptions}
          placeholder="Не выбрано"
          required
        />
        <SelectEvent
          label="Мероприятие (опционально)"
          selectedId={selectedEventId}
          onChange={(value) => setSelectedEventId(value ?? '')}
          clearButton
          rounded
          bordered
        />
        <Textarea
          label="Комментарий (опционально)"
          value={comment}
          onChange={setComment}
          rows={3}
        />
      </FormWrapper>
    )
  }

  return {
    title: 'Выдача достижений',
    confirmButtonName: 'Выдать',
    Children: AchievementIssueModal,
  }
}

export default achievementIssueFunc
