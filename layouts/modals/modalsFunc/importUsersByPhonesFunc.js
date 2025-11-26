import Button from '@components/Button'
import { useState, useMemo, useCallback, useEffect } from 'react'

const normalizePhoneNumber = (value) => {
  if (value === null || value === undefined) return null
  const digits = String(value).replace(/\D+/g, '')
  if (!digits) return null
  let normalized = digits
  if (normalized.startsWith('8')) normalized = '7' + normalized.slice(1)
  if (!normalized.startsWith('7')) return null
  if (normalized.length !== 11) return null
  return normalized
}

const extractPhonesFromText = (text) => {
  if (!text) return []
  const rawParts = text
    .split(/[\n,;]+/g)
    .map((part) => part.trim())
    .filter(Boolean)
  const normalized = rawParts
    .map((part) => normalizePhoneNumber(part))
    .filter(Boolean)
  return Array.from(new Set(normalized))
}

const PHONE_FIELDS = ['phone', 'whatsapp', 'viber']

const importUsersByPhonesFunc = ({ usersSource, onConfirm }) => {
  const ImportUsersByPhonesModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
    setTopLeftComponent,
  }) => {
    const [rawValue, setRawValue] = useState('')
    const [checked, setChecked] = useState(false)
    const [foundUsersState, setFoundUsersState] = useState([])
    const [notFoundPhones, setNotFoundPhones] = useState([])
    const phonesIndex = useMemo(() => {
      const index = new Map()
      ;(usersSource || []).forEach((user) => {
        PHONE_FIELDS.forEach((field) => {
          const normalized = normalizePhoneNumber(user?.[field])
          if (!normalized) return
          if (!index.has(normalized)) index.set(normalized, [])
          index.get(normalized).push(user)
        })
      })
      return index
    }, [usersSource])

    const matchPhonesLocally = useCallback(
      (phones) => {
        const matchedUsers = []
        const matchedIds = new Set()
        const matchedPhonesSet = new Set()
        phones.forEach((phone) => {
          const usersByPhone = phonesIndex.get(phone)
          if (!usersByPhone?.length) return
          matchedPhonesSet.add(phone)
          usersByPhone.forEach((user) => {
            if (matchedIds.has(user._id)) return
            matchedIds.add(user._id)
            matchedUsers.push(user)
          })
        })
        const unmatchedPhones = phones.filter(
          (phone) => !matchedPhonesSet.has(phone)
        )
        return { matchedUsers, unmatchedPhones }
      },
      [phonesIndex]
    )

    useEffect(() => {
      setDisableConfirm(true)
      setOnConfirmFunc()
    }, [setDisableConfirm, setOnConfirmFunc])

    const handleCheckPhones = useCallback(() => {
      const normalizedPhones = extractPhonesFromText(rawValue)
      if (!normalizedPhones.length) {
        setChecked(true)
        setFoundUsersState([])
        setNotFoundPhones([])
        setDisableConfirm(true)
        setOnConfirmFunc()
        return
      }
      const localResult = matchPhonesLocally(normalizedPhones)
      setChecked(true)
      setFoundUsersState(localResult.matchedUsers)
      setNotFoundPhones(localResult.unmatchedPhones)
      if (localResult.matchedUsers.length) {
        setDisableConfirm(false)
        setOnConfirmFunc(() => {
          onConfirm && onConfirm(localResult.matchedUsers)
          closeModal()
        })
      } else {
        setDisableConfirm(true)
        setOnConfirmFunc()
      }
    }, [
      closeModal,
      matchPhonesLocally,
      onConfirm,
      setDisableConfirm,
      setOnConfirmFunc,
      rawValue,
    ])

    return (
      <div className="flex flex-col gap-3">
        <textarea
          className="placeholder:text-gray-400 w-full p-2 border rounded resize-y min-h-[120px]"
          placeholder="Вставьте телефоны через запятую или перенос строки"
          value={rawValue}
          onChange={(event) => setRawValue(event.target.value)}
        />
        <div className="flex justify-end">
          <Button
            name="Проверить"
            onClick={handleCheckPhones}
            disabled={!rawValue.trim()}
          />
        </div>
        {checked && (
          <div className="flex flex-col gap-2">
            <div className="font-semibold">
              Найдено пользователей: {foundUsersState.length}
            </div>
            {foundUsersState.length > 0 && (
              <div className="p-2 overflow-y-auto border rounded max-h-48">
                {foundUsersState.map((user) => (
                  <div key={user._id} className="text-sm">
                    {`${user.firstName || ''} ${user.secondName || ''}`.trim() ||
                      user.phone ||
                      user._id}
                  </div>
                ))}
              </div>
            )}
            {notFoundPhones.length > 0 && (
              <div>
                <div className="font-semibold">
                  Не найдены номера ({notFoundPhones.length}):
                </div>
                <div className="text-sm text-gray-600">
                  {notFoundPhones.join(', ')}
                </div>
              </div>
            )}
            {foundUsersState.length === 0 && (
              <div className="text-sm text-gray-600">
                Ни один пользователь не найден.
              </div>
            )}
          </div>
        )}
      </div>
    )
  }
  return {
    title: `Добавление пользователей по телефонам`,
    confirmButtonName: 'Добавить',
    Children: ImportUsersByPhonesModal,
  }
}

export default importUsersByPhonesFunc
