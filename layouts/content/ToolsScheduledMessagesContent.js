'use client'

import { useCallback, useMemo, useState } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'

import ContentHeader from '@components/ContentHeader'
import AddButton from '@components/IconToggleButtons/AddButton'
import CardButton from '@components/CardButton'
import CardWrapper from '@components/CardWrapper'
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons/faTrashAlt'
import { deleteData } from '@helpers/CRUD'
import locationAtom from '@state/atoms/locationAtom'
import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'
import scheduledMessagesAtomAsync from '@state/async/scheduledMessagesAtomAsync'
import useSnackbar from '@helpers/useSnackbar'
import modalsFuncAtom from '@state/modalsFuncAtom'
import {
  SCHEDULED_MESSAGE_STATUSES,
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

const PREVIEW_MAX_LINES = 3

const getLimitedTextPreview = (html) => {
  const preview = getTextPreview(html)
  if (!preview) return ''
  const lines = preview.split('\n')
  if (lines.length <= PREVIEW_MAX_LINES) return preview
  return `${lines.slice(0, PREVIEW_MAX_LINES).join('\n')}...`
}

const ToolsScheduledMessagesContent = () => {
  const location = useAtomValue(locationAtom)
  const loggedUser = useAtomValue(loggedUserActiveAtom)
  const modalsFunc = useAtomValue(modalsFuncAtom)
  const scheduledMessages = useAtomValue(scheduledMessagesAtomAsync) || []
  const setScheduledMessages = useSetAtom(scheduledMessagesAtomAsync)
  const { success: notifySuccess, error: notifyError } = useSnackbar()

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
            <CardWrapper
              key={message._id}
              onClick={() => handleOpenModal(message)}
              flex={false}
              gap={false}
              className="cursor-pointer"
            >
              <div
                role="button"
                tabIndex={0}
                className="w-full p-4 focus:outline-none"
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    handleOpenModal(message)
                  }
                }}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1 min-w-[16rem] pr-6">
                    <div className="text-lg font-semibold text-black">
                      {message.name || 'Без названия'}
                    </div>
                    {message.text && (
                      <div className="mt-2 text-sm text-general whitespace-pre-line">
                        {getLimitedTextPreview(message.text)}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2 text-sm text-general min-w-[12rem]">
                    <div className="flex items-start justify-end w-full gap-2">
                      <div
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          STATUS_BADGE_STYLES[message.status] ||
                          'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {SCHEDULED_MESSAGE_STATUS_NAME[message.status] || '-'}
                      </div>
                      <div data-prevent-parent-click>
                        <CardButton
                          icon={faTrashAlt}
                          color="red"
                          tooltipText={
                            deletingId === message._id
                              ? 'Удаление...'
                              : 'Удалить'
                          }
                          onClick={() => {
                            if (deletingId === message._id) return
                            handleDelete(message)
                          }}
                        />
                      </div>
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
                  </div>
                </div>
              </div>
            </CardWrapper>
          ))
        )}
      </div>

    </>
  )
}

export default ToolsScheduledMessagesContent
