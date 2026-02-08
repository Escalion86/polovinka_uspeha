'use client'

import ContentHeader from '@components/ContentHeader'
import AddButton from '@components/IconToggleButtons/AddButton'
import AboutSpaceCard from '@layouts/cards/AboutSpaceCard'
import CardListWrapper from '@layouts/wrappers/CardListWrapper'
import { postData } from '@helpers/CRUD'
import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'
import locationAtom from '@state/atoms/locationAtom'
import siteSettingsAtom from '@state/atoms/siteSettingsAtom'
import modalsFuncAtom from '@state/modalsFuncAtom'
import loggedUserActiveRoleSelector from '@state/selectors/loggedUserActiveRoleSelector'
import { useAtom, useAtomValue } from 'jotai'
import { useCallback, useMemo, useState } from 'react'

const DEFAULT_ABOUT_CARDS = [
  {
    id: 'about-1',
    tone: 'white',
    wide: true,
    title: '',
    text: `<p>Каждый день похож на предыдущий: работа, заботы, спорт, домашние дела, дети, редкие встречи с друзьями. Жизнь вроде идёт, но чего-то не хватает тепла, спонтанности, человеческого контакта. Тебе хочется просто расслабиться и побыть среди «своих» самим собой, где не нужно играть роли и подбирать слова?</p><p><strong>ПРОСТРАНСТВО ЖИВЫХ ВСТРЕЧ «ПОЛОВИНКА УСПЕХА»</strong> — это пространство лёгкости и живого общения.</p>`,
  },
  {
    id: 'about-2',
    tone: 'burgundy',
    wide: false,
    title: 'УЖЕ БОЛЕЕ ЧЕТЫРЕХ ЛЕТ МЫ СОЗДАЁМ АТМОСФЕРУ, ГДЕ МОЖНО:',
    text: `<ul><li>просто быть самим собой</li><li>отдыхать от суеты и дел</li><li>наслаждаться общением</li><li>открывать для себя новых людей естественно, без ожиданий и масок</li><li>встретить свою вторую половинку</li><li>обрести новых друзей и единомышленников в своих увлечениях</li><li>расширить круг деловых связей и партнеров</li><li>научиться чему-то новому и получить новый опыт и эмоции</li><li>весело провести время и просто потусоваться с такими же людьми, как ты</li></ul>`,
  },
  {
    id: 'about-3',
    tone: 'blue',
    wide: false,
    title: 'НАШЕ ПРОСТРАНСТВО, ДЛЯ:',
    text: `<ul><li>активных и современных людей, которым хочется больше жизни, эмоций и близкого общения без формальностей и натянутости</li><li>тех, кто устал от шаблонных встреч и бесконечных экранов телефона и телевизора</li><li>тех, кто хочет настоящих впечатлений, лёгкости и искренних связей</li></ul>`,
  },
  {
    id: 'about-4',
    tone: 'white',
    wide: true,
    title: 'Что такое ПРОСТРАНСТВО «ПОЛОВИНКА УСПЕХА»?',
    text: `<p>Это пространство живых встреч - вечера, выезды, мастер-классы, игры, прогулки, автоквесты, путешествия. Мы объединяем людей, которые хотят проводить время интересно и по-настоящему: улыбаться, смеяться, открываться, вдохновляться, учиться новому и наполняться энергией общения. Здесь нет цели «кого-то найти», зато часто случаются новые дружбы, тёплые связи и даже истории, с которых начинается что-то большее.</p>`,
  },
  {
    id: 'about-5',
    tone: 'burgundy',
    wide: false,
    title: 'Что получает участник нашего ПРОСТРАНСТВА:',
    text: `<ul><li>атмосферу лёгкости, принятия и живого интереса</li><li>ощущение сопричастности и «своей стаи»</li><li>новые впечатления, вдохновение и энергию жизни</li><li>возможность раскрыться, почувствовать себя естественно и уверенно</li><li>расширение круга общения - органично, без давления и формальностей</li></ul>`,
  },
  {
    id: 'about-6',
    tone: 'blue',
    wide: false,
    title: 'ПОЧЕМУ ЛЮДИ ПРИХОДЯТ В НАШЕ ПРОСТРАНСТВО:',
    text: `<ul><li><strong>Сбалансированные форматы:</strong> мероприятия под настроение от камерных игр до выездов на природу</li><li><strong>Тонкая модерация:</strong> ведущие создают атмосферу вовлечённости и лёгкости, помогая каждому раскрыться</li><li><strong>Аудитория по ценностям:</strong> здесь собираются люди, близкие по взглядам, стилю жизни и внутренней культуре</li><li><strong>Удобное участие:</strong> всё просто - выбрать событие, зарегистрироваться, прийти и быть собой</li></ul>`,
  },
  {
    id: 'about-7',
    tone: 'white',
    wide: true,
    title: 'КОГДА ЛЮДИ ПРИХОДЯТ В НАШЕ ПРОСТРАНСТВО:',
    text: `<ul><li>Когда хочется добавить в жизнь лёгкости, новых эмоций и спонтанных встреч</li><li>Когда наступает момент «я всё делаю правильно, но хочу чувствовать больше»</li><li>Когда появляется желание жить ярче — не меняя всё вокруг, а просто меняя пространство, в котором ты общаешься</li></ul>`,
  },
]

const createId = () => `${Date.now()}-${Math.round(Math.random() * 1e6)}`

const normalizeCards = (cards) => {
  const source =
    Array.isArray(cards) && cards.length > 0 ? cards : DEFAULT_ABOUT_CARDS
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
  const location = useAtomValue(locationAtom)
  const loggedUserActive = useAtomValue(loggedUserActiveAtom)
  const loggedUserActiveRole = useAtomValue(loggedUserActiveRoleSelector)
  const modalsFunc = useAtomValue(modalsFuncAtom)
  const [siteSettings, setSiteSettings] = useAtom(siteSettingsAtom)
  const [isSaving, setIsSaving] = useState(false)

  const cards = useMemo(
    () => normalizeCards(siteSettings?.aboutSpaceCards),
    [siteSettings]
  )

  const canEdit =
    loggedUserActiveRole?.generalPage?.aboutSpace || loggedUserActiveRole?.dev

  const saveCards = useCallback(
    async (nextCards) => {
      if (!location) return
      const prevSettings = siteSettings
      setIsSaving(true)
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

      setSiteSettings((prev) => ({
        ...(prev || {}),
        aboutSpaceCards: prepared,
      }))

      await postData(
        `/api/${location}/site`,
        {
          aboutSpaceCards: prepared,
        },
        (data) => {
          setSiteSettings((prev) => ({
            ...(prev || {}),
            ...(data || {}),
            aboutSpaceCards: Array.isArray(data?.aboutSpaceCards)
              ? data.aboutSpaceCards
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
