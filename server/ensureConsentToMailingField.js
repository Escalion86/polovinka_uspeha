const consentDefaultsApplied = new Set()

const getLocationKey = (db, location) => {
  if (location) return location
  if (db?.name) return db.name
  if (db?.db?.databaseName) return db.db.databaseName
  return undefined
}

const ensureConsentToMailingField = async (db, location) => {
  if (!db) return
  const locationKey = getLocationKey(db, location)
  if (locationKey && consentDefaultsApplied.has(locationKey)) return

  try {
    await db.model('Users').updateMany(
      {
        $or: [
          { consentToMailing: { $exists: false } },
          { consentToMailing: null },
        ],
      },
      { $set: { consentToMailing: false } }
    )
    if (locationKey) {
      consentDefaultsApplied.add(locationKey)
    }
  } catch (error) {
    console.log('ensureConsentToMailingField error :>> ', error)
  }
}

export default ensureConsentToMailingField
