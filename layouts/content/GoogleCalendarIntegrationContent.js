'use client'

import Button from '@components/Button'
import InputWrapper from '@components/InputWrapper'
import Note from '@components/Note'
import { deleteData, getData, postData } from '@helpers/CRUD'
import useSnackbar from '@helpers/useSnackbar'
import locationAtom from '@state/atoms/locationAtom'
import { useEffect, useMemo, useState } from 'react'
import { useAtomValue } from 'jotai'
import useRouter from '@utils/useRouter'

const STATUS_MESSAGES = {
  oauthSuccess: 'Google аккаунт успешно подключен. Теперь выберите календарь.',
  oauthError: 'Не удалось завершить авторизацию Google. Попробуйте еще раз.',
  dbError: 'Ошибка базы данных при подключении Google Календаря.',
  locationError: 'Некорректная локация для подключения Google Календаря.',
  locationMismatch: 'Сессия и callback Google относятся к разным локациям.',
}

const GoogleCalendarIntegrationContent = () => {
  const location = useAtomValue(locationAtom)
  const router = useRouter()
  const { success, error } = useSnackbar()

  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [data, setData] = useState({
    connected: false,
    calendarId: null,
    calendarSummary: null,
    calendars: [],
  })
  const [selectedCalendarId, setSelectedCalendarId] = useState('')

  const selectedCalendarSummary = useMemo(() => {
    if (!selectedCalendarId) return ''
    const selected = data.calendars.find((item) => item.id === selectedCalendarId)
    return selected?.summary || ''
  }, [data.calendars, selectedCalendarId])

  const loadSettings = async () => {
    setIsLoading(true)
    try {
      const result = await getData(
        `/api/${location}/google-calendar`,
        {},
        null,
        null,
        true
      )
      if (!result?.success) {
        error(
          result?.data?.error?.message ||
            'Не удалось загрузить настройки Google Календаря'
        )
        return
      }
      const payload = result.data || {}
      setData({
        connected: Boolean(payload.connected),
        calendarId: payload.calendarId || null,
        calendarSummary: payload.calendarSummary || null,
        calendars: Array.isArray(payload.calendars) ? payload.calendars : [],
      })
      setSelectedCalendarId(payload.calendarId || '')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadSettings()
  }, [location])

  useEffect(() => {
    const status = String(router?.query?.gcalStatus || '').trim()
    if (!status) return

    const text = STATUS_MESSAGES[status]
    if (text) {
      if (status === 'oauthSuccess') success(text)
      else error(text)
    }

    router.replace(`/${location}/cabinet/googleCalendarIntegration`, '', {
      shallow: true,
    })
  }, [location, router, success, error])

  const connectGoogle = async () => {
    setIsSubmitting(true)
    try {
      const result = await postData(
        `/api/${location}/google-calendar`,
        { action: 'beginAuth' },
        null,
        null,
        true
      )
      if (!result?.success || !result?.data?.authUrl) {
        error(
          result?.data?.error?.message ||
            'Не удалось начать авторизацию в Google'
        )
        return
      }

      window.location.href = result.data.authUrl
    } finally {
      setIsSubmitting(false)
    }
  }

  const saveSelectedCalendar = async () => {
    if (!selectedCalendarId) {
      error('Сначала выберите календарь')
      return
    }

    setIsSubmitting(true)
    try {
      const result = await postData(
        `/api/${location}/google-calendar`,
        {
          action: 'selectCalendar',
          calendarId: selectedCalendarId,
          calendarSummary: selectedCalendarSummary,
        },
        null,
        null,
        true
      )
      if (!result?.success) {
        error(
          result?.data?.error?.message ||
            'Не удалось сохранить выбранный календарь'
        )
        return
      }

      success('Календарь для синхронизации успешно сохранен')
      await loadSettings()
    } finally {
      setIsSubmitting(false)
    }
  }

  const disconnectGoogle = async () => {
    setIsSubmitting(true)
    try {
      const result = await deleteData(
        `/api/${location}/google-calendar`,
        null,
        null,
        {},
        true
      )
      if (!result?.success) {
        error(
          result?.data?.error?.message ||
            'Не удалось отключить Google Календарь'
        )
        return
      }
      success('Интеграция Google Календаря отключена')
      await loadSettings()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-4 p-2">
      <InputWrapper label="Интеграция Google Календаря">
        <div className="flex flex-col gap-2">
          <Note>
            При записи на мероприятие событие автоматически появится в вашем
            выбранном Google Календаре. Для резерва в описании будет указан
            статус "В резерве".
          </Note>
          <div className="text-sm">
            Статус подключения:{' '}
            <span className="font-semibold">
              {data.connected ? 'Подключено' : 'Не подключено'}
            </span>
          </div>
          {data.calendarSummary && (
            <div className="text-sm">
              Текущий календарь: <span className="font-semibold">{data.calendarSummary}</span>
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            <Button
              name="Подключить Google"
              onClick={connectGoogle}
              loading={isSubmitting}
              disabled={isLoading}
            />
            <Button
              name="Обновить список календарей"
              onClick={loadSettings}
              loading={isLoading}
              disabled={isSubmitting}
              outline
            />
            {data.connected && (
              <Button
                name="Отключить"
                onClick={disconnectGoogle}
                loading={isSubmitting}
                disabled={isLoading}
                outline
                classOutlineColor="border-red-500"
                classOutlineTextColor="text-red-500"
                classHoverOutlineColor="hover:border-red-600"
                classHoverOutlineTextColor="hover:text-red-600"
              />
            )}
          </div>
        </div>
      </InputWrapper>

      {data.connected && (
        <InputWrapper label="Выбор календаря">
          <div className="flex flex-col gap-2">
            <select
              className="w-full max-w-xl px-3 py-2 border rounded border-gray-300"
              value={selectedCalendarId}
              onChange={(event) => setSelectedCalendarId(event.target.value)}
              disabled={isLoading || isSubmitting}
            >
              <option value="">Выберите календарь</option>
              {data.calendars.map((calendar) => (
                <option key={calendar.id} value={calendar.id}>
                  {calendar.summary}
                  {calendar.primary ? ' (Основной)' : ''}
                </option>
              ))}
            </select>
            <div className="flex">
              <Button
                name="Сохранить выбранный календарь"
                onClick={saveSelectedCalendar}
                loading={isSubmitting}
                disabled={isLoading || !selectedCalendarId}
              />
            </div>
          </div>
        </InputWrapper>
      )}
    </div>
  )
}

export default GoogleCalendarIntegrationContent
