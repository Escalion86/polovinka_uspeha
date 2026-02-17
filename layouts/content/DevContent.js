'use client'

import Button from '@components/Button'
import { getData, postData } from '@helpers/CRUD'
import locationAtom from '@state/atoms/locationAtom'
import modalsFuncAtom from '@state/modalsFuncAtom'
import Link from 'next/link'
import { useState } from 'react'
import { useAtomValue } from 'jotai'

const MERGE_FIELDS = [
  { key: 'firstName', label: 'Имя' },
  { key: 'secondName', label: 'Фамилия' },
  { key: 'thirdName', label: 'Отчество' },
  { key: 'gender', label: 'Пол' },
  { key: 'birthday', label: 'Дата рождения' },
  { key: 'email', label: 'Email' },
  { key: 'whatsapp', label: 'WhatsApp' },
  { key: 'telegram', label: 'Telegram' },
  { key: 'instagram', label: 'Instagram' },
  { key: 'vk', label: 'VK' },
  { key: 'status', label: 'Статус' },
  { key: 'role', label: 'Роль' },
  { key: 'password', label: 'Пароль' },
  { key: 'notifications', label: 'Notifications' },
]

const formatMergeFieldValue = (fieldKey, item) => {
  if (fieldKey === 'password') {
    return item?.hasPassword ? '••••••' : '[не установлен]'
  }

  const value = item?.[fieldKey]

  if (value === null || value === undefined || value === '') {
    return '[пусто]'
  }

  if (typeof value === 'object') {
    try {
      const stringified = JSON.stringify(value)
      return stringified.length > 80
        ? `${stringified.slice(0, 80)}...`
        : stringified
    } catch (error) {
      return '[json error]'
    }
  }

  return String(value)
}

