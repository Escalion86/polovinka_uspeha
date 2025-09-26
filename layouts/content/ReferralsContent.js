'use client'

import Button from '@components/Button'
import LoadingSpinner from '@components/LoadingSpinner'
import Note from '@components/Note'
import formatDate from '@helpers/formatDate'
import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'
import locationAtom from '@state/atoms/locationAtom'
import usersAtomAsync from '@state/async/usersAtomAsync'
import cn from 'classnames'
import { useAtomValue } from 'jotai'
import { useEffect, useMemo, useState } from 'react'

const ReferralsContent = () => {
  const loggedUser = useAtomValue(loggedUserActiveAtom)
  const location = useAtomValue(locationAtom)
  const users = useAtomValue(usersAtomAsync)

  const [origin, setOrigin] = useState('')
  const [copyStatus, setCopyStatus] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin)
    }
  }, [])

  useEffect(() => {
    if (copyStatus) {
      const timer = setTimeout(() => setCopyStatus(''), 3000)
      return () => clearTimeout(timer)
    }
  }, [copyStatus])

  const referralPath = useMemo(() => {
    if (!loggedUser?._id || !location) return ''
    return `/${location}/login?ref=${loggedUser._id}`
  }, [loggedUser?._id, location])

  const referralLink = useMemo(() => {
    if (!referralPath) return ''
    return origin ? `${origin}${referralPath}` : referralPath
  }, [origin, referralPath])

  const referrals = useMemo(() => {
    if (!Array.isArray(users) || !loggedUser?._id) return []
    return users.filter(
      (user) =>
        user?.referrerId && String(user.referrerId) === String(loggedUser._id)
    )
  }, [users, loggedUser?._id])

  const sortedReferrals = useMemo(() => {
    return [...referrals].sort((a, b) => {
      const dateA = a?.createdAt ? new Date(a.createdAt).getTime() : 0
      const dateB = b?.createdAt ? new Date(b.createdAt).getTime() : 0
      return dateB - dateA
    })
  }, [referrals])

  const handleCopy = async () => {
    if (!referralLink) return

    try {
      await navigator.clipboard.writeText(referralLink)
      setCopyStatus('Ссылка скопирована в буфер обмена')
    } catch (error) {
      setCopyStatus('Не удалось автоматически скопировать ссылку')
    }
  }

  if (!loggedUser?._id) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner text="Загрузка профиля..." />
      </div>
    )
  }

  if (!Array.isArray(users)) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner text="Загрузка списка пользователей..." />
      </div>
    )
  }

  const isCopyError = copyStatus.startsWith('Не удалось')

  return (
    <div className="flex flex-col gap-y-4 px-1 pb-4">
      <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="text-lg font-semibold text-general">
          Ваша реферальная ссылка
        </div>
        <div className="mt-2 text-sm break-all text-gray-700">
          {referralLink || 'Ссылка появится после загрузки данных пользователя'}
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-3">
          <Button
            name="Скопировать ссылку"
            onClick={handleCopy}
            disabled={!referralLink}
          />
          {copyStatus && (
            <span
              className={cn(
                'text-sm',
                isCopyError ? 'text-red-600' : 'text-success'
              )}
            >
              {copyStatus}
            </span>
          )}
        </div>
        <Note className="mt-3">
          Поделитесь этой ссылкой с друзьями. После регистрации по ней вы
          увидите их в списке своих рефералов.
        </Note>
      </div>

      <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold text-general">
            Мои рефералы
          </div>
          <div className="text-sm text-gray-600">
            {sortedReferrals.length}
            {' '}
            {sortedReferrals.length === 1
              ? 'приглашенный пользователь'
              : 'приглашенных пользователей'}
          </div>
        </div>
        {sortedReferrals.length === 0 ? (
          <div className="mt-4 text-gray-600">
            Пока нет пользователей, зарегистрировавшихся по вашей ссылке.
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left border border-gray-200 divide-y divide-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-sm font-medium text-gray-600">
                    Имя
                  </th>
                  <th className="px-4 py-2 text-sm font-medium text-gray-600">
                    Телефон
                  </th>
                  <th className="px-4 py-2 text-sm font-medium text-gray-600">
                    Дата регистрации
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedReferrals.map((user) => (
                  <tr key={user._id}>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {[user.secondName, user.firstName, user.thirdName]
                        .filter(Boolean)
                        .join(' ') || '—'}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {user.phone ? `+${user.phone}` : '—'}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {user.createdAt ? formatDate(user.createdAt) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReferralsContent
