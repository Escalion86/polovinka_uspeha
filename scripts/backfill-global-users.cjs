const fs = require('fs')
const path = require('path')
const { MongoClient, ObjectId } = require('mongodb')
const { loadEnvConfig } = require('@next/env')

loadEnvConfig(process.cwd())

const LOCATIONS = ['krsk', 'nrsk', 'ekb']
const DB_ENV_MAP = {
  krsk: 'MONGODB_KRSK_DBNAME',
  nrsk: 'MONGODB_NRSK_DBNAME',
  ekb: 'MONGODB_EKB_DBNAME',
}

const argv = process.argv.slice(2)
const isWriteMode = argv.includes('--write')
const allowCityDuplicates = argv.includes('--allow-city-duplicates')
const overwriteProfile = argv.includes('--overwrite-profile')
const DB_SUFFIX = process.env.GLOBAL_USERS_BACKFILL_DB_SUFFIX || ''

const nowIso = () => new Date().toISOString()

const normalizePhone = (rawValue) => {
  if (rawValue === null || rawValue === undefined) return ''

  let digits = String(rawValue).replace(/\D/g, '')
  if (!digits) return ''

  if (digits.length > 11) digits = digits.slice(-11)
  if (digits.length === 10) return `7${digits}`

  if (digits.length === 11) {
    if (digits[0] === '8') return `7${digits.slice(1)}`
    if (digits[0] === '7') return digits
    return `7${digits.slice(-10)}`
  }

  if (digits[0] === '8') return `7${digits.slice(1)}`
  if (digits[0] === '7') return digits
  return `7${digits}`
}

const isValidPhone = (phone) => /^7\d{10}$/.test(String(phone || ''))

