'use client'

import Button from '@components/Button'
import { getData } from '@helpers/CRUD'
import locationAtom from '@state/atoms/locationAtom'
import modalsFuncAtom from '@state/modalsFuncAtom'
import Link from 'next/link'
import { useState } from 'react'
import { useAtomValue } from 'jotai'

const DevContent = () => {
  const modalsFunc = useAtomValue(modalsFuncAtom)
  const location = useAtomValue(locationAtom)
  const [loadingPhones, setLoadingPhones] = useState(false)
  const [phoneScanError, setPhoneScanError] = useState('')
  const [phoneAnomalies, setPhoneAnomalies] = useState([])

  const loadPhoneAnomalies = async () => {
    if (!location || loadingPhones) return

    setLoadingPhones(true)
    setPhoneScanError('')
    const response = await getData(
      `/api/${location}/users/phone-anomalies`,
      {},
      null,
      null,
      true
    )
    setLoadingPhones(false)

    if (!response?.success) {
      setPhoneAnomalies([])
      setPhoneScanError(
        response?.data?.error?.message || 'Не удалось получить список аномалий'
      )
      return
    }

    setPhoneAnomalies(response?.data?.items || [])
  }

  return (
    <div className="flex flex-col gap-y-3">
      <Button name="AI" onClick={() => modalsFunc.external.ai()} />
      <Button
        name={
          loadingPhones
            ? 'Проверяем аномалии телефонов...'
            : 'Проверить аномалии телефонов'
        }
        onClick={loadPhoneAnomalies}
        disabled={!location || loadingPhones}
      />

      {phoneScanError ? (
        <div className="text-sm text-red-600">{phoneScanError}</div>
      ) : null}

      {!loadingPhones && phoneAnomalies.length > 0 ? (
        <div className="rounded border border-red-200 bg-red-50/40 p-3">
          <div className="mb-2 text-sm font-semibold text-red-700">
            Найдено анкет с подозрительными телефонами: {phoneAnomalies.length}
          </div>
          <div className="flex flex-col gap-2">
            {phoneAnomalies.map((item) => (
              <div
                key={item._id}
                className="rounded border border-red-100 bg-white p-2 text-sm"
              >
                <div className="font-semibold text-gray-800">{item.name}</div>
                <div className="text-gray-700">
                  Телефон: <span className="font-mono">{item.phone || '-'}</span>
                </div>
                <div className="text-gray-600">
                  Нормализованный:{' '}
                  <span className="font-mono">{item.normalizedPhone || '-'}</span>
                </div>
                <div className="text-red-700">
                  Причины: {item.reasonLabels?.join(', ') || '-'}
                </div>
                <Link
                  href={item.userUrl}
                  className="text-sm font-semibold text-blue-700 hover:underline"
                >
                  Открыть анкету
                </Link>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default DevContent
