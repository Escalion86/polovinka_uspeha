import dbConnectGlobal from '@utils/dbConnectGlobal'

const CONTENT_KEY = 'about-space-cards'

const normalizeCards = (cards) => {
  if (!Array.isArray(cards)) return []
  return cards.map((item, index) => ({
    id: item?.id ?? `about-${index}`,
    title: item?.title ?? '',
    text: item?.text ?? '',
    wide: Boolean(item?.wide),
    tone: item?.tone ?? 'white',
    bgMode: item?.bgMode ?? null,
    bgColor1: item?.bgColor1 ?? null,
    bgColor2: item?.bgColor2 ?? null,
    index: typeof item?.index === 'number' ? item.index : index,
  }))
}

export default async function getGlobalAboutSpaceCards() {
  const db = await dbConnectGlobal()
  if (!db) return []

  try {
    const doc = await db.model('GlobalContent').findOne({ key: CONTENT_KEY }).lean()
    return normalizeCards(doc?.aboutSpaceCards)
  } catch (error) {
    console.log('getGlobalAboutSpaceCards error:', error)
    return []
  }
}

