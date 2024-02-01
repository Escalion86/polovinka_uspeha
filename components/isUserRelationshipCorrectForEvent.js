const isUserRelationshipCorrectForEvent = (user, event) =>
  !event?.usersRelationshipAccess ||
  event?.usersRelationshipAccess === 'yes' ||
  (user?.relationship
    ? event?.usersRelationshipAccess === 'only'
    : event?.usersRelationshipAccess === 'no')

export default isUserRelationshipCorrectForEvent
