/* Диагностика страницы «Лайки»: почему посещённое мероприятие не попадает в дашборд.
 * Read-only. Запуск: node --env-file=.env.local scripts/diag-likes-dashboard.cjs
 */
const { MongoClient, ObjectId } = require('mongodb')

// Раскрытие плейсхолдеров ${VAR} как делает dotenv-expand в Next.js
const expandEnv = (value) =>
  typeof value === 'string'
    ? value.replace(/\$\{([A-Z0-9_]+)\}/gi, (_, name) => process.env[name] || '')
    : value
for (const key of Object.keys(process.env)) {
  process.env[key] = expandEnv(process.env[key])
}

const hasPartnerRelationship = (relationship) =>
  relationship === true ||
  relationship === 'havePartner' ||
  relationship === 'married'

const LOCATIONS = {
  krsk: process.env.MONGODB_KRSK_DBNAME,
  nrsk: process.env.MONGODB_NRSK_DBNAME,
  ekb: process.env.MONGODB_EKB_DBNAME,
}

// Точная копия агрегации из server/api/[location]/likes/dashboard.js
const runDashboardAggregation = async (db, loggedUserId, now) =>
  db
    .collection('eventsusers')
    .aggregate([
      { $match: { userId: loggedUserId, status: 'participant' } },
      {
        $lookup: {
          from: 'events',
          let: { eventId: '$eventId' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: [{ $toString: '$_id' }, '$$eventId'] },
              },
            },
            {
              $project: {
                _id: 1,
                title: 1,
                dateStart: 1,
                status: 1,
                likes: 1,
                likesProcessActive: 1,
              },
            },
          ],
          as: 'event',
        },
      },
      { $unwind: '$event' },
      {
        $match: {
          'event.likes': true,
          'event.status': { $ne: 'canceled' },
          'event.dateStart': { $ne: null, $lte: now },
        },
      },
      { $group: { _id: '$eventId', event: { $first: '$event' } } },
    ])
    .toArray()

const main = async () => {
  const now = new Date()
  const client = new MongoClient(process.env.MONGODB_URI)
  await client.connect()

  for (const [location, dbName] of Object.entries(LOCATIONS)) {
    if (!dbName) continue
    const db = client.db(dbName)

    // Все мероприятия с лайками за последние 14 дней (и ближайшие будущие)
    const since = new Date(now.getTime() - 14 * 24 * 3600 * 1000)
    const events = await db
      .collection('events')
      .find({ likes: true, dateStart: { $gte: since } })
      .project({ title: 1, dateStart: 1, status: 1, likes: 1, likesProcessActive: 1 })
      .toArray()

    if (events.length === 0) continue
    console.log(`\n===== ${location} (${dbName}): мероприятий с лайками за 14 дней: ${events.length}`)

    for (const event of events) {
      const eventIdStr = String(event._id)
      // Ищем записи участников обоими типами (String и ObjectId)
      const evUsers = await db
        .collection('eventsusers')
        .find({ eventId: { $in: [eventIdStr, event._id] } })
        .toArray()

      const withLikes = evUsers.filter(
        (u) => Array.isArray(u.likes) && u.likes.length > 0
      )
      if (withLikes.length === 0) continue

      console.log(
        `\n  Мероприятие "${event.title}" _id=${eventIdStr} dateStart=${event.dateStart?.toISOString?.()} status=${event.status} likes=${event.likes} likesProcessActive=${event.likesProcessActive}`
      )
      console.log(`  Записей EventsUsers: ${evUsers.length}, из них с лайками: ${withLikes.length}`)

      for (const evUser of withLikes) {
        const userIdStr = String(evUser.userId)
        let u = null
        try {
          u = await db
            .collection('users')
            .findOne({ _id: new ObjectId(userIdStr) })
        } catch {}

        // Симуляция пайплайна дашборда для этого пользователя
        const agg = await runDashboardAggregation(db, userIdStr, now)
        const inDashboard = agg.some((row) => String(row._id) === eventIdStr)

        const reasons = []
        if (typeof evUser.userId !== 'string')
          reasons.push(`userId хранится как ${typeof evUser.userId} (${evUser.userId?.constructor?.name}) — $match по строке его не найдёт`)
        if (evUser.status !== 'participant')
          reasons.push(`status="${evUser.status}" (нужен "participant")`)
        if (typeof evUser.eventId !== 'string')
          reasons.push(`eventId хранится как ${evUser.eventId?.constructor?.name} — $lookup по строке не сработает`)
        if (event.status === 'canceled') reasons.push('мероприятие отменено')
        if (!(event.dateStart instanceof Date))
          reasons.push(`dateStart не Date: ${typeof event.dateStart}`)
        if (event.dateStart > now) reasons.push('dateStart в будущем')
        if (u && hasPartnerRelationship(u.relationship))
          reasons.push(`relationship=${JSON.stringify(u.relationship)} → сервер вернёт пустой дашборд`)
        if (!u) reasons.push('документ пользователя не найден в users')

        console.log(
          `    userId=${userIdStr} (${u ? `${u.firstName || ''} ${u.secondName || ''}`.trim() || u.phone : '??'}) status=${evUser.status} likes=[${evUser.likes.length}] relationship=${u ? JSON.stringify(u.relationship) : '??'} → в дашборде: ${inDashboard ? 'ДА' : 'НЕТ'}` +
            (reasons.length ? `\n      ПРИЧИНЫ: ${reasons.join('; ')}` : '')
        )
      }
    }
  }

  await client.close()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
