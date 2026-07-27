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
