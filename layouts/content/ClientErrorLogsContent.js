'use client'

import Button from '@components/Button'
import ContentHeader from '@components/ContentHeader'
import LoadingSpinner from '@components/LoadingSpinner'
import { getData } from '@helpers/CRUD'
import locationAtom from '@state/atoms/locationAtom'
import { useAtomValue } from 'jotai'
import { useCallback, useEffect, useMemo, useState } from 'react'

const formatDateTime = (value) => {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleString('ru-RU')
}

const textPreview = (value, max = 220) => {
  const text = String(value || '')
  if (!text) return ''
  if (text.length <= max) return text
  return `${text.slice(0, max)}...`
}

const ClientErrorLogsContent = () => {
  const location = useAtomValue(locationAtom)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [offset, setOffset] = useState(0)

  const [hours, setHours] = useState(72)
  const [limit, setLimit] = useState(100)
  const [onlyIphone, setOnlyIphone] = useState(true)
  const [onlySafari, setOnlySafari] = useState(true)
  const [search, setSearch] = useState('')
  const [searchDraft, setSearchDraft] = useState('')

  const page = useMemo(() => Math.floor(offset / limit) + 1, [offset, limit])
  const maxPage = useMemo(
    () => Math.max(1, Math.ceil((total || 0) / (limit || 1))),
    [total, limit]
  )

  const loadLogs = useCallback(async () => {
    if (!location) return
    setLoading(true)
    setError('')

    const response = await getData(
      `/api/${location}/client-error-logs`,
      {
        hours,
        limit,
        offset,
        onlyIphone,
        onlySafari,
        search,
      },
      null,
      null,
      true
    )

    setLoading(false)

    if (!response?.success) {
      setItems([])
      setTotal(0)
      setError(
        response?.data?.error?.message || 'Не удалось загрузить клиентские ошибки'
      )
      return
    }

    setItems(Array.isArray(response?.data?.items) ? response.data.items : [])
    setTotal(Number(response?.data?.total) || 0)
  }, [location, hours, limit, offset, onlyIphone, onlySafari, search])

  useEffect(() => {
    loadLogs()
  }, [loadLogs])

  return (
    <div className="flex flex-col px-1 pb-2 overflow-y-auto">
      <ContentHeader>Клиентские ошибки (iPhone/Safari)</ContentHeader>

      <div className="grid grid-cols-1 gap-2 p-2 mb-2 bg-gray-100 border border-gray-300 rounded tablet:grid-cols-2 laptop:grid-cols-4">
        <label className="flex flex-col text-sm">
          <span className="mb-1 font-semibold">Период (часы)</span>
          <input
            type="number"
            min={1}
            max={24 * 365}
            value={hours}
            onChange={(event) => setHours(Number(event.target.value || 72))}
            className="px-2 py-1 border border-gray-400 rounded"
          />
        </label>
        <label className="flex flex-col text-sm">
          <span className="mb-1 font-semibold">Лимит</span>
          <input
            type="number"
            min={1}
            max={500}
            value={limit}
            onChange={(event) => setLimit(Number(event.target.value || 100))}
            className="px-2 py-1 border border-gray-400 rounded"
          />
        </label>
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input
            type="checkbox"
            checked={onlyIphone}
            onChange={(event) => setOnlyIphone(event.target.checked)}
          />
          Только iPhone
        </label>
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input
            type="checkbox"
            checked={onlySafari}
            onChange={(event) => setOnlySafari(event.target.checked)}
          />
          Только Safari
        </label>
        <label className="flex flex-col text-sm tablet:col-span-2 laptop:col-span-2">
          <span className="mb-1 font-semibold">Поиск (message/url/userAgent)</span>
          <input
            type="text"
            value={searchDraft}
            onChange={(event) => setSearchDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                setOffset(0)
                setSearch(searchDraft.trim())
              }
            }}
            className="px-2 py-1 border border-gray-400 rounded"
            placeholder="Например: chunk, iphone, safari, /cabinet/likes"
          />
        </label>
        <div className="flex items-end gap-2 tablet:col-span-2 laptop:col-span-2">
          <Button
            name="Применить"
            onClick={() => {
              setOffset(0)
              setSearch(searchDraft.trim())
            }}
          />
          <Button
            name="Сбросить"
            color="gray"
            onClick={() => {
              setHours(72)
              setLimit(100)
              setOnlyIphone(true)
              setOnlySafari(true)
              setSearch('')
              setSearchDraft('')
              setOffset(0)
            }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between px-1 mb-2 text-sm text-gray-700">
        <span>
          Всего: <b>{total}</b>
        </span>
        <span>
          Страница: <b>{page}</b> / {maxPage}
        </span>
      </div>

      {error && (
        <div className="p-2 mb-2 text-sm text-red-700 bg-red-100 border border-red-300 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-10">
          <LoadingSpinner text="Загрузка ошибок..." />
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {items.length === 0 && (
            <div className="p-3 text-sm text-gray-700 bg-gray-100 border border-gray-300 rounded">
              За выбранный период ошибок не найдено
            </div>
          )}
          {items.map((item) => (
            <div
              key={item._id}
              className="p-2 bg-white border border-gray-300 rounded shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1 text-xs text-gray-600">
                <span>{formatDateTime(item.createdAt)}</span>
                <span>ID: {item._id}</span>
              </div>
              <div className="mb-1 text-sm font-semibold text-red-700">
                {item.message || '[без сообщения]'}
              </div>
              <div className="mb-1 text-xs text-gray-700 break-all">
                URL: {item.url || '-'}
              </div>
              <div className="mb-1 text-xs text-gray-700 break-all">
                UA: {textPreview(item.userAgent, 320) || '-'}
              </div>
              <details className="text-xs text-gray-700">
                <summary className="cursor-pointer select-none">
                  Stack / meta / userInfo
                </summary>
                <pre className="p-2 mt-2 overflow-x-auto text-[11px] leading-4 bg-gray-100 border border-gray-300 rounded whitespace-pre-wrap break-words">
{`stack: ${item.stack || '-'}
componentStack: ${item.componentStack || '-'}
meta: ${JSON.stringify(item.meta || null, null, 2)}
userInfo: ${JSON.stringify(item.userInfo || null, null, 2)}`}
                </pre>
              </details>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap justify-end gap-2 mt-3">
        <Button
          name="Назад"
          color="gray"
          disabled={offset <= 0 || loading}
          onClick={() => setOffset((prev) => Math.max(0, prev - limit))}
        />
        <Button
          name="Вперед"
          color="gray"
          disabled={loading || offset + limit >= total}
          onClick={() => setOffset((prev) => prev + limit)}
        />
      </div>
    </div>
  )
}

export default ClientErrorLogsContent

