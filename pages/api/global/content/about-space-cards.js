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

export default async function handler(req, res) {
  const { method, body } = req

  const db = await dbConnectGlobal()
  if (!db) {
    return res.status(500).json({
      success: false,
      data: {
        error: {
          type: 'DB_ERROR',
          message: 'Global DB connection failed',
        },
      },
    })
  }

  try {
    if (method === 'GET') {
      const doc = await db
        .model('GlobalContent')
        .findOne({ key: CONTENT_KEY })
        .lean()
      const aboutSpaceCards = normalizeCards(doc?.aboutSpaceCards)

      return res.status(200).json({
        success: true,
        data: {
          aboutSpaceCards,
          hasValue: aboutSpaceCards.length > 0,
        },
      })
    }

    if (method === 'POST') {
      const prepared = normalizeCards(body?.data?.aboutSpaceCards)
      const data = await db.model('GlobalContent').findOneAndUpdate(
        { key: CONTENT_KEY },
        {
          key: CONTENT_KEY,
          aboutSpaceCards: prepared,
          updatedBy: body?.userId ?? null,
        },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
        }
      )

      return res.status(200).json({
        success: true,
        data: {
          aboutSpaceCards: normalizeCards(data?.aboutSpaceCards),
          hasValue: true,
        },
      })
    }

    return res.status(405).json({
      success: false,
      data: {
        error: {
          type: 'METHOD_NOT_ALLOWED',
          message: 'Method not allowed',
        },
      },
    })
  } catch (error) {
    console.log('Global about-space-cards API error:', error)
    return res.status(500).json({
      success: false,
      data: {
        error: {
          type: 'INTERNAL_ERROR',
          message: 'Failed to process request',
        },
      },
    })
  }
}
