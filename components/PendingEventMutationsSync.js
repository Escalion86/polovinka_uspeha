'use client'

import Button from '@components/Button'
import locationAtom from '@state/atoms/locationAtom'
import itemsFuncAtom from '@state/itemsFuncAtom'
import {
  clearPendingEventMutationsForLocation,
  getPendingEventMutationsForLocation,
  PENDING_EVENT_MUTATIONS_CHANGED_EVENT,
} from '@utils/pendingEventMutations'
import { useAtomValue } from 'jotai'
import { useCallback, useEffect, useMemo, useState } from 'react'

const PendingEventMutationsSync = () => {
  const location = useAtomValue(locationAtom)
  const itemsFunc = useAtomValue(itemsFuncAtom)
  const [items, setItems] = useState([])
  const [isRetrying, setIsRetrying] = useState(false)

  const refreshItems = useCallback(() => {
    if (!location) {
      setItems([])
      return
    }

    setItems(getPendingEventMutationsForLocation(location))
  }, [location])

  const retryPending = useCallback(
    async ({ silent = false, force = false } = {}) => {
      if (!location || typeof itemsFunc?.event?.retryPending !== 'function')
        return

      setIsRetrying(true)
      try {
        await itemsFunc.event.retryPending({ silent, force })
      } finally {
        refreshItems()
        setIsRetrying(false)
      }
    },
    [itemsFunc, location, refreshItems]
  )

  useEffect(() => {
    refreshItems()

    const handleQueueChange = () => refreshItems()
    const handleOnline = () => {
      void retryPending({ silent: true })
    }

    window.addEventListener(PENDING_EVENT_MUTATIONS_CHANGED_EVENT, handleQueueChange)
    window.addEventListener('storage', handleQueueChange)
    window.addEventListener('online', handleOnline)

    return () => {
      window.removeEventListener(
        PENDING_EVENT_MUTATIONS_CHANGED_EVENT,
        handleQueueChange
      )
      window.removeEventListener('storage', handleQueueChange)
      window.removeEventListener('online', handleOnline)
    }
  }, [refreshItems, retryPending])

  const failedCount = useMemo(
    () => items.filter((item) => item.status === 'failed').length,
    [items]
  )

  const handleClear = () => {
    if (!location) return
    const isConfirmed = window.confirm(
      'Удалить локально сохраненные изменения мероприятий?'
    )
    if (!isConfirmed) return

    clearPendingEventMutationsForLocation(location)
    refreshItems()
  }

  if (!location || items.length === 0) return null

  return (
    <div className="fixed bottom-4 left-4 z-[90] flex max-w-[calc(100vw-2rem)] flex-col gap-2 rounded-md border border-amber-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-lg laptop:left-auto laptop:right-4 laptop:max-w-[420px]">
      <div className="font-medium">
        Есть несохраненные изменения мероприятий: {items.length}
      </div>
      {failedCount > 0 && (
        <div className="text-xs text-amber-700">
          Не удалось отправить: {failedCount}
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        <Button
          name="Повторить"
          thin
          loading={isRetrying}
          loadingText="отправка"
          onClick={() => retryPending({ force: true })}
        />
        <Button
          name="Сбросить"
          thin
          outline
          disabled={isRetrying}
          onClick={handleClear}
        />
      </div>
    </div>
  )
}

export default PendingEventMutationsSync
