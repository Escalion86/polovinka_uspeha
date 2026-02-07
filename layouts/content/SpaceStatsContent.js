'use client'

import ContentHeader from '@components/ContentHeader'
import AddButton from '@components/IconToggleButtons/AddButton'
import SpaceStatsCard from '@layouts/cards/SpaceStatsCard'
import CardListWrapper from '@layouts/wrappers/CardListWrapper'
import { postData } from '@helpers/CRUD'
import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'
import locationAtom from '@state/atoms/locationAtom'
import siteSettingsAtom from '@state/atoms/siteSettingsAtom'
import modalsFuncAtom from '@state/modalsFuncAtom'
import loggedUserActiveRoleSelector from '@state/selectors/loggedUserActiveRoleSelector'
import { useAtom, useAtomValue } from 'jotai'
import { useCallback, useMemo, useState } from 'react'

const DEFAULT_STATS = [
  {
    id: 'default-1',
    number: '800+',
    text: 'мероприятий организовано и проведено',
  },
  {
    id: 'default-2',
    number: '1500+',
    text: 'человек посетили наши мероприятия',
  },
  {
    id: 'default-3',
    number: '50+',
    text: 'пар нашли друг друга, из них 2 пары поженились и родились 2 детей',
  },
  {
    id: 'default-4',
    number: '400+',
    text: 'людей нашли друзей и единомышленников',
  },
  {
    id: 'default-5',
    number: '10+',
    text: 'благотворительных мероприятий направленных на помощь животным, детям и домам престарелых',
  },
  {
    id: 'default-6',
    number: '20+',
    text: 'туров и поездок было организовано и проведено',
  },
]

const createId = () => `${Date.now()}-${Math.round(Math.random() * 1e6)}`

const normalizeStats = (stats) => {
  const source =
    Array.isArray(stats) && stats.length > 0 ? stats : DEFAULT_STATS
  return [...source]
    .map((item, index) => ({
      id: item.id ?? `stat-${index}`,
      number: item.number ?? '',
      text: item.text ?? '',
      index: typeof item.index === 'number' ? item.index : index,
    }))
    .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
}

const SpaceStatsContent = () => {
  const location = useAtomValue(locationAtom)
  const loggedUserActive = useAtomValue(loggedUserActiveAtom)
  const loggedUserActiveRole = useAtomValue(loggedUserActiveRoleSelector)
  const modalsFunc = useAtomValue(modalsFuncAtom)
  const [siteSettings, setSiteSettings] = useAtom(siteSettingsAtom)
  const [isSaving, setIsSaving] = useState(false)

  const stats = useMemo(
    () => normalizeStats(siteSettings?.spaceStats),
    [siteSettings]
  )

  const canEdit =
    loggedUserActiveRole?.generalPage?.spaceStats ||
    loggedUserActiveRole?.generalPage?.additionalBlocks ||
    loggedUserActiveRole?.dev

  const saveStats = useCallback(
    async (nextStats) => {
      if (!location) return
      const prevSettings = siteSettings
      setIsSaving(true)
      const prepared = nextStats.map((item, index) => ({
        id: item.id ?? createId(),
        number: item.number,
        text: item.text,
        index,
      }))

      setSiteSettings((prev) => ({
        ...(prev || {}),
        spaceStats: prepared,
      }))

      await postData(
        `/api/${location}/site`,
        {
          spaceStats: prepared,
        },
        (data) => {
          setSiteSettings((prev) => ({
            ...(prev || {}),
            ...(data || {}),
            spaceStats: Array.isArray(data?.spaceStats)
              ? data.spaceStats
              : prepared,
          }))
          setIsSaving(false)
        },
        () => {
          if (prevSettings) setSiteSettings(prevSettings)
          setIsSaving(false)
        },
        false,
        loggedUserActive?._id
      )
    },
    [location, loggedUserActive?._id, setSiteSettings, siteSettings]
  )

  const handleAdd = useCallback(() => {
    modalsFunc.spaceStats.add((newItem) => {
      const next = [...stats, { ...newItem, id: createId() }]
      saveStats(next)
    })
  }, [modalsFunc.spaceStats, saveStats, stats])

  const handleEdit = useCallback(
    (stat) => {
      modalsFunc.spaceStats.edit(stat, (updated) => {
        const next = stats.map((item) =>
          item.id === stat.id ? { ...item, ...updated } : item
        )
        saveStats(next)
      })
    },
    [modalsFunc.spaceStats, saveStats, stats]
  )

  const handleDelete = useCallback(
    (stat) => {
      modalsFunc.confirm({
        title: 'Удаление карточки',
        text: 'Вы уверены, что хотите удалить карточку?',
        onConfirm: () => {
          const next = stats.filter((item) => item.id !== stat.id)
          saveStats(next)
        },
      })
    },
    [modalsFunc, saveStats, stats]
  )

  const handleClone = useCallback(
    (stat) => {
      const index = stats.findIndex((item) => item.id === stat.id)
      const cloned = {
        ...stat,
        id: createId(),
      }
      const next = [...stats]
      next.splice(index + 1, 0, cloned)
      saveStats(next)
    },
    [saveStats, stats]
  )

  const moveStat = useCallback(
    (stat, direction) => {
      const index = stats.findIndex((item) => item.id === stat.id)
      const newIndex = index + direction
      if (index < 0 || newIndex < 0 || newIndex >= stats.length) return
      const next = [...stats]
      const [removed] = next.splice(index, 1)
      next.splice(newIndex, 0, removed)
      saveStats(next)
    },
    [saveStats, stats]
  )

  return (
    <>
      <ContentHeader>
        <div className="flex items-center justify-end flex-1 flex-nowrap gap-x-2">
          <div className="text-lg font-bold whitespace-nowrap">
            {`Карточек: ${stats.length}`}
          </div>
          {canEdit && <AddButton onClick={handleAdd} />}
        </div>
      </ContentHeader>
      <CardListWrapper>
        {stats.length > 0 ? (
          <div className="grid gap-4 px-3 tablet:px-4 sm:grid-cols-2 lg:grid-cols-3">
            {stats.map((stat, index) => (
              <SpaceStatsCard
                key={stat.id}
                stat={stat}
                onEdit={canEdit ? () => handleEdit(stat) : undefined}
                onMoveUp={
                  canEdit && index > 0 ? () => moveStat(stat, -1) : undefined
                }
                onMoveDown={
                  canEdit && index < stats.length - 1
                    ? () => moveStat(stat, 1)
                    : undefined
                }
                onClone={canEdit ? () => handleClone(stat) : undefined}
                onDelete={canEdit ? () => handleDelete(stat) : undefined}
              />
            ))}
          </div>
        ) : (
          <div className="flex justify-center p-2">Нет карточек</div>
        )}
        {isSaving && (
          <div className="mt-4 text-sm text-center text-gray-500">
            Сохраняем изменения...
          </div>
        )}
      </CardListWrapper>
    </>
  )
}

export default SpaceStatsContent
