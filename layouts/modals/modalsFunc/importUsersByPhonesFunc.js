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

const ImportUsersByPhonesModal = ({
  closeModal,
  setOnConfirmFunc,
  setDisableConfirm,
  onImportConfirm,
  usersSource = [],
}) => {
  const [rawValue, setRawValue] = useState('')
  const [checked, setChecked] = useState(false)
  const [foundUsersState, setFoundUsersState] = useState([])
  const [notFoundPhones, setNotFoundPhones] = useState([])

  const phonesIndex = useMemo(() => {
    const index = new Map()
    ;(usersSource || []).forEach((user) => {
      ;['phone', 'whatsapp', 'viber'].forEach((field) => {
        const normalized = normalizePhoneNumber(user[field])
        if (!normalized) return
        if (!index.has(normalized)) index.set(normalized, [])
        index.get(normalized).push(user)
      })
    })
    return index
  }, [usersSource])

  const handleCheckPhones = useCallback(() => {
    const normalizedPhones = extractPhonesFromText(rawValue)
    const matchedUsers = []
    const matchedIds = new Set()
    const unmatchedPhones = []
    normalizedPhones.forEach((phone) => {
      const usersByPhone = phonesIndex.get(phone)
      if (usersByPhone?.length) {
        usersByPhone.forEach((user) => {
          if (!matchedIds.has(user._id)) {
            matchedIds.add(user._id)
            matchedUsers.push(user)
          }
        })
      } else {
        unmatchedPhones.push(phone)
      }
    })
    setChecked(true)
    setFoundUsersState(matchedUsers)
    setNotFoundPhones(unmatchedPhones)
  }, [phonesIndex, rawValue])

  useEffect(() => {
    if (!foundUsersState.length) {
      setDisableConfirm(true)
      setOnConfirmFunc()
      return
    }
    setDisableConfirm(false)
    setOnConfirmFunc(() => () => {
      if (foundUsersState.length) {
        onImportConfirm && onImportConfirm(foundUsersState)
      }
      closeModal()
    })
  }, [
    closeModal,
    foundUsersState,
    onImportConfirm,
    setDisableConfirm,
    setOnConfirmFunc,
  ])

  return (
    <div className="flex flex-col gap-3">
      <textarea
        className="w-full p-2 border rounded resize-y min-h-[120px]"
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

export default ImportUsersByPhonesModal
