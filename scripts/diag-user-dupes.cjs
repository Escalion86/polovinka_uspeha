/* Проверка дублей пользователей по телефону (признак перелинковки через global users)
 * и соответствия EventsUsers.userId реальным пользователям.
 * Read-only. Запуск: node --env-file=.env.local scripts/diag-user-dupes.cjs
 */
const { MongoClient, ObjectId } = require('mongodb')

const expandEnv = (value) =>
  typeof value === 'string'
    ? value.replace(/\$\{([A-Z0-9_]+)\}/gi, (_, name) => process.env[name] || '')
    : value
for (const key of Object.keys(process.env)) {
  process.env[key] = expandEnv(process.env[key])
}

const main = async () => {
  const client = new MongoClient(process.env.MONGODB_URI)
  await client.connect()

  for (const [loc, dbName] of Object.entries({
    krsk: process.env.MONGODB_KRSK_DBNAME,
    nrsk: process.env.MONGODB_NRSK_DBNAME,
    ekb: process.env.MONGODB_EKB_DBNAME,
  })) {
    const db = client.db(dbName)

    // 1. Дубли пользователей по телефону
    const dupes = await db
      .collection('users')
      .aggregate([
        { $match: { phone: { $type: 'string' } } },
        { $group: { _id: '$phone', count: { $sum: 1 }, ids: { $push: '$_id' } } },
        { $match: { count: { $gt: 1 } } },
      ])
      .toArray()
    console.log(`\n${loc}: дублей users по phone: ${dupes.length}`)
    for (const d of dupes.slice(0, 10)) {
      const users = await db
        .collection('users')
        .find({ _id: { $in: d.ids } })
        .project({ firstName: 1, secondName: 1, createdAt: 1, archive: 1, status: 1, globalUserId: 1 })
        .toArray()
      console.log(`  phone=***${String(d._id).slice(-4)} count=${d.count}`)
      for (const u of users) {
        console.log(
          `    _id=${u._id} ${u.firstName || ''} ${u.secondName || ''} createdAt=${u.createdAt?.toISOString?.()} archive=${u.archive} status=${u.status} globalUserId=${u.globalUserId}`
        )
      }
    }

    // 2. «Осиротевшие» записи EventsUsers: userId, которого нет в users
    const orphanCount = await db
      .collection('eventsusers')
      .aggregate([
        {
          $lookup: {
            from: 'users',
            let: { uid: '$userId' },
            pipeline: [
              { $match: { $expr: { $eq: [{ $toString: '$_id' }, '$$uid'] } } },
              { $project: { _id: 1 } },
            ],
            as: 'u',
          },
        },
        { $match: { u: { $size: 0 } } },
        { $count: 'n' },
      ])
      .toArray()
    console.log(`${loc}: EventsUsers без соответствующего users-документа: ${orphanCount[0]?.n || 0}`)

    // 3. Свежие пользователи, созданные за последние 3 дня (момент перелинковки?)
    const recent = await db
      .collection('users')
      .find({ createdAt: { $gte: new Date(Date.now() - 3 * 24 * 3600 * 1000) } })
      .project({ firstName: 1, secondName: 1, phone: 1, createdAt: 1 })
      .sort({ createdAt: -1 })
      .toArray()
    console.log(`${loc}: users созданы за 3 дня: ${recent.length}`)
    for (const u of recent.slice(0, 15)) {
      console.log(
        `    _id=${u._id} ${u.firstName || ''} ${u.secondName || ''} createdAt=${u.createdAt?.toISOString?.()} phone=***${String(u.phone || '').slice(-4)}`
      )
    }
  }

  await client.close()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
