'use client'

import { useEffect, useMemo, useState } from 'react'
import { useAtom, useAtomValue } from 'jotai'
import Image from 'next/image'

import Button from '@components/Button'
import FormWrapper from '@components/FormWrapper'
import LoadingSpinner from '@components/LoadingSpinner'
import Textarea from '@components/Textarea'
import achievementsAtom from '@state/atoms/achievementsAtom'
import achievementsUsersAtom from '@state/atoms/achievementsUsersAtom'
import eventsAtom from '@state/atoms/eventsAtom'
import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'
import locationAtom from '@state/atoms/locationAtom'
import modalsFuncAtom from '@state/modalsFuncAtom'
import usersAtomAsync from '@state/async/usersAtomAsync'
import { postData, putData, deleteData } from '@helpers/CRUD'
import useSnackbar from '@helpers/useSnackbar'
import getUserFullName from '@helpers/getUserFullName'
import formatDateTime from '@helpers/formatDateTime'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen } from '@fortawesome/free-solid-svg-icons/faPen'
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash'
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus'

const AchievementTile = ({
  achievement,
  onEdit,
  onDelete,
  isDeleting,
  isSaving,
}) => {
  const name = achievement?.name?.trim() || 'Достижение'
  const description = achievement?.description?.trim()
  const hasImage = Boolean(achievement?.image)

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="relative aspect-[4/3] w-full overflow-hidden group">
        {hasImage ? (
          <Image
            src={achievement.image}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 300px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-100 text-xs font-semibold uppercase tracking-wide text-gray-400">
            Нет изображения
          </div>
        )}
        <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/60 via-black/25 to-transparent p-3 text-white">
          <div className="text-sm font-semibold leading-tight line-clamp-2">
            {name}
          </div>
          <div className="flex flex-wrap gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded bg-white/85 px-3 py-1 text-xs font-semibold text-gray-900 shadow-sm transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-70"
              onClick={onEdit}
              disabled={isSaving || isDeleting}
            >
              <FontAwesomeIcon icon={faPen} className="h-3.5 w-3.5" />
              Редактировать
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded bg-red-600/85 px-3 py-1 text-xs font-semibold text-white shadow-sm transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-70"
              onClick={onDelete}
              disabled={isDeleting}
            >
              <FontAwesomeIcon icon={faTrash} className="h-3.5 w-3.5" />
              Удалить
            </button>
          </div>
        </div>
        {(isSaving || isDeleting) && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70">
            <LoadingSpinner size="xs" />
          </div>
        )}
      </div>
      {description && (
        <div className="px-3 pb-3 text-sm text-gray-600 whitespace-pre-line">
          {description}
        </div>
      )}
    </div>
  )
}

const AddAchievementTile = ({ onClick, disabled, loading }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled || loading}
    className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-gray-300 bg-white text-gray-500 shadow-sm transition hover:border-general hover:text-general disabled:cursor-not-allowed disabled:opacity-60"
  >
    {loading ? (
      <LoadingSpinner size="xs" />
    ) : (
      <>
        <span className="flex h-12 w-12 items-center justify-center rounded-full border border-current">
          <FontAwesomeIcon icon={faPlus} className="h-5 w-5" />
        </span>
        <span className="text-sm font-semibold">Новое достижение</span>
      </>
    )}
  </button>
)

