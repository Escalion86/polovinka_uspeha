'use client'

import { useCallback, useMemo, useState } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'

import Button from '@components/Button'
import ContentHeader from '@components/ContentHeader'
import AddButton from '@components/IconToggleButtons/AddButton'
import ComboBox from '@components/ComboBox'
import { putData, deleteData } from '@helpers/CRUD'
import locationAtom from '@state/atoms/locationAtom'
import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'
import scheduledMessagesAtomAsync from '@state/async/scheduledMessagesAtomAsync'
import useSnackbar from '@helpers/useSnackbar'
import formatDateTime from '@helpers/formatDateTime'
import modalsFuncAtom from '@state/modalsFuncAtom'
import {
  SCHEDULED_MESSAGE_STATUSES,
  SCHEDULED_MESSAGE_STATUS_OPTIONS,
  SCHEDULED_MESSAGE_STATUS_NAME,
} from '@helpers/constantsScheduledMessages'

const STATUS_BADGE_STYLES = {
  [SCHEDULED_MESSAGE_STATUSES.NEED_CHECK]: 'bg-yellow-100 text-yellow-800',
  [SCHEDULED_MESSAGE_STATUSES.READY]: 'bg-blue-100 text-blue-800',
  [SCHEDULED_MESSAGE_STATUSES.SENT]: 'bg-green-100 text-green-800',
}

const getTextPreview = (html) =>
  html
    ? html
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/p>/gi, '\n')
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/gi, ' ')
        .replace(/\s+\n/g, '\n')
        .trim()
    : ''

