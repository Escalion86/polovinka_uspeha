'use client'

import ContentHeader from '@components/ContentHeader'
import AddButton from '@components/IconToggleButtons/AddButton'
import AboutSpaceCard from '@layouts/cards/AboutSpaceCard'
import CardListWrapper from '@layouts/wrappers/CardListWrapper'
import { getData, postData } from '@helpers/CRUD'
import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'
import modalsFuncAtom from '@state/modalsFuncAtom'
import loggedUserActiveRoleSelector from '@state/selectors/loggedUserActiveRoleSelector'
import { useAtomValue } from 'jotai'
import { useCallback, useEffect, useMemo, useState } from 'react'

const createId = () => `${Date.now()}-${Math.round(Math.random() * 1e6)}`

const normalizeCards = (cards) => {
  const source = Array.isArray(cards) ? cards : []
  return [...source]
    .map((item, index) => ({
      id: item.id ?? `about-${index}`,
      title: item.title ?? '',
      text: item.text ?? '',
      wide: Boolean(item.wide),
      tone: item.tone ?? 'white',
      bgMode: item.bgMode ?? null,
      bgColor1: item.bgColor1 ?? null,
      bgColor2: item.bgColor2 ?? null,
      index: typeof item.index === 'number' ? item.index : index,
    }))
    .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
}

const AboutSpaceContent = () => {
  const loggedUserActive = useAtomValue(loggedUserActiveAtom)
  const loggedUserActiveRole = useAtomValue(loggedUserActiveRoleSelector)
  const modalsFunc = useAtomValue(modalsFuncAtom)
  const [isSaving, setIsSaving] = useState(false)
  const [globalCards, setGlobalCards] = useState(null)

  useEffect(() => {
    let isMounted = true

    const loadGlobalCards = async () => {
      const data = await getData('/api/global/content/about-space-cards')
      if (!isMounted) return
      if (Array.isArray(data?.aboutSpaceCards) && data.aboutSpaceCards.length) {
        setGlobalCards(data.aboutSpaceCards)
      } else {
        setGlobalCards([])
      }
    }

    loadGlobalCards()

    return () => {
      isMounted = false
    }
  }, [])

  const cards = useMemo(
    () => normalizeCards(globalCards),
    [globalCards]
  )

  const canEdit = Boolean(
    loggedUserActiveRole?.dev || loggedUserActiveRole?.president
  )

  const saveCards = useCallback(
    async (nextCards) => {
      setIsSaving(true)
      const prevGlobalCards = globalCards
      const prepared = nextCards.map((item, index) => ({
        id: item.id ?? createId(),
        title: item.title ?? '',
        text: item.text ?? '',
        wide: Boolean(item.wide),
        tone: item.tone ?? 'white',
        bgMode: item.bgMode ?? null,
        bgColor1: item.bgColor1 ?? null,
        bgColor2: item.bgColor2 ?? null,
        index,
      }))

      setGlobalCards(prepared)

      const globalData = await postData(
        '/api/global/content/about-space-cards',
        {
          aboutSpaceCards: prepared,
        },
        null,
        null,
        false,
        loggedUserActive?._id
      )

      if (Array.isArray(globalData?.aboutSpaceCards)) {
        setGlobalCards(globalData.aboutSpaceCards)
        setIsSaving(false)
        return
      }

      setGlobalCards(prevGlobalCards ?? [])
      setIsSaving(false)
    },
    [globalCards, loggedUserActive?._id]
  )

  const handleAdd = useCallback(() => {
    modalsFunc.aboutSpace.add((newItem) => {
      const next = [
        ...cards,
        { ...newItem, id: createId(), tone: newItem.tone ?? 'white' },
      ]
      saveCards(next)
    })
  }, [cards, modalsFunc.aboutSpace, saveCards])

  const handleEdit = useCallback(
    (card) => {
      modalsFunc.aboutSpace.edit(card, (updated) => {
        const next = cards.map((item) =>
          item.id === card.id ? { ...item, ...updated } : item
        )
        saveCards(next)
      })
    },
    [cards, modalsFunc.aboutSpace, saveCards]
  )

  const handleDelete = useCallback(
    (card) => {
      modalsFunc.confirm({
        title: 'Удаление карточки',
        text: 'Вы уверены, что хотите удалить карточку?',
        onConfirm: () => {
          const next = cards.filter((item) => item.id !== card.id)
          saveCards(next)
        },
      })
    },
    [cards, modalsFunc, saveCards]
  )

  const handleClone = useCallback(
    (card) => {
      const index = cards.findIndex((item) => item.id === card.id)
      const cloned = { ...card, id: createId() }
      const next = [...cards]
      next.splice(index + 1, 0, cloned)
      saveCards(next)
    },
    [cards, saveCards]
  )

  const moveCard = useCallback(
    (card, direction) => {
      const index = cards.findIndex((item) => item.id === card.id)
      const newIndex = index + direction
      if (index < 0 || newIndex < 0 || newIndex >= cards.length) return
      const next = [...cards]
      const [removed] = next.splice(index, 1)
      next.splice(newIndex, 0, removed)
      saveCards(next)
    },
    [cards, saveCards]
  )

  return (
    <>
      <ContentHeader>
        <div className="flex items-center justify-end flex-1 flex-nowrap gap-x-2">
          <div className="text-lg font-bold whitespace-nowrap">
            {`Карточек: ${cards.length}`}
          </div>
          {canEdit && <AddButton onClick={handleAdd} />}
        </div>
      </ContentHeader>
      <CardListWrapper>
        {cards.length > 0 ? (
          <div className="grid gap-6 px-3 py-3 mt-2 tablet:px-4 lg:grid-cols-2">
            {cards.map((card, index) => (
              <AboutSpaceCard
                key={card.id}
                card={card}
                onEdit={canEdit ? () => handleEdit(card) : undefined}
                onMoveUp={
                  canEdit && index > 0 ? () => moveCard(card, -1) : undefined
                }
                onMoveDown={
                  canEdit && index < cards.length - 1
                    ? () => moveCard(card, 1)
                    : undefined
                }
                onClone={canEdit ? () => handleClone(card) : undefined}
                onDelete={canEdit ? () => handleDelete(card) : undefined}
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

export default AboutSpaceContent
