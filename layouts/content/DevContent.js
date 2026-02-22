'use client'

import Button from '@components/Button'
import { getData, postData } from '@helpers/CRUD'
import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'
import locationAtom from '@state/atoms/locationAtom'
import modalsFuncAtom from '@state/modalsFuncAtom'
import loggedUserActiveRoleSelector from '@state/selectors/loggedUserActiveRoleSelector'
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
  const loggedUserActive = useAtomValue(loggedUserActiveAtom)
  const loggedUserActiveRole = useAtomValue(loggedUserActiveRoleSelector)
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
  const [loadingAttribution, setLoadingAttribution] = useState(false)
  const [attributionError, setAttributionError] = useState('')
  const [attributionSummary, setAttributionSummary] = useState(null)
  const [loadingCityPolicies, setLoadingCityPolicies] = useState(false)
  const [cityPoliciesError, setCityPoliciesError] = useState('')
  const [cityPolicies, setCityPolicies] = useState(null)
  const [loadingCities, setLoadingCities] = useState(false)
  const [citiesError, setCitiesError] = useState('')
  const [cities, setCities] = useState([])
  const [savingCitySlug, setSavingCitySlug] = useState('')
  const [newCity, setNewCity] = useState({
    slug: '',
    title: '',
    status: 'active',
    isVisibleInPublicSelector: true,
    timeZone: '',
    contactPhone: '',
    contactTelegram: '',
    allowRegistration: true,
    allowLogin: true,
    allowEventSignup: true,
    allowEventManagement: true,
    allowPublicListing: true,
    allowVkAuth: false,
  })

  const canManageCities = Boolean(
    loggedUserActiveRole?.dev || loggedUserActiveRole?.president
  )

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

  const loadAttributionSummary = async () => {
    if (!location || loadingAttribution) return

    setLoadingAttribution(true)
    setAttributionError('')
    const response = await getData(
      `/api/${location}/users/attribution-summary`,
      {},
      null,
      null,
      true
    )
    setLoadingAttribution(false)

    if (!response?.success) {
      setAttributionSummary(null)
      setAttributionError(
        response?.data?.error?.message || 'Не удалось получить UTM-отчет'
      )
      return
    }

    setAttributionSummary(response?.data || null)
  }

  const loadCityPolicies = async () => {
    if (!canManageCities || loadingCityPolicies) return

    setLoadingCityPolicies(true)
    setCityPoliciesError('')
    const response = await getData(
      '/api/global/content/city-policies',
      {},
      null,
      null,
      true
    )
    setLoadingCityPolicies(false)

    if (!response?.success) {
      setCityPolicies(null)
      setCityPoliciesError(
        response?.data?.error?.message || 'Не удалось получить политики городов'
      )
      return
    }

    setCityPolicies(response?.data?.cityPolicies || {})
  }

  const saveCityPolicyPatch = async (citySlug, patch) => {
    if (!canManageCities || !citySlug || !patch || savingCitySlug) return

    const previous = cityPolicies || {}
    const nextPolicy = {
      ...(previous[citySlug] || {}),
      ...patch,
    }
    const nextPolicies = {
      ...previous,
      [citySlug]: nextPolicy,
    }

    setSavingCitySlug(citySlug)
    setCityPolicies(nextPolicies)
    setCityPoliciesError('')

    const response = await postData(
      '/api/global/content/city-policies',
      {
        location: citySlug,
        policy: nextPolicy,
      },
      null,
      null,
      true,
      loggedUserActive?._id
    )

    if (!response?.success) {
      setCityPolicies(previous)
      setCityPoliciesError(
        response?.data?.error?.message || 'Не удалось сохранить политику города'
      )
      setSavingCitySlug('')
      return
    }

    setCityPolicies(response?.data?.cityPolicies || nextPolicies)
    setSavingCitySlug('')
  }

  const loadCities = async () => {
    if (!canManageCities || loadingCities) return

    setLoadingCities(true)
    setCitiesError('')
    const response = await getData('/api/global/cities', {}, null, null, true)
    setLoadingCities(false)

    if (!response?.success) {
      setCities([])
      setCitiesError(
        response?.data?.error?.message || 'Не удалось получить список городов'
      )
      return
    }

    setCities(response?.data?.cities || [])
  }

  const saveCity = async (citySlug, cityPatch) => {
    if (!canManageCities || !citySlug || savingCitySlug) return

    setSavingCitySlug(citySlug)
    setCitiesError('')
    const response = await fetch('/api/global/cities', {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          slug: citySlug,
          city: cityPatch,
        },
        userId: loggedUserActive?._id,
      }),
    }).then((res) => res.json())

    if (!response?.success) {
      setCitiesError(
        response?.data?.error?.message || 'Не удалось обновить параметры города'
      )
      setSavingCitySlug('')
      return
    }

    setCities(response?.data?.cities || [])
    setSavingCitySlug('')
    await loadCityPolicies()
  }

  const addCity = async () => {
    if (!canManageCities || savingCitySlug) return
    const slug = String(newCity.slug || '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '')

    if (!slug) {
      setCitiesError('Slug нового города обязателен')
      return
    }

    setSavingCitySlug(slug)
    setCitiesError('')
    const response = await postData(
      '/api/global/cities',
      {
        city: {
          ...newCity,
          slug,
        },
      },
      null,
      null,
      true,
      loggedUserActive?._id
    )

    if (!response?.success) {
      setCitiesError(
        response?.data?.error?.message || 'Не удалось добавить город'
      )
      setSavingCitySlug('')
      return
    }

    setCities(response?.data?.cities || [])
    setNewCity({
      slug: '',
      title: '',
      status: 'active',
      isVisibleInPublicSelector: true,
      timeZone: '',
      contactPhone: '',
      contactTelegram: '',
      allowRegistration: true,
      allowLogin: true,
      allowEventSignup: true,
      allowEventManagement: true,
      allowPublicListing: true,
    })
    setSavingCitySlug('')
    await loadCityPolicies()
  }

  const updateCityDraftField = (slug, field, value) => {
    setCities((prev) =>
      prev.map((city) =>
        city.slug === slug
          ? {
              ...city,
              [field]: value,
            }
          : city
      )
    )
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
      <Button
        name={
          loadingAttribution
            ? 'Собираем UTM-отчет...'
            : 'UTM-отчет по пользователям'
        }
        onClick={loadAttributionSummary}
        disabled={!location || loadingAttribution}
      />

      {phoneScanError ? (
        <div className="text-sm text-red-600">{phoneScanError}</div>
      ) : null}
      {duplicatesError ? (
        <div className="text-sm text-red-600">{duplicatesError}</div>
      ) : null}
      {attributionError ? (
        <div className="text-sm text-red-600">{attributionError}</div>
      ) : null}
      {cityPoliciesError ? (
        <div className="text-sm text-red-600">{cityPoliciesError}</div>
      ) : null}
      {citiesError ? (
        <div className="text-sm text-red-600">{citiesError}</div>
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

      {attributionSummary ? (
        <div className="rounded border border-sky-200 bg-sky-50/40 p-3 text-sm">
          <div className="font-semibold text-sky-800">UTM-сводка ({location})</div>
          <div className="mt-1 text-sky-900">
            Всего пользователей: <b>{attributionSummary.totalUsers}</b>
          </div>
          <div className="text-sky-900">
            С атрибуцией: <b>{attributionSummary.withAttribution}</b>
          </div>
          <div className="text-sky-900">
            Без атрибуции: <b>{attributionSummary.withoutAttribution}</b>
          </div>

          <div className="mt-2 grid gap-2 md:grid-cols-3">
            <div>
              <div className="font-semibold text-sky-800">Top Source</div>
              {(attributionSummary.topSources || []).map((item) => (
                <div key={`src-${item.key}`} className="text-xs text-sky-900">
                  {item.key}: {item.count}
                </div>
              ))}
            </div>
            <div>
              <div className="font-semibold text-sky-800">Top Medium</div>
              {(attributionSummary.topMediums || []).map((item) => (
                <div key={`med-${item.key}`} className="text-xs text-sky-900">
                  {item.key}: {item.count}
                </div>
              ))}
            </div>
            <div>
              <div className="font-semibold text-sky-800">Top Campaign</div>
              {(attributionSummary.topCampaigns || []).map((item) => (
                <div key={`cmp-${item.key}`} className="text-xs text-sky-900">
                  {item.key}: {item.count}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {canManageCities ? (
        <div className="rounded border border-indigo-200 bg-indigo-50/30 p-3 text-sm">
          <div className="mb-2 font-semibold text-indigo-900">
            Управление городами (dev/president)
          </div>

          <div className="mb-2 flex flex-wrap gap-2">
            <Button
              name={
                loadingCityPolicies
                  ? 'Загружаем политики городов...'
                  : 'Загрузить политики городов'
              }
              onClick={loadCityPolicies}
              disabled={loadingCityPolicies || Boolean(savingCitySlug)}
              outline
            />
            <Button
              name={
                loadingCities ? 'Загружаем список городов...' : 'Загрузить города'
              }
              onClick={loadCities}
              disabled={loadingCities || Boolean(savingCitySlug)}
              outline
            />
          </div>

          {cityPolicies ? (
            <div className="mb-3 rounded border border-indigo-100 bg-white p-2">
              <div className="mb-2 font-semibold text-indigo-800">
                Политики статусов городов
              </div>
              <div className="grid gap-2 md:grid-cols-3">
                {Object.entries(cityPolicies).map(([citySlug, policy]) => (
                  <div
                    key={`policy-${citySlug}`}
                    className="rounded border border-indigo-100 p-2"
                  >
                    <div className="mb-1 font-semibold text-gray-900">
                      {citySlug}
                    </div>
                    <label className="mb-1 block text-xs text-gray-700">
                      Статус
                      <select
                        className="mt-1 block w-full rounded border border-gray-300 p-1 text-xs"
                        value={policy?.status || 'active'}
                        onChange={(event) =>
                          saveCityPolicyPatch(citySlug, {
                            status: event.target.value,
                          })
                        }
                        disabled={Boolean(savingCitySlug)}
                      >
                        <option value="active">active</option>
                        <option value="closing">closing</option>
                        <option value="archived">archived</option>
                      </select>
                    </label>
                    <div className="grid grid-cols-2 gap-1 text-xs">
                      {[
                        ['allowRegistration', 'Регистрация'],
                        ['allowLogin', 'Логин'],
                        ['allowEventSignup', 'Запись'],
                        ['allowEventManagement', 'Управление'],
                        ['allowPublicListing', 'Публичный листинг'],
                        ['allowVkAuth', 'VK ID логин'],
                      ].map(([field, label]) => (
                        <label key={`${citySlug}-${field}`} className="flex gap-1">
                          <input
                            type="checkbox"
                            checked={Boolean(policy?.[field])}
                            onChange={(event) =>
                              saveCityPolicyPatch(citySlug, {
                                [field]: event.target.checked,
                              })
                            }
                            disabled={Boolean(savingCitySlug)}
                          />
                          <span>{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {cities.length > 0 ? (
            <div className="mb-3 rounded border border-indigo-100 bg-white p-2">
              <div className="mb-2 font-semibold text-indigo-800">
                Справочник городов
              </div>
              <div className="flex flex-col gap-2">
                {cities.map((city) => (
                  <div
                    key={`city-${city.slug}`}
                    className="rounded border border-indigo-100 p-2"
                  >
                    <div className="mb-2 text-xs font-semibold text-gray-900">
                      {city.slug}
                    </div>
                    <div className="grid gap-2 md:grid-cols-3">
                      <label className="text-xs text-gray-700">
                        Название
                        <input
                          className="mt-1 block w-full rounded border border-gray-300 p-1 text-xs"
                          value={city.title || ''}
                          onChange={(event) =>
                            updateCityDraftField(city.slug, 'title', event.target.value)
                          }
                        />
                      </label>
                      <label className="text-xs text-gray-700">
                        Часовой пояс
                        <input
                          className="mt-1 block w-full rounded border border-gray-300 p-1 text-xs"
                          value={city.timeZone || ''}
                          onChange={(event) =>
                            updateCityDraftField(
                              city.slug,
                              'timeZone',
                              event.target.value
                            )
                          }
                        />
                      </label>
                      <label className="text-xs text-gray-700">
                        Статус
                        <select
                          className="mt-1 block w-full rounded border border-gray-300 p-1 text-xs"
                          value={city.status || 'active'}
                          onChange={(event) =>
                            updateCityDraftField(city.slug, 'status', event.target.value)
                          }
                        >
                          <option value="active">active</option>
                          <option value="closing">closing</option>
                          <option value="archived">archived</option>
                        </select>
                      </label>
                      <label className="text-xs text-gray-700">
                        Контактный телефон
                        <input
                          className="mt-1 block w-full rounded border border-gray-300 p-1 text-xs"
                          value={city.contactPhone || ''}
                          onChange={(event) =>
                            updateCityDraftField(
                              city.slug,
                              'contactPhone',
                              event.target.value
                            )
                          }
                        />
                      </label>
                      <label className="text-xs text-gray-700">
                        Контактный Telegram
                        <input
                          className="mt-1 block w-full rounded border border-gray-300 p-1 text-xs"
                          value={city.contactTelegram || ''}
                          onChange={(event) =>
                            updateCityDraftField(
                              city.slug,
                              'contactTelegram',
                              event.target.value
                            )
                          }
                        />
                      </label>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-1 text-xs">
                      {[
                        ['isVisibleInPublicSelector', 'Виден в селекторе'],
                        ['allowRegistration', 'Регистрация'],
                        ['allowLogin', 'Логин'],
                        ['allowEventSignup', 'Запись'],
                        ['allowEventManagement', 'Управление'],
                        ['allowPublicListing', 'Публичный листинг'],
                        ['allowVkAuth', 'VK ID логин'],
                      ].map(([field, label]) => (
                        <label key={`${city.slug}-${field}`} className="flex gap-1">
                          <input
                            type="checkbox"
                            checked={Boolean(city[field])}
                            onChange={(event) =>
                              updateCityDraftField(
                                city.slug,
                                field,
                                event.target.checked
                              )
                            }
                          />
                          <span>{label}</span>
                        </label>
                      ))}
                    </div>
                    <div className="mt-2">
                      <Button
                        name={
                          savingCitySlug === city.slug
                            ? 'Сохраняем город...'
                            : 'Сохранить город'
                        }
                        onClick={() => saveCity(city.slug, city)}
                        disabled={Boolean(savingCitySlug)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="rounded border border-indigo-100 bg-white p-2">
            <div className="mb-2 font-semibold text-indigo-800">Добавить город</div>
            <div className="grid gap-2 md:grid-cols-3">
              <label className="text-xs text-gray-700">
                Slug
                <input
                  className="mt-1 block w-full rounded border border-gray-300 p-1 text-xs"
                  value={newCity.slug}
                  onChange={(event) =>
                    setNewCity((prev) => ({ ...prev, slug: event.target.value }))
                  }
                  placeholder="spb"
                />
              </label>
              <label className="text-xs text-gray-700">
                Название
                <input
                  className="mt-1 block w-full rounded border border-gray-300 p-1 text-xs"
                  value={newCity.title}
                  onChange={(event) =>
                    setNewCity((prev) => ({ ...prev, title: event.target.value }))
                  }
                  placeholder="Санкт-Петербург"
                />
              </label>
              <label className="text-xs text-gray-700">
                Часовой пояс
                <input
                  className="mt-1 block w-full rounded border border-gray-300 p-1 text-xs"
                  value={newCity.timeZone}
                  onChange={(event) =>
                    setNewCity((prev) => ({ ...prev, timeZone: event.target.value }))
                  }
                  placeholder="Europe/Moscow"
                />
              </label>
              <label className="text-xs text-gray-700">
                Контактный телефон
                <input
                  className="mt-1 block w-full rounded border border-gray-300 p-1 text-xs"
                  value={newCity.contactPhone}
                  onChange={(event) =>
                    setNewCity((prev) => ({
                      ...prev,
                      contactPhone: event.target.value,
                    }))
                  }
                  placeholder="+7..."
                />
              </label>
              <label className="text-xs text-gray-700">
                Контактный Telegram
                <input
                  className="mt-1 block w-full rounded border border-gray-300 p-1 text-xs"
                  value={newCity.contactTelegram}
                  onChange={(event) =>
                    setNewCity((prev) => ({
                      ...prev,
                      contactTelegram: event.target.value,
                    }))
                  }
                  placeholder="@citybot"
                />
              </label>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-1 text-xs">
              {[
                ['isVisibleInPublicSelector', 'Виден в селекторе'],
                ['allowRegistration', 'Регистрация'],
                ['allowLogin', 'Логин'],
                ['allowEventSignup', 'Запись'],
                ['allowEventManagement', 'Управление'],
                ['allowPublicListing', 'Публичный листинг'],
                ['allowVkAuth', 'VK ID логин'],
              ].map(([field, label]) => (
                <label key={`newcity-${field}`} className="flex gap-1">
                  <input
                    type="checkbox"
                    checked={Boolean(newCity[field])}
                    onChange={(event) =>
                      setNewCity((prev) => ({
                        ...prev,
                        [field]: event.target.checked,
                      }))
                    }
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
            <div className="mt-2">
              <Button
                name={savingCitySlug ? 'Сохраняем...' : 'Добавить город'}
                onClick={addCity}
                disabled={Boolean(savingCitySlug)}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default DevContent