const ToolsScheduledMessagesContent = () => {
  const location = useAtomValue(locationAtom)
  const loggedUser = useAtomValue(loggedUserActiveAtom)
  const modalsFunc = useAtomValue(modalsFuncAtom)
  const scheduledMessages = useAtomValue(scheduledMessagesAtomAsync) || []
  const setScheduledMessages = useSetAtom(scheduledMessagesAtomAsync)
  const { success: notifySuccess, error: notifyError } = useSnackbar()

  const [statusUpdatingId, setStatusUpdatingId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  const sortedScheduledMessages = useMemo(() => {
    const order = {
      [SCHEDULED_MESSAGE_STATUSES.NEED_CHECK]: 0,
      [SCHEDULED_MESSAGE_STATUSES.READY]: 1,
      [SCHEDULED_MESSAGE_STATUSES.SENT]: 2,
    }
    return [...scheduledMessages].sort((a, b) => {
      const diff = (order[a.status] ?? 3) - (order[b.status] ?? 3)
      if (diff !== 0) return diff
      const dateDiff = (a.sendDate || '').localeCompare(b.sendDate || '')
      if (dateDiff !== 0) return dateDiff
      return (a.sendTime || '').localeCompare(b.sendTime || '')
    })
  }, [scheduledMessages])

  const handleOpenModal = useCallback(
    (message = null) => {
      modalsFunc?.scheduledMessage?.edit(message)
    },
    [modalsFunc]
  )

  const updateScheduledMessagesList = useCallback(
    (updatedMessage, shouldPrepend = false) => {
      const currentList = scheduledMessages || []
      const exists = currentList.some(({ _id }) => _id === updatedMessage._id)
      if (exists) {
        setScheduledMessages(
          currentList.map((item) =>
            item._id === updatedMessage._id ? updatedMessage : item
          )
        )
      } else if (shouldPrepend) {
        setScheduledMessages([updatedMessage, ...currentList])
      } else {
        setScheduledMessages([...currentList, updatedMessage])
      }
    },
    [scheduledMessages, setScheduledMessages]
  )

  const handleStatusChange = useCallback(
    async (message, newStatus) => {
      if (!message || !newStatus || message.status === newStatus) return
      try {
        setStatusUpdatingId(message._id)
        const updated = await putData(
          `/api/${location}/scheduled-messages/${message._id}`,
          { status: newStatus },
          null,
          null,
          false,
          loggedUser?._id
        )
        if (!updated) throw new Error('update')
        updateScheduledMessagesList(updated)
        notifySuccess('Статус обновлён')
      } catch (error) {
        notifyError('Не удалось обновить статус')
      } finally {
        setStatusUpdatingId(null)
      }
    },
    [
      location,
      loggedUser?._id,
      notifyError,
      notifySuccess,
      updateScheduledMessagesList,
    ]
  )

  const handleDelete = useCallback(
    (message) => {
      if (!message) return
      const confirmDelete = async () => {
        try {
          setDeletingId(message._id)
          const success = await deleteData(
            `/api/${location}/scheduled-messages/${message._id}`,
            null,
            null,
            {},
            false,
            loggedUser?._id
          )
          if (success !== undefined) {
            const filtered = scheduledMessages.filter(
              (item) => item._id !== message._id
            )
            setScheduledMessages(filtered)
            notifySuccess('Сообщение удалено')
          } else {
            throw new Error('delete')
          }
        } catch (error) {
          notifyError('Не удалось удалить сообщение')
        } finally {
          setDeletingId(null)
        }
      }

      if (modalsFunc?.confirm) {
        modalsFunc.confirm({
          title: 'Удалить сообщение?',
          text: `Сообщение «${message.name || 'Без названия'}» будет удалено.`,
          onConfirm: confirmDelete,
        })
      } else {
        confirmDelete()
      }
    },
    [
      location,
      loggedUser?._id,
      modalsFunc,
      notifyError,
      notifySuccess,
      scheduledMessages,
      setScheduledMessages,
    ]
  )

  return (
    <>
      <ContentHeader>
        <div className="flex flex-wrap items-center justify-between w-full gap-4">
          <div className="flex flex-col">
            <div className="text-xl font-bold text-black">
              Сообщения по расписанию
            </div>
            <div className="text-sm text-general">
              Готовьте тексты для Telegram-группы и автоматически отправляйте
              их в заданное время.
            </div>
          </div>
          <AddButton onClick={() => handleOpenModal()} />
        </div>
      </ContentHeader>

      <div className="p-4 mt-4 bg-white border rounded-lg shadow-sm">
        <div className="text-base font-semibold text-black">
          Как устроены статусы
        </div>
        <div className="mt-2 text-sm text-general space-y-1">
          <div>
            <span className="font-semibold">«Надо проверить»</span> — текст
            лежит в черновиках и не попадёт в рассылку.
          </div>
          <div>
            <span className="font-semibold">«Готово к отправке»</span> — cron
            сможет отправить сообщение, когда наступит время.
          </div>
          <div>
            <span className="font-semibold">«Отправлено»</span> — сообщение уже
            ушло в Telegram.
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-4">
        {sortedScheduledMessages.length === 0 ? (
          <div className="p-6 text-center text-general bg-white border rounded-lg shadow-sm">
            Пока нет сообщений. Создайте первое, чтобы автоматизировать
            коммуникацию.
          </div>
        ) : (
          sortedScheduledMessages.map((message) => (
            <div
              key={message._id}
              className="flex flex-col gap-4 p-4 bg-white border rounded-lg shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1 min-w-[16rem]">
                  <div className="text-lg font-semibold text-black">
                    {message.name || 'Без названия'}
                  </div>
                  {message.text && (
                    <div className="mt-2 text-sm text-general whitespace-pre-line">
                      {getTextPreview(message.text)}
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2 text-sm text-general">
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      STATUS_BADGE_STYLES[message.status] ||
                      'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {SCHEDULED_MESSAGE_STATUS_NAME[message.status] || '-'}
                  </div>
                  <div>
                    Дата отправки:{' '}
                    <span className="font-semibold">
                      {message.sendDate || '-'}
                    </span>
                  </div>
                  <div>
                    Время отправки:{' '}
                    <span className="font-semibold">
                      {message.sendTime || '-'}
                    </span>
                  </div>
                  <div>
                    Отправлено:{' '}
                    <span className="font-semibold">
                      {message.sentAt
                        ? formatDateTime(
                            message.sentAt,
                            false,
                            false,
                            true,
                            false,
                            false,
                            true,
                            true
                          )
                        : '—'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div className="w-full max-w-xs">
                  <ComboBox
                    label="Статус"
                    value={message.status}
                    onChange={(value) =>
                      handleStatusChange(message, value || message.status)
                    }
                    items={SCHEDULED_MESSAGE_STATUS_OPTIONS}
                    disabled={statusUpdatingId === message._id}
                  />
                </div>
                <div className="flex items-center gap-2 ml-auto">
                  <Button
                    name="Редактировать"
                    thin
                    onClick={() => handleOpenModal(message)}
                  />
                  <Button
                    name="Удалить"
                    thin
                    classBgColor="bg-red-500"
                    classHoverBgColor="hover:bg-red-600"
                    onClick={() => handleDelete(message)}
                    disabled={deletingId === message._id}
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

    </>
  )
}

export default ToolsScheduledMessagesContent