const toSafeDate = (value) => {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

const resolveActivityDate = (user = {}) =>
  toSafeDate(user.lastActivityAt) ||
  toSafeDate(user.updatedAt) ||
  toSafeDate(user.createdAt)

const pickMostRecent = (records = []) =>
  [...records].sort((a, b) => {
    const aTs = resolveActivityDate(a)?.getTime() ?? 0
    const bTs = resolveActivityDate(b)?.getTime() ?? 0
    return bTs - aTs
  })[0]

const normalizeProfile = (user = {}) => {
  const whatsapp =
    user.whatsapp === null || typeof user.whatsapp === 'undefined'
      ? null
      : Number.isFinite(Number(user.whatsapp))
        ? Number(user.whatsapp)
        : null

  const security =
    user.security && typeof user.security === 'object' ? user.security : null

  return {
    firstName: String(user.firstName || '').trim(),
    secondName: String(user.secondName || '').trim(),
    thirdName: String(user.thirdName || '').trim(),
    email: String(user.email || '').trim().toLowerCase(),
    whatsapp,
    ok: String(user.ok || '').trim(),
    telegram: String(user.telegram || '').trim(),
    instagram: String(user.instagram || '').trim(),
    vk: String(user.vk || '').trim(),
    gender: user.gender || null,
    birthday: toSafeDate(user.birthday),
    relationship:
      typeof user.relationship === 'boolean' ? user.relationship : null,
    haveKids: typeof user.haveKids === 'boolean' ? user.haveKids : null,
    security,
    images: Array.isArray(user.images) ? user.images.filter(Boolean).slice(0, 12) : [],
  }
}

const normalizeNotifications = (user = {}) => {
  const notifications =
    user.notifications && typeof user.notifications === 'object'
      ? user.notifications
      : {}

  const settingsSource =
    notifications.settings && typeof notifications.settings === 'object'
      ? notifications.settings
      : {}
  const settings = { ...settingsSource }

  if (
    typeof settings.newEvents !== 'boolean' &&
    typeof settings.newEventsByTags === 'boolean'
  ) {
    settings.newEvents = settings.newEventsByTags
  }
  delete settings.newEventsByTags

  if (typeof notifications?.telegram?.active === 'boolean') {
    settings.telegramActive = notifications.telegram.active
  }

  const consentToMailing =
    typeof user?.consentToMailing === 'boolean' ? user.consentToMailing : false

  return { settings, consentToMailing }
}

const normalizeAuthProviders = (user = {}) => {
  const telegramIdRaw = user?.notifications?.telegram?.id
  const telegramIdNum = Number(telegramIdRaw)
  const telegramId = Number.isFinite(telegramIdNum) ? telegramIdNum : null

  return {
    telegram: {
      id: telegramId,
    },
  }
}

const normalizeGlobalCore = (user = {}) => {
  const password =
    typeof user?.password === 'string' ? String(user.password).trim() : ''
  const personalStatus = String(user?.personalStatus || '').trim()
  const registrationType = String(user?.registrationType || '').trim() || 'phone'
  const referrerId =
    user?.referrerId === null || typeof user?.referrerId === 'undefined'
      ? null
      : String(user.referrerId).trim() || null
  const lastActivityAt = toSafeDate(user?.lastActivityAt)
  const archive = Boolean(user?.archive)
  const town =
    user?.town === null || typeof user?.town === 'undefined'
      ? null
      : String(user.town).trim() || null

  return {
    password,
    personalStatus,
    registrationType,
    referrerId,
    lastActivityAt,
    archive,
    town,
  }
}

const hasMeaningfulProfile = (profile = {}) =>
  Boolean(
    profile.firstName ||
      profile.secondName ||
      profile.gender ||
      profile.birthday ||
      (Array.isArray(profile.images) && profile.images.length > 0)
  )

async function main() {
  const mongoUri = process.env.MONGODB_URI
  const globalDbNameRaw = process.env.MONGODB_GLOBAL_DBNAME
  if (!mongoUri) throw new Error('MONGODB_URI is required')
  if (!globalDbNameRaw) throw new Error('MONGODB_GLOBAL_DBNAME is required')

  const missingDbVars = LOCATIONS.filter(
    (location) => !process.env[DB_ENV_MAP[location]]
  )
  if (missingDbVars.length > 0) {
    throw new Error(
      `Missing db names: ${missingDbVars
        .map((location) => DB_ENV_MAP[location])
        .join(', ')}`
    )
  }

  const startedAt = nowIso()
  const globalDbName = `${globalDbNameRaw}${DB_SUFFIX}`
  const client = new MongoClient(mongoUri)

  const usersByPhone = new Map()
  const invalidPhones = []
  const duplicatePhonesWithinCity = []
  const perCityTotals = {}

  let createdCount = 0
  let updatedCount = 0
  let skippedByDuplicate = 0
  const skippedPhones = []

  try {
    await client.connect()

    for (const location of LOCATIONS) {
      const dbName = `${process.env[DB_ENV_MAP[location]]}${DB_SUFFIX}`
      const db = client.db(dbName)

      const users = await db
        .collection('users')
        .find(
          {},
          {
            projection: {
              _id: 1,
              phone: 1,
              firstName: 1,
              secondName: 1,
              thirdName: 1,
              email: 1,
              whatsapp: 1,
              ok: 1,
              telegram: 1,
              instagram: 1,
              vk: 1,
              gender: 1,
              birthday: 1,
              relationship: 1,
              haveKids: 1,
              security: 1,
              notifications: 1,
              password: 1,
              personalStatus: 1,
              registrationType: 1,
              referrerId: 1,
              archive: 1,
              town: 1,
              consentToMailing: 1,
              images: 1,
              status: 1,
              role: 1,
              lastActivityAt: 1,
              updatedAt: 1,
              createdAt: 1,
            },
          }
        )
        .toArray()

      perCityTotals[location] = users.length

      const cityPhoneCounter = new Map()

      users.forEach((user) => {
        const normalizedPhone = normalizePhone(user.phone)
        if (!isValidPhone(normalizedPhone)) {
          invalidPhones.push({
            location,
            userId: String(user._id),
            rawPhone: user.phone ?? null,
            normalizedPhone,
          })
          return
        }

        cityPhoneCounter.set(
          normalizedPhone,
          (cityPhoneCounter.get(normalizedPhone) || 0) + 1
        )

        if (!usersByPhone.has(normalizedPhone)) usersByPhone.set(normalizedPhone, [])
        usersByPhone.get(normalizedPhone).push({
          ...user,
          location,
          userId: String(user._id),
          normalizedPhone,
        })
      })

      cityPhoneCounter.forEach((count, phone) => {
        if (count > 1) duplicatePhonesWithinCity.push({ location, phone, count })
      })
    }

    const duplicatePhoneSet = new Set(
      duplicatePhonesWithinCity.map((item) => `${item.location}:${item.phone}`)
    )

    if (isWriteMode && duplicatePhonesWithinCity.length > 0 && !allowCityDuplicates) {
      throw new Error(
        [
          'Found duplicate phones within city.',
          'Run duplicates cleanup first or use --allow-city-duplicates to continue while skipping duplicate phones.',
        ].join(' ')
      )
    }

    const globalDb = client.db(globalDbName)
    const globalCollection = globalDb.collection('globalusers')

    const candidates = []

    for (const [phone, records] of usersByPhone.entries()) {
      const recordsByCity = records.reduce((acc, record) => {
        if (!acc[record.location]) acc[record.location] = []
        acc[record.location].push(record)
        return acc
      }, {})

      const hasCityDuplicate = Object.entries(recordsByCity).some(
        ([location, cityRecords]) =>
          cityRecords.length > 1 && duplicatePhoneSet.has(`${location}:${phone}`)
      )

      if (hasCityDuplicate && isWriteMode && allowCityDuplicates) {
        skippedByDuplicate += 1
        skippedPhones.push({
          phone,
          reason: 'duplicate-phone-within-city',
          cities: Object.keys(recordsByCity),
        })
        continue
      }

      const preferredRecord = pickMostRecent(records)
      const cityProfiles = {}
      const cities = []

      Object.entries(recordsByCity).forEach(([location, cityRecords]) => {
        const cityPreferred = pickMostRecent(cityRecords)
        if (!cityPreferred) return
        cities.push(location)
        cityProfiles[location] = {
          userId: String(cityPreferred._id),
          status: cityPreferred.status || 'active',
          role: cityPreferred.role || 'client',
          linkedAt: resolveActivityDate(cityPreferred) || new Date(),
        }
      })

      const profile = normalizeProfile(preferredRecord || {})
      const notifications = normalizeNotifications(preferredRecord || {})
      const authProviders = normalizeAuthProviders(preferredRecord || {})
      const core = normalizeGlobalCore(preferredRecord || {})
      candidates.push({
        phone: Number(phone),
        cities,
        cityProfiles,
        profile,
        notifications,
        authProviders,
        core,
        sourceRecordsCount: records.length,
      })

      if (!isWriteMode) continue

      const existing = await globalCollection.findOne(
        { phone: Number(phone) },
        { projection: { _id: 1, profile: 1 } }
      )

      const setPayload = {
        cityProfiles,
        notifications,
        password: core.password,
        personalStatus: core.personalStatus,
        registrationType: core.registrationType,
        referrerId: core.referrerId,
        lastActivityAt: core.lastActivityAt,
        archive: core.archive,
        town: core.town,
      }

      if (
        overwriteProfile ||
        !existing?._id ||
        !hasMeaningfulProfile(existing.profile || {})
      ) {
        setPayload.profile = profile
      }
      if (Number.isFinite(Number(authProviders?.telegram?.id))) {
        setPayload['authProviders.telegram.id'] = Number(authProviders.telegram.id)
      }

      const updatedGlobalUser = await globalCollection.findOneAndUpdate(
        { phone: Number(phone) },
        {
          $setOnInsert: {
            meta: {
              source: 'backfill-global-users',
              version: 1,
            },
          },
          $set: setPayload,
          $addToSet: {
            cities: { $each: cities },
          },
        },
        {
          upsert: true,
          returnDocument: 'after',
        }
      )

      if (updatedGlobalUser?.lastErrorObject?.upserted) createdCount += 1
      else updatedCount += 1

      const resolvedGlobalUserId = updatedGlobalUser?.value?._id
        ? String(updatedGlobalUser.value._id)
        : null
      if (resolvedGlobalUserId) {
        for (const city of cities) {
          const cityProfile = cityProfiles[city]
          if (!cityProfile?.userId) continue
          const cityDbName = `${process.env[DB_ENV_MAP[city]]}${DB_SUFFIX}`
          const cityDb = client.db(cityDbName)
          const cityUserIdRaw = String(cityProfile.userId)
          const cityUserIdObjectId = ObjectId.isValid(cityUserIdRaw)
            ? new ObjectId(cityUserIdRaw)
            : null

          const localUserFilter = cityUserIdObjectId
            ? {
                $or: [{ _id: cityUserIdObjectId }, { _id: cityUserIdRaw }],
              }
            : { _id: cityUserIdRaw }

          await cityDb.collection('users').updateOne(
            localUserFilter,
            { $set: { globalUserId: resolvedGlobalUserId } }
          )
        }
      }
    }

    const finishedAt = nowIso()
    const report = {
      mode: isWriteMode ? 'write' : 'dry-run',
      startedAt,
      finishedAt,
      env: {
        dbSuffix: DB_SUFFIX || null,
        globalDbName,
        locations: LOCATIONS,
        allowCityDuplicates,
        overwriteProfile,
      },
      summary: {
        totalUsersRead: Object.values(perCityTotals).reduce((sum, n) => sum + n, 0),
        perCityTotals,
        invalidPhones: invalidPhones.length,
        duplicatePhonesWithinCity: duplicatePhonesWithinCity.length,
        candidates: candidates.length,
        createdCount,
        updatedCount,
        skippedByDuplicate,
      },
      invalidPhones,
      duplicatePhonesWithinCity,
      skippedPhones,
      candidates,
    }

    const reportsDir = path.join(process.cwd(), 'docs', 'reports')
    fs.mkdirSync(reportsDir, { recursive: true })
    const stamp = new Date().toISOString().replace(/[:.]/g, '-')
    const filePath = path.join(reportsDir, `global-users-backfill-${stamp}.json`)
    fs.writeFileSync(filePath, JSON.stringify(report, null, 2), 'utf8')

    console.log(`GlobalUsers backfill ${isWriteMode ? 'write' : 'dry-run'} completed`)
    console.log('Report:', filePath)
    console.log('Summary:', JSON.stringify(report.summary, null, 2))
  } finally {
    await client.close()
  }
}

main().catch((error) => {
  console.error('GlobalUsers backfill failed:', error.message)
  process.exit(1)
})
