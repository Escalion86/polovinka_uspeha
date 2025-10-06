'use client'

import Image from 'next/image'
import { useMemo } from 'react'
import { useAtomValue } from 'jotai'

import achievementsAtom from '@state/atoms/achievementsAtom'
import achievementsUsersAtom from '@state/atoms/achievementsUsersAtom'
import eventsAtom from '@state/atoms/eventsAtom'
import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'
import formatDateTime from '@helpers/formatDateTime'
import cn from 'classnames'

const AchievementCard = ({ achievement, issuedAt, event, eventName, comment }) => {
  const hasImage = Boolean(achievement?.image)
  const eventTitle = event?.title || event?.name || eventName || ''

  const issuedLabel = issuedAt
    ? formatDateTime(
        issuedAt,
        true,
        false,
        false,
        false,
        undefined,
        true,
        true
      )
    : null

  return (
    <div className="flex flex-col overflow-hidden bg-white border border-gray-200 rounded-xl shadow-sm">
      {hasImage && (
        <div className="relative w-full h-40 bg-gray-100">
          <Image
            src={achievement.image}
            alt={achievement?.name ?? 'Достижение'}
            layout="fill"
            objectFit="cover"
            sizes="(max-width: 768px) 100vw, 300px"
            className="object-cover"
          />
        </div>
      )}
      <div className={cn('flex flex-col gap-y-2 p-4', { 'pt-4': !hasImage })}>
        <div className="text-lg font-semibold text-gray-900">
          {achievement?.name ?? 'Достижение удалено'}
        </div>
        {achievement?.description && (
          <div className="text-sm text-gray-700 whitespace-pre-line">
            {achievement.description}
          </div>
        )}
        {comment && (
          <div className="text-sm text-gray-700 whitespace-pre-line">
            {comment}
          </div>
        )}
        {issuedLabel && (
          <div className="mt-2 text-xs font-medium uppercase tracking-wide text-gray-500">
            Выдано {issuedLabel}
          </div>
        )}
        {eventTitle && (
          <div className="text-sm text-gray-600">
            Мероприятие: <span className="font-medium text-gray-800">{eventTitle}</span>
          </div>
        )}
      </div>
    </div>
  )
}

const MyAchievementsContent = () => {
  const loggedUser = useAtomValue(loggedUserActiveAtom)
  const achievements = useAtomValue(achievementsAtom)
  const achievementsUsers = useAtomValue(achievementsUsersAtom)
  const events = useAtomValue(eventsAtom)

  const userAchievements = useMemo(() => {
    if (!loggedUser?._id) return []

    return achievementsUsers
      ?.filter((item) => String(item.userId) === String(loggedUser._id))
      .map((item) => {
        const achievement = achievements.find(
          ({ _id }) => String(_id) === String(item.achievementId)
        )
        const event = events.find(({ _id }) => String(_id) === String(item.eventId))

        return {
          ...item,
          achievement,
          event,
        }
      })
      .sort((a, b) => new Date(b.issuedAt) - new Date(a.issuedAt))
  }, [achievementsUsers, achievements, events, loggedUser])

  if (!userAchievements || userAchievements.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-full p-4 text-center text-gray-600">
        Пока у вас нет достижений. Как только вы их получите, они появятся здесь.
      </div>
    )
  }

  return (
    <div className="grid w-full max-w-5xl grid-cols-1 gap-4 p-2 mx-auto tablet:grid-cols-2 xl:grid-cols-3">
      {userAchievements.map((item) => (
        <AchievementCard
          key={item._id}
          achievement={item.achievement}
          issuedAt={item.issuedAt}
          event={item.event ?? null}
          eventName={item.eventName}
          comment={item.comment}
        />
      ))}
    </div>
  )
}

export default MyAchievementsContent