const SettingsAchievementsContent = () => {
  const snackbar = useSnackbar()
  const location = useAtomValue(locationAtom)
  const loggedUser = useAtomValue(loggedUserActiveAtom)
  const modalsFunc = useAtomValue(modalsFuncAtom)
  const events = useAtomValue(eventsAtom)
  const users = useAtomValue(usersAtomAsync)

  const [achievements, setAchievements] = useAtom(achievementsAtom)
  const [achievementsUsers, setAchievementsUsers] = useAtom(achievementsUsersAtom)

  const [selectedUsers, setSelectedUsers] = useState([])
  const [selectedAchievementId, setSelectedAchievementId] = useState('')
  const [selectedEventId, setSelectedEventId] = useState('')
  const [issueComment, setIssueComment] = useState('')
  const [isIssuing, setIssuing] = useState(false)
  const [isCreating, setCreating] = useState(false)
  const [savingIds, setSavingIds] = useState([])
  const [deletingIds, setDeletingIds] = useState([])
  const [removingUserAchievementIds, setRemovingUserAchievementIds] = useState([])

  useEffect(() => {
    if (
      selectedAchievementId &&
      !achievements.some(
        ({ _id }) => String(_id) === String(selectedAchievementId)
      )
    ) {
      setSelectedAchievementId('')
    }
  }, [achievements, selectedAchievementId])

  const openCreateAchievementModal = () => {
    modalsFunc.achievement.create(async (values) => {
      if (isCreating) return

      setCreating(true)
      const payload = {
        name: values.name?.trim() ?? '',
        description: values.description?.trim() ?? '',
        image: values.image ?? '',
      }

      try {
        const created = await postData(
          `/api/${location}/achievements`,
          payload,
          null,
          null,
          false,
          loggedUser?._id
        )

        if (created) {
          setAchievements((state) => [...state, created])
          snackbar.success('Достижение создано')
        }
      } catch (error) {
        snackbar.error('Не удалось создать достижение')
      } finally {
        setCreating(false)
      }
    })
  }

  const openEditAchievementModal = (achievement) => {
    if (!achievement?._id) return

    modalsFunc.achievement.edit(achievement, async (values) => {
      const payload = {
        name: values.name?.trim() ?? '',
        description: values.description?.trim() ?? '',
        image: values.image ?? '',
      }

      const hasChanges =
        payload.name !== (achievement.name ?? '') ||
        payload.description !== (achievement.description ?? '') ||
        payload.image !== (achievement.image ?? '')

      if (!hasChanges) return

      setSavingIds((state) => [...state, achievement._id])

      try {
        const updated = await putData(
          `/api/${location}/achievements/${achievement._id}`,
          payload,
          null,
          null,
          false,
          loggedUser?._id
        )

        if (updated) {
          setAchievements((state) =>
            state.map((item) => (item._id === updated._id ? updated : item))
          )
          snackbar.success('Достижение обновлено')
        }
      } catch (error) {
        snackbar.error('Не удалось сохранить достижение')
      } finally {
        setSavingIds((state) =>
          state.filter((id) => id !== achievement._id)
        )
      }
    })
  }

  const handleDeleteAchievement = (achievementId) => {
    modalsFunc.confirm({
      title: 'Удаление достижения',
      text: 'Вы уверены, что хотите удалить достижение? Это действие нельзя отменить.',
      onConfirm: async () => {
        setDeletingIds((state) => [...state, achievementId])
        try {
          const result = await deleteData(
            `/api/${location}/achievements/${achievementId}`,
            null,
            null,
            {},
            false,
            loggedUser?._id
          )

          if (result !== null) {
            setAchievements((state) =>
              state.filter((achievement) => achievement._id !== achievementId)
            )
            setAchievementsUsers((state) =>
              state.filter(
                (assignment) =>
                  String(assignment.achievementId) !== String(achievementId)
              )
            )
            snackbar.success('Достижение удалено')
          }
        } catch (error) {
          snackbar.error('Не удалось удалить достижение')
        } finally {
          setDeletingIds((state) =>
            state.filter((id) => id !== achievementId)
          )
        }
      },
    })
  }

  const openUsersModal = () => {
    modalsFunc.selectUsers(
      selectedUsers,
      null,
      (usersList) => setSelectedUsers(usersList ?? []),
      null,
      null,
      null,
      true,
      'Выбор пользователей',
      false
    )
  }

  const removeSelectedUser = (userId) => {
    setSelectedUsers((state) => state.filter((user) => user._id !== userId))
  }

  const handleIssueAchievement = async () => {
    if (!selectedAchievementId) {
      snackbar.error('Выберите достижение для выдачи')
      return
    }
    if (selectedUsers.length === 0) {
      snackbar.error('Выберите хотя бы одного пользователя')
      return
    }

    setIssuing(true)
    const event = events.find(({ _id }) => String(_id) === selectedEventId)
    const createdRecords = []
    const skippedUsers = []
    const normalizedAchievementId = String(selectedAchievementId)
    const alreadyIssuedUserIds = new Set(
      (achievementsUsers ?? [])
        .filter(
          ({ achievementId }) =>
            String(achievementId) === normalizedAchievementId
        )
        .map(({ userId }) => String(userId))
    )

    try {
      for (const user of selectedUsers) {
        const userId = String(user._id)
        if (alreadyIssuedUserIds.has(userId)) {
          skippedUsers.push(user)
          continue
        }

        const payload = {
          achievementId: selectedAchievementId,
          userId: user._id,
          eventId: selectedEventId || null,
          eventName: event?.title ?? '',
          comment: issueComment?.trim() ?? '',
        }

        const created = await postData(
          `/api/${location}/achievementsusers`,
          payload,
          null,
          null,
          false,
          loggedUser?._id
        )

        if (created) {
          createdRecords.push(created)
          alreadyIssuedUserIds.add(userId)
        }
      }

      if (createdRecords.length > 0) {
        setAchievementsUsers((state) => [...state, ...createdRecords])
        snackbar.success(
          `Достижение выдано ${createdRecords.length} пользовател${
            createdRecords.length === 1 ? 'ю' : 'ям'
          }`
        )
        setSelectedUsers([])
        setIssueComment('')
      }

      if (skippedUsers.length > 0) {
        snackbar.info(
          `Пропущено ${skippedUsers.length} пользовател${
            skippedUsers.length === 1 ? 'я' : 'ей'
          }, у которых уже есть это достижение`
        )
      }
    } catch (error) {
      snackbar.error('Не удалось выдать достижение')
    } finally {
      setIssuing(false)
    }
  }

  const achievementsUsersDetailed = useMemo(() => {
    return achievementsUsers
      ?.map((item) => {
        const achievement = achievements.find(
          ({ _id }) => String(_id) === String(item.achievementId)
        )
        const user = users?.find(
          ({ _id }) => String(_id) === String(item.userId)
        )
        const event = events.find(
          ({ _id }) => String(_id) === String(item.eventId)
        )

        return {
          ...item,
          achievement,
          user,
          event,
        }
      })
      .sort((a, b) => new Date(b.issuedAt) - new Date(a.issuedAt))
  }, [achievementsUsers, achievements, users, events])

  const handleRemoveUserAchievement = async (id) => {
    setRemovingUserAchievementIds((state) => [...state, id])
    try {
      const result = await deleteData(
        `/api/${location}/achievementsusers/${id}`,
        null,
        null,
        {},
        false,
        loggedUser?._id
      )

      if (result !== null) {
        setAchievementsUsers((state) =>
          state.filter((assignment) => assignment._id !== id)
        )
        snackbar.success('Назначение достижения удалено')
      }
    } catch (error) {
      snackbar.error('Не удалось удалить назначение достижения')
    } finally {
      setRemovingUserAchievementIds((state) =>
        state.filter((assignmentId) => assignmentId !== id)
      )
    }
  }

  const isIssueDisabled =
    !selectedAchievementId || selectedUsers.length === 0 || isIssuing

  return (
    <div className="flex flex-col flex-1 h-screen max-h-screen gap-y-4 overflow-y-auto p-2">
      <FormWrapper className="flex flex-col gap-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Достижения</h2>
          {achievements.length > 0 && (
            <Button
              name="Создать достижение"
              icon={faPlus}
              onClick={openCreateAchievementModal}
              disabled={isCreating}
              loading={isCreating}
            />
          )}
        </div>
        {achievements.length > 0 ? (
          <div className="grid gap-3 phoneH:grid-cols-2 laptop:grid-cols-3 2xl:grid-cols-4">
            {achievements.map((achievement) => (
              <AchievementTile
                key={achievement._id}
                achievement={achievement}
                onEdit={() => openEditAchievementModal(achievement)}
                onDelete={() => handleDeleteAchievement(achievement._id)}
                isDeleting={deletingIds.includes(achievement._id)}
                isSaving={savingIds.includes(achievement._id)}
              />
            ))}
            <AddAchievementTile
              onClick={openCreateAchievementModal}
              disabled={isCreating}
              loading={isCreating}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-gray-300 px-6 py-12 text-center text-gray-500">
            <div>Пока нет созданных достижений.</div>
            <Button
              name="Создать достижение"
              icon={faPlus}
              onClick={openCreateAchievementModal}
              disabled={isCreating}
              loading={isCreating}
            />
          </div>
        )}
      </FormWrapper>

      <FormWrapper className="flex flex-col gap-y-3">
        <h2 className="text-lg font-semibold">Выдача достижений пользователям</h2>
        <div className="grid gap-3 laptop:grid-cols-2">
          <div className="flex flex-col gap-y-2">
            <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Выбранные пользователи
            </div>
            <div className="flex flex-wrap gap-2 rounded-lg border border-gray-200 bg-white p-2 min-h-[3.25rem]">
              {selectedUsers.length === 0 && (
                <div className="text-sm text-gray-500">Пользователи не выбраны</div>
              )}
              {selectedUsers.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center gap-x-2 rounded-full bg-gray-100 px-3 py-1 text-sm"
                >
                  <span>{getUserFullName(user)}</span>
                  <button
                    type="button"
                    className="text-gray-500 transition hover:text-red-600"
                    onClick={() => removeSelectedUser(user._id)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <Button name="Выбрать пользователей" onClick={openUsersModal} />
          </div>
          <div className="flex flex-col gap-y-2">
            <label className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Достижение
            </label>
            <select
              className="h-10 rounded border border-gray-300 bg-white px-3 text-sm focus:border-general focus:outline-none"
              value={selectedAchievementId}
              onChange={(event) => setSelectedAchievementId(event.target.value)}
            >
              <option value="">Не выбрано</option>
              {achievements.map((achievement) => (
                <option key={achievement._id} value={achievement._id}>
                  {achievement.name}
                </option>
              ))}
            </select>
            <label className="pt-2 text-xs font-medium uppercase tracking-wide text-gray-500">
              Мероприятие (необязательно)
            </label>
            <select
              className="h-10 rounded border border-gray-300 bg-white px-3 text-sm focus:border-general focus:outline-none"
              value={selectedEventId}
              onChange={(event) => setSelectedEventId(event.target.value)}
            >
              <option value="">Не выбрано</option>
              {events
                .slice()
                .sort((a, b) => {
                  const toTime = (item) => {
                    const value = item?.dateStart || item?.date
                    const time = value ? new Date(value).getTime() : 0
                    return Number.isNaN(time) ? 0 : time
                  }
                  return toTime(b) - toTime(a)
                })
                .map((event) => (
                  <option key={event._id} value={event._id}>
                    {event.title}
                  </option>
                ))}
            </select>
          </div>
        </div>
        <Textarea
          label="Комментарий (необязательно)"
          value={issueComment}
          onChange={setIssueComment}
          rows={3}
        />
        <div className="flex gap-2">
          <Button
            name="Выдать достижение"
            onClick={handleIssueAchievement}
            disabled={isIssueDisabled}
            loading={isIssuing}
          />
        </div>
      </FormWrapper>

      <FormWrapper className="flex flex-col gap-y-3">
        <h2 className="text-lg font-semibold">Выданные достижения</h2>
        {achievementsUsersDetailed?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-3 py-2 text-left">Пользователь</th>
                  <th className="px-3 py-2 text-left">Достижение</th>
                  <th className="px-3 py-2 text-left">Мероприятие</th>
                  <th className="px-3 py-2 text-left">Комментарий</th>
                  <th className="px-3 py-2 text-left">Дата</th>
                  <th className="px-3 py-2" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {achievementsUsersDetailed.map((item) => {
                  const userName = item.user
                    ? getUserFullName(item.user)
                    : 'Пользователь удалён'
                  const achievementName = item.achievement
                    ? item.achievement.name
                    : 'Достижение удалено'
                  const eventName = item.event?.title || item.eventName || ''

                  return (
                    <tr key={item._id} className="align-top">
                      <td className="px-3 py-2 text-gray-900">{userName}</td>
                      <td className="px-3 py-2 text-gray-900">
                        <div className="flex items-center gap-x-2">
                          {item.achievement?.image && (
                            <div className="relative h-10 w-10 overflow-hidden rounded">
                              <Image
                                src={item.achievement.image}
                                alt={achievementName}
                                layout="fill"
                                objectFit="cover"
                                sizes="40px"
                              />
                            </div>
                          )}
                          <span>{achievementName}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-gray-700">
                        {eventName || <span className="text-gray-400">—</span>}
                      </td>
                      <td className="px-3 py-2 text-gray-700 whitespace-pre-line">
                        {item.comment || <span className="text-gray-400">—</span>}
                      </td>
                      <td className="px-3 py-2 text-gray-600 whitespace-nowrap">
                        {formatDateTime(
                          item.issuedAt,
                          true,
                          false,
                          false,
                          false,
                          undefined,
                          true,
                          true
                        )}
                      </td>
                      <td className="px-3 py-2">
                        <Button
                          name="Удалить"
                          classBgColor="bg-red-600"
                          classHoverBgColor="hover:bg-red-700"
                          thin
                          onClick={() => handleRemoveUserAchievement(item._id)}
                          disabled={removingUserAchievementIds.includes(item._id)}
                          loading={removingUserAchievementIds.includes(item._id)}
                        />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-sm text-gray-500">
            Достижения ещё не были выданы пользователям.
          </div>
        )}
      </FormWrapper>
    </div>
  )
}

export default SettingsAchievementsContent
