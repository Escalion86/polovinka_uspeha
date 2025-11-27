'use client'

import Button from '@components/Button'
import ContentHeader from '@components/ContentHeader'
import useSnackbar from '@helpers/useSnackbar'
import { ID_TELEGRAM_GROUP } from '@helpers/constantsTelegram'
import locationAtom from '@state/atoms/locationAtom'
import { useAtomValue } from 'jotai'
import { useCallback, useMemo, useState } from 'react'

const TestingContent = () => {
  const location = useAtomValue(locationAtom)
  const { success: notifySuccess, error: notifyError } = useSnackbar()

  const [message, setMessage] = useState('')
  const [topicId, setTopicId] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [lastSendInfo, setLastSendInfo] = useState(null)

  const groupIdLabel = useMemo(
    () => (ID_TELEGRAM_GROUP ? String(ID_TELEGRAM_GROUP) : '-'),
    []
  )

  const handleSendMessage = useCallback(async () => {
    if (!location || isSending) return
    const trimmedMessage = message.trim()
    if (!trimmedMessage) {
      notifyError('Введите текст сообщения')
      return
    }

    setIsSending(true)
    setLastSendInfo(null)
    try {
      const response = await fetch(`/api/${location}/telegram/groups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: trimmedMessage,
          topicId: topicId || null,
        }),
      })
      const result = await response.json()
      if (!response.ok || !result?.success) {
        throw new Error(result?.error || 'Не удалось отправить сообщение')
      }
      notifySuccess('Сообщение отправлено в Telegram')
      setLastSendInfo({
        createdAt: new Date().toISOString(),
        topicId: result?.data?.topicId ?? null,
      })
      setMessage('')
    } catch (error) {
      console.error('Telegram send error', error)
      notifyError(error?.message || 'Не удалось отправить сообщение')
    } finally {
      setIsSending(false)
    }
  }, [isSending, location, message, notifyError, notifySuccess, topicId])

  return (
    <>
      <ContentHeader>
        <div className="flex flex-wrap items-center justify-between w-full gap-4">
          <div className="flex flex-col">
            <div className="text-xl font-bold text-black">Тестирование</div>
            <div className="text-sm text-general">
              Временный инструмент для отправки сообщений в тестовую группу
            </div>
          </div>
        </div>
      </ContentHeader>

      <div className="p-4 mt-4 bg-white border rounded-lg shadow-sm flex flex-col gap-4">
        <div className="text-base font-semibold text-black">
          Telegram-группа для тестов
        </div>
        <div className="text-sm text-general">
          Сообщения отправляются напрямую в заранее известную группу. Чтобы
          написать в конкретную тему форума — укажите её ID в поле ниже.
          Если поле пустое, сообщение попадёт в общий список чатов.
        </div>

        <div className="flex flex-col gap-1 text-sm text-general">
          <span className="font-semibold text-black">ID группы</span>
          <code className="px-2 py-1 text-sm text-black bg-gray-100 rounded">
            {groupIdLabel}
          </code>
        </div>

        <label className="flex flex-col gap-1 text-sm text-general">
          <span className="font-semibold text-black">ID темы (опционально)</span>
          <input
            type="text"
            value={topicId}
            onChange={(event) => setTopicId(event.target.value)}
            placeholder="Например, 12345"
            className="px-3 py-2 text-black border rounded-lg border-general/40 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          <span className="text-xs text-general/70">
            Укажите ID форумной темы, если хотите отправить сообщение в неё.
            Оставьте поле пустым, чтобы отправить в общий чат.
          </span>
        </label>

        <label className="flex flex-col gap-1 text-sm text-general">
          <span className="font-semibold text-black">Текст сообщения</span>
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={6}
            placeholder="Введите текст, поддерживается HTML как в рассылках"
            className="px-3 py-2 text-black border rounded-lg border-general/40 focus:outline-none focus:ring-2 focus:ring-blue-200 resize-y min-h-[120px]"
          />
        </label>

        <div className="flex items-center justify-end">
          <Button
            name="Отправить сообщение"
            onClick={handleSendMessage}
            loading={isSending}
            disabled={!location || isSending}
            thin
          />
        </div>

        {lastSendInfo && (
          <div className="p-3 text-sm bg-success/10 border border-success/40 rounded-lg text-success">
            Отправлено {new Date(lastSendInfo.createdAt).toLocaleString('ru-RU')}
            {lastSendInfo.topicId
              ? ` · тема ${lastSendInfo.topicId}`
              : ' · в общий чат'}
          </div>
        )}
      </div>
    </>
  )
}

export default TestingContent
