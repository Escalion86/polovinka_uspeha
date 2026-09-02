const normalizePhone = (value) => {
  let digits = String(value ?? '').replace(/\D/g, '')
  if (digits.length === 10) digits = `7${digits}`
  if (digits.length === 11 && digits[0] === '8') digits = `7${digits.slice(1)}`
  return /^7\d{10}$/.test(digits) ? digits : ''
}

// Конфликт с живой анкетой разрешается только при подтвержденной другой связи.
const classifyCityProfile = ({ globalUser, location, users, globalById }) => {
  const profile = globalUser.cityProfiles?.[location]
  const local = users.get(String(profile?.userId || ''))
  const globalId = String(globalUser._id)
  const phone = normalizePhone(globalUser.phone)

  if (!local) {
    const canRelink = [...users.values()].some(
      (user) => String(user.globalUserId || '') === globalId ||
        (phone && normalizePhone(user.phone) === phone)
    )
    return canRelink
      ? { reason: 'POSSIBLE_RELINK', removable: false }
      : { reason: 'LOCAL_USER_MISSING', removable: true }
  }

  const localGlobalId = String(local.globalUserId || '')
  const localPhone = normalizePhone(local.phone)
  if (localGlobalId === globalId && localPhone && localPhone === phone) return null

  const canonical = globalById.get(localGlobalId)
  const canonicalVerified = canonical && localPhone &&
    normalizePhone(canonical.phone) === localPhone &&
    String(canonical.cityProfiles?.[location]?.userId || '') === String(local._id)

  if (localGlobalId && localGlobalId !== globalId && canonicalVerified &&
      phone && localPhone !== phone) {
    return { reason: 'GLOBAL_USER_ID_MISMATCH', removable: true }
  }

  return { reason: 'AMBIGUOUS_LINK', removable: false }
}

module.exports = { normalizePhone, classifyCityProfile }
