/* Проверка relationship в глобальных профилях участников мероприятия 03.09.2026 (krsk).
 * Read-only. Запуск: node --env-file=.env.local scripts/diag-global-relationship.cjs
 */
const { MongoClient, ObjectId } = require('mongodb')

const expandEnv = (value) =>
  typeof value === 'string'
    ? value.replace(/\$\{([A-Z0-9_]+)\}/gi, (_, name) => process.env[name] || '')
    : value
for (const key of Object.keys(process.env)) {
  process.env[key] = expandEnv(process.env[key])
}

const EVENT_ID = '6a0f266368bce3b36023b27a'

const main = async () => {
  const client = new MongoClient(process.env.MONGODB_URI)
  await client.connect()

  const krsk = client.db(process.env.MONGODB_KRSK_DBNAME)
  const globalDb = client.db(process.env.MONGODB_GLOBAL_DBNAME)

  const collections = await globalDb.listCollections().toArray()
  console.log('Коллекции global DB:', collections.map((c) => c.name).join(', '))

  const evUsers = await krsk
    .collection('eventsusers')
    .find({ eventId: { $in: [EVENT_ID, new ObjectId(EVENT_ID)] } })
    .toArray()

  for (const evUser of evUsers) {
    const localUser = await krsk
      .collection('users')
      .findOne({ _id: new ObjectId(String(evUser.userId)) })
    if (!localUser) continue

    const globalUser = localUser.phone
      ? await globalDb.collection('globalusers').findOne({ phone: localUser.phone })
      : null

    const name = `${localUser.firstName || ''} ${localUser.secondName || ''}`.trim()
    console.log(
      `${name || localUser.phone}: local.relationship=${JSON.stringify(localUser.relationship)}` +
        ` | global exists=${!!globalUser}` +
        (globalUser
          ? ` global.profile.relationship=${JSON.stringify(globalUser.profile?.relationship)} cities=${JSON.stringify(globalUser.cities)}`
          : '') +
        ` | evStatus=${evUser.status} likes=${Array.isArray(evUser.likes) ? evUser.likes.length : evUser.likes}`
    )
  }

  await client.close()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
