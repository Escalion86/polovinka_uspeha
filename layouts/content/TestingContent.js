'use client'

import Button from '@components/Button'
import ContentHeader from '@components/ContentHeader'
import useSnackbar from '@helpers/useSnackbar'
import locationAtom from '@state/atoms/locationAtom'
import { useAtomValue } from 'jotai'
import { useCallback, useEffect, useMemo, useState } from 'react'

const TestingContent = () => {
  const location = useAtomValue(locationAtom)
  const { success: notifySuccess, error: notifyError } = useSnackbar()

  const [isTelegramChatsLoading, setIsTelegramChatsLoading] = useState(false)
  const [telegramChats, setTelegramChats] = useState([])
  const [telegramChatsError, setTelegramChatsError] = useState(null)
  const [telegramChatsMeta, setTelegramChatsMeta] = useState(null)
  const [selectedChatId, setSelectedChatId] = useState(null)
  const [selectedTopicId, setSelectedTopicId] = useState(null)

  const resetTelegramData = useCallback(() => {
    setTelegramChats([])
    setTelegramChatsError(null)
    setTelegramChatsMeta(null)
    setSelectedChatId(null)
    setSelectedTopicId(null)
  }, [])

  useEffect(() => {
    resetTelegramData()
  }, [resetTelegramData, location])

  const handleFetchTelegramChats = useCallback(async () => {
    if (!location || isTelegramChatsLoading) return

    setIsTelegramChatsLoading(true)
    setTelegramChatsError(null)
    try {
      const response = await fetch(`/api/${location}/telegram/groups`)
      const result = await response.json()
      if (!response.ok || !result?.success) {
        throw new Error(result?.error || 'Не удалось получить чаты Telegram')
      }

      const chats = Array.isArray(result?.data?.chats)
        ? result.data.chats
        : []
      setTelegramChats(chats)
      setTelegramChatsMeta({
        totalUpdates: result?.data?.totalUpdates ?? null,
        lastUpdateId: result?.data?.lastUpdateId ?? null,
      })

      const firstChatId =
        chats.length > 0 && chats[0].id !== undefined
          ? String(chats[0].id)
          : null
      setSelectedChatId(firstChatId)
      setSelectedTopicId(
        chats[0]?.topics?.[0]?.threadId
          ? String(chats[0].topics[0].threadId)
          : null
      )
      notifySuccess('Группы Telegram обновлены')
    } catch (error) {
      console.error('Telegram groups fetch error', error)
      setTelegramChatsError(error?.message || 'Не удалось получить данные')
      notifyError('Не удалось загрузить Telegram-группы')
    } finally {
      setIsTelegramChatsLoading(false)
    }
  }, [isTelegramChatsLoading, location, notifyError, notifySuccess])

  const handleChatChange = useCallback(
    (event) => {
      const value = event?.target?.value || null
      setSelectedChatId(value)
      if (!value) {
        setSelectedTopicId(null)
        return
      }
      const chat = telegramChats.find(
        (item) => String(item.id) === String(value)
      )
      setSelectedTopicId(
        chat?.topics?.[0]?.threadId
          ? String(chat.topics[0].threadId)
          : null
      )
    },
    [telegramChats]
  )

  const handleTopicChange = useCallback((event) => {
    setSelectedTopicId(event?.target?.value || null)
  }, [])

  const selectedChat = useMemo(
    () =>
      telegramChats.find(
        (chat) => String(chat.id) === String(selectedChatId)
      ) || null,
    [selectedChatId, telegramChats]
  )

  const availableTopics = selectedChat?.isForum ? selectedChat?.topics || [] : []

  const selectedTopic = useMemo(
    () =>
      availableTopics.find(
        (topic) => String(topic.threadId) === String(selectedTopicId)
      ) || null,
    [availableTopics, selectedTopicId]
  )

  const formatTimestamp = useCallback((timestamp) => {
    if (!timestamp) return '-'
    try {
      return new Date(timestamp).toLocaleString('ru-RU')
    } catch {
      return '-'
    }
  }, [])

  const hasTelegramChats = telegramChats.length > 0

  return (
    <>
      <ContentHeader>
        <div className="flex flex-wrap items-center justify-between w-full gap-4">
          <div className="flex flex-col">
            <div className="text-xl font-bold text-black">Тестирование</div>
            <div className="text-sm text-general">
              Временные инструменты для отладки интеграций
            </div>
          </div>
          <Button
            name="Показать группы Telegram"
            onClick={handleFetchTelegramChats}
            loading={isTelegramChatsLoading}
            disabled={!location}
            thin
          />
        </div>
      </ContentHeader>

      <div className="p-4 mt-4 bg-white border rounded-lg shadow-sm flex flex-col gap-4">
        <div className="text-base font-semibold text-black">
          Telegram-группы и темы
        </div>
        <div className="text-sm text-general">
          Здесь можно получить список чатов и форумных тем, к которым есть
          доступ у Telegram-бота. Эти данные пригодятся для подготовки
          рассылок и тестирования отправки сообщений.
        </div>

        {telegramChatsError && (
          <div className="px-3 py-2 text-sm text-danger bg-danger/10 rounded-lg border border-danger/30">
            {telegramChatsError}
          </div>
        )}

        {hasTelegramChats ? (
          <>
            <div className="flex flex-wrap gap-3">
              <label className="flex flex-col min-w-[220px] gap-1 text-sm text-general">
                <span className="font-semibold text-black">Группа</span>
                <select
                  className="px-3 py-2 text-black border rounded-lg border-general/40 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  value={selectedChatId ?? ''}
                  onChange={handleChatChange}
                >
                  {telegramChats.map((chat) => (
                    <option key={chat.id} value={String(chat.id)}>
                      {chat.title || chat.username || chat.id}
                    </option>
                  ))}
                </select>
              </label>

              {selectedChat?.isForum && (
                <label className="flex flex-col min-w-[220px] gap-1 text-sm text-general">
                  <span className="font-semibold text-black">Тема</span>
                  {availableTopics.length > 0 ? (
                    <select
                      className="px-3 py-2 text-black border rounded-lg border-general/40 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      value={selectedTopicId ?? ''}
                      onChange={handleTopicChange}
                    >
                      {availableTopics.map((topic) => (
                        <option
                          key={topic.threadId}
                          value={String(topic.threadId)}
                        >
                          {topic.title || `Тема #${topic.threadId}`}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="px-3 py-2 text-sm border border-dashed rounded-lg border-general/40 text-general/80">
                      В последних апдейтах нет тем. Напишите любое сообщение в
                      нужную тему, чтобы она появилась здесь.
                    </div>
                  )}
                </label>
              )}
            </div>

            <div className="grid gap-1 text-sm text-general">
              <div>
                <span className="font-semibold text-black">ID:</span>{' '}
                {selectedChat?.id ?? '-'}
              </div>
              <div>
                <span className="font-semibold text-black">Тип:</span>{' '}
                {selectedChat?.type ?? '-'}
              </div>
              {selectedChat?.username && (
                <div>
                  <span className="font-semibold text-black">Username:</span>{' '}
                  @{selectedChat.username}
                </div>
              )}
              <div>
                <span className="font-semibold text-black">
                  Форумные темы:
                </span>{' '}
                {selectedChat?.isForum
                  ? availableTopics.length
                  : 'Нет'}
              </div>
              <div>
                <span className="font-semibold text-black">
                  Последняя активность:
                </span>{' '}
                {formatTimestamp(selectedChat?.lastActivityAt)}
              </div>
            </div>

            {selectedChat?.isForum && (
              <div className="flex flex-col gap-2 text-sm text-general">
                <div className="font-semibold text-black">Выбранная тема</div>
                {selectedTopic ? (
                  <div className="grid gap-1">
                    <div>
                      <span className="font-semibold text-black">ID:</span>{' '}
                      {selectedTopic.threadId}
                    </div>
                    <div>
                      <span className="font-semibold text-black">Название:</span>{' '}
                      {selectedTopic.title || `Тема #${selectedTopic.threadId}`}
                    </div>
                    <div>
                      <span className="font-semibold text-black">
                        Статус:
                      </span>{' '}
                      {selectedTopic.isClosed ? 'Закрыта' : 'Открыта'}
                    </div>
                    <div>
                      <span className="font-semibold text-black">
                        Создана:
                      </span>{' '}
                      {formatTimestamp(selectedTopic.createdAt)}
                    </div>
                    <div>
                      <span className="font-semibold text-black">
                        Последняя активность:
                      </span>{' '}
                      {formatTimestamp(selectedTopic.lastActivityAt)}
                    </div>
                    {selectedTopic.lastMessagePreview && (
                      <div>
                        <span className="font-semibold text-black">
                          Последнее сообщение:
                        </span>{' '}
                        {selectedTopic.lastMessagePreview}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-general/80">
                    Тема не выбрана или не найдена. Попробуйте выбрать другую
                    группу либо запросите свежие апдейты.
                  </div>
                )}
              </div>
            )}

            <div className="text-xs text-general/80">
              Обновлений: {telegramChatsMeta?.totalUpdates ?? '-'}
              {telegramChatsMeta?.lastUpdateId
                ? ` · Последний update_id: ${telegramChatsMeta.lastUpdateId}`
                : ''}
            </div>
          </>
        ) : (
          <div className="text-sm text-general/80">
            Нажмите «Показать группы Telegram», чтобы получить список чатов и
            форумных тем, доступных боту.
          </div>
        )}
      </div>
    </>
  )
}

export default TestingContent