const DevContent = () => {
  const modalsFunc = useAtomValue(modalsFuncAtom)
  const location = useAtomValue(locationAtom)
  const [loadingPhones, setLoadingPhones] = useState(false)
  const [phoneScanError, setPhoneScanError] = useState('')
  const [phoneAnomalies, setPhoneAnomalies] = useState([])
  const [loadingDuplicates, setLoadingDuplicates] = useState(false)
  const [duplicatesError, setDuplicatesError] = useState('')
  const [duplicateGroups, setDuplicateGroups] = useState([])
  const [selectedPrimaryByPhone, setSelectedPrimaryByPhone] = useState({})
  const [fieldSourceByPhone, setFieldSourceByPhone] = useState({})
  const [mergingPhone, setMergingPhone] = useState('')
  const [previewLoadingPhone, setPreviewLoadingPhone] = useState('')
  const [previewByPhone, setPreviewByPhone] = useState({})

  const initMergeSelections = (groups) => {
    const nextPrimary = {}
    const nextFieldSource = {}

    groups.forEach((group) => {
      const primaryId = group?.suggestedPrimaryUserId || group?.items?.[0]?._id
      if (!primaryId) return
      nextPrimary[group.phone] = primaryId
      nextFieldSource[group.phone] = MERGE_FIELDS.reduce((acc, field) => {
        acc[field.key] = primaryId
        return acc
      }, {})
    })

    setSelectedPrimaryByPhone(nextPrimary)
    setFieldSourceByPhone(nextFieldSource)
  }

  const loadDuplicateUsers = async () => {
    if (!location || loadingDuplicates) return

    setLoadingDuplicates(true)
    setDuplicatesError('')
    const response = await getData(
      `/api/${location}/users/duplicates`,
      {},
      null,
      null,
      true
    )
    setLoadingDuplicates(false)

    if (!response?.success) {
      setDuplicateGroups([])
      setDuplicatesError(
        response?.data?.error?.message || 'Не удалось получить список дублей'
      )
      return
    }

    const groups = response?.data?.groups || []
    setDuplicateGroups(groups)
    initMergeSelections(groups)
  }

  const updatePrimary = (phone, userId) => {
    setSelectedPrimaryByPhone((prev) => ({ ...prev, [phone]: userId }))
    setFieldSourceByPhone((prev) => ({
      ...prev,
      [phone]: MERGE_FIELDS.reduce((acc, field) => {
        acc[field.key] = userId
        return acc
      }, {}),
    }))
  }

  const updateFieldSource = (phone, field, userId) => {
    setFieldSourceByPhone((prev) => ({
      ...prev,
      [phone]: {
        ...(prev[phone] || {}),
        [field]: userId,
      },
    }))
  }

  const mergeDuplicateGroup = async (group) => {
    if (!group || !location || mergingPhone) return
    const primaryUserId =
      selectedPrimaryByPhone[group.phone] || group.suggestedPrimaryUserId
    if (!primaryUserId) return

    const secondaryUserIds = (group.items || [])
      .map((item) => item._id)
      .filter((id) => id !== primaryUserId)

    if (secondaryUserIds.length === 0) {
      setDuplicatesError('Не выбраны вторичные аккаунты для merge')
      return
    }

    setMergingPhone(group.phone)
    setDuplicatesError('')
    const response = await postData(
      `/api/${location}/users/duplicates/merge`,
      {
        phone: group.phone,
        primaryUserId,
        secondaryUserIds,
        fieldSourceByField: fieldSourceByPhone[group.phone] || {},
      },
      null,
      null,
      true,
      null,
      true
    )
    setMergingPhone('')

    if (!response?.success) {
      setDuplicatesError(
        response?.data?.error?.message || 'Не удалось объединить дубли'
      )
      return
    }

    await loadDuplicateUsers()
    setPreviewByPhone((prev) => {
      const next = { ...prev }
      delete next[group.phone]
      return next
    })
  }

  const previewDuplicateGroup = async (group) => {
    if (!group || !location || previewLoadingPhone || mergingPhone) return
    const primaryUserId =
      selectedPrimaryByPhone[group.phone] || group.suggestedPrimaryUserId
    if (!primaryUserId) return

    const secondaryUserIds = (group.items || [])
      .map((item) => item._id)
      .filter((id) => id !== primaryUserId)

    if (secondaryUserIds.length === 0) {
      setDuplicatesError('Не выбраны вторичные аккаунты для предпросмотра')
      return
    }

    setPreviewLoadingPhone(group.phone)
    setDuplicatesError('')
    const response = await postData(
      `/api/${location}/users/duplicates/merge`,
      {
        phone: group.phone,
        primaryUserId,
        secondaryUserIds,
        fieldSourceByField: fieldSourceByPhone[group.phone] || {},
        dryRun: true,
      },
      null,
      null,
      true,
      null,
      true
    )
    setPreviewLoadingPhone('')

    if (!response?.success) {
      setDuplicatesError(
        response?.data?.error?.message || 'Не удалось получить предпросмотр'
      )
      return
    }

    setPreviewByPhone((prev) => ({
      ...prev,
      [group.phone]: response?.data?.transferResult || null,
    }))
  }

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
      <Button
        name={
          loadingDuplicates
            ? 'Ищем дубли пользователей...'
            : 'Найти дубли пользователей по телефону'
        }
        onClick={loadDuplicateUsers}
        disabled={!location || loadingDuplicates}
      />

      {phoneScanError ? (
        <div className="text-sm text-red-600">{phoneScanError}</div>
      ) : null}
      {duplicatesError ? (
        <div className="text-sm text-red-600">{duplicatesError}</div>
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

      {!loadingDuplicates && duplicateGroups.length > 0 ? (
        <div className="rounded border border-yellow-300 bg-yellow-50/40 p-3">
          <div className="mb-2 text-sm font-semibold text-yellow-800">
            Групп дублей по телефону: {duplicateGroups.length}
          </div>
          <div className="flex flex-col gap-4">
            {duplicateGroups.map((group) => {
              const selectedPrimary =
                selectedPrimaryByPhone[group.phone] || group.suggestedPrimaryUserId
              const preview = previewByPhone[group.phone]
              const hasSameEventPairs =
                (preview?.sameEventPairsAfterMerge || 0) > 0

              return (
                <div
                  key={group.phone}
                  className={`rounded border p-3 ${
                    hasSameEventPairs
                      ? 'border-orange-300 bg-orange-50/30'
                      : 'border-yellow-200 bg-white'
                  }`}
                >
                  <div className="mb-2 text-sm font-semibold text-gray-800">
                    Телефон: <span className="font-mono">{group.phone}</span>{' '}
                    (аккаунтов: {group.count})
                    {hasSameEventPairs ? (
                      <span className="ml-2 rounded bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-800">
                        Внимание: есть пересечения event/subEvent
                      </span>
                    ) : null}
                  </div>

                  <div className="grid gap-2 md:grid-cols-2">
                    {(group.items || []).map((item) => (
                      <label
                        key={item._id}
                        className="block rounded border border-gray-200 p-2 text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`primary-${group.phone}`}
                            checked={selectedPrimary === item._id}
                            onChange={() => updatePrimary(group.phone, item._id)}
                          />
                          <span className="font-semibold">{item.label}</span>
                        </div>
                        <div className="mt-1 text-xs text-gray-700">
                          ID: <span className="font-mono">{item._id}</span>
                        </div>
                        <div className="text-xs text-gray-700">
                          Записей на мероприятия: {item.eventsUsersCount}
                        </div>
                        <div className="text-xs text-gray-700">
                          Пароль: {item.hasPassword ? 'да' : 'нет'}
                        </div>
                        {(item.images || []).length > 0 ? (
                          <div className="mt-2">
                            <div className="text-xs text-gray-600">Фото:</div>
                            <div className="mt-1 flex flex-wrap gap-1">
                              {(item.images || []).slice(0, 6).map((src, idx) => (
                                <img
                                  key={`${item._id}-img-${idx}`}
                                  src={src}
                                  alt={`Фото ${idx + 1}`}
                                  className="h-12 w-12 rounded object-cover border border-gray-200"
                                />
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="mt-1 text-xs text-gray-500">
                            Фото отсутствуют
                          </div>
                        )}
                        <div className="mt-1">
                          <Link
                            href={item.userUrl}
                            className="text-xs font-semibold text-blue-700 hover:underline"
                          >
                            Открыть анкету
                          </Link>
                        </div>
                      </label>
                    ))}
                  </div>

                  <div className="mt-3 grid gap-2 md:grid-cols-2">
                    {MERGE_FIELDS.map((field) => (
                      <label key={field.key} className="text-xs text-gray-700">
                        {field.label}
                        <select
                          className="mt-1 block w-full rounded border border-gray-300 p-1 text-xs"
                          value={
                            fieldSourceByPhone[group.phone]?.[field.key] ||
                            selectedPrimary
                          }
                          onChange={(event) =>
                            updateFieldSource(
                              group.phone,
                              field.key,
                              event.target.value
                            )
                          }
                        >
                          {(group.items || []).map((item, index) => (
                            <option key={item._id} value={item._id}>
                              {`${index + 1}. ${formatMergeFieldValue(
                                field.key,
                                item
                              )}`}
                            </option>
                          ))}
                        </select>
                      </label>
                    ))}
                  </div>

                  <div className="mt-3">
                    <div className="mb-2">
                      <Button
                        name={
                          previewLoadingPhone === group.phone
                            ? 'Считаем предпросмотр...'
                            : 'Предпросмотр merge (dry-run)'
                        }
                        onClick={() => previewDuplicateGroup(group)}
                        disabled={Boolean(previewLoadingPhone || mergingPhone)}
                        outline
                      />
                    </div>
                    {preview ? (
                      <div className="mb-2 rounded border border-blue-200 bg-blue-50 p-2 text-xs text-blue-900">
                        <div>
                          Будет перенесено записей в мероприятия:{' '}
                          <b>{preview.movedEventUsers}</b>
                        </div>
                        <div>
                          Совпадающих пар event/subEvent после merge:{' '}
                          <b
                            className={
                              hasSameEventPairs ? 'text-orange-700' : ''
                            }
                          >
                            {preview.sameEventPairsAfterMerge}
                          </b>
                        </div>
                        <div>
                          Обновляемые поля: <b>{preview.updatedPrimaryFields?.join(', ')}</b>
                        </div>
                        {(preview.details || []).length > 0 ? (
                          <div className="mt-1">
                            {(preview.details || []).map((detail) => (
                              <div key={detail.secondaryUserId}>
                                {detail.secondaryUserId}: перенести{' '}
                                {detail.movedEventUsers}, совпадающих пар{' '}
                                {detail.sameEventPairsAfterMerge}
                              </div>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                    <Button
                      name={
                        mergingPhone === group.phone
                          ? 'Объединяем...'
                          : 'Объединить аккаунты'
                      }
                      onClick={() => mergeDuplicateGroup(group)}
                      disabled={Boolean(mergingPhone)}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default DevContent
