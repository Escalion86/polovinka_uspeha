export const RELATIONSHIP_STATUS_MARRIED = 'married'

export const isRelationshipStatusValid = (relationship) =>
  typeof relationship === 'boolean' ||
  relationship === RELATIONSHIP_STATUS_MARRIED

export const normalizeRelationshipStatus = (relationship) =>
  isRelationshipStatusValid(relationship) ? relationship : null

export const hasPartnerRelationship = (relationship) =>
  relationship === true ||
  relationship === 'havePartner' ||
  relationship === RELATIONSHIP_STATUS_MARRIED

export const isMarriedRelationship = (relationship) =>
  relationship === RELATIONSHIP_STATUS_MARRIED

export const getRelationshipFilterKey = (relationship) => {
  if (isMarriedRelationship(relationship)) return 'married'
  if (hasPartnerRelationship(relationship)) return 'havePartner'
  return 'noPartner'
}

export const matchesRelationshipFilter = (relationship, filter = {}) => {
  const key = getRelationshipFilterKey(relationship)

  // Старые сохраненные фильтры не содержат married: раньше этот статус
  // попадал в общую категорию «Есть пара».
  if (key === 'married' && typeof filter.married !== 'boolean') {
    return Boolean(filter.havePartner)
  }

  return Boolean(filter[key])
}
