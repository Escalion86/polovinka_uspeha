const isUserRelationshipCorrectForEvent = (user, event, rules) =>
  rules?.userRelationship === 'any'
    ? true
    : rules?.userRelationship === 'alone'
      ? !user?.relationship
      : rules?.userRelationship === 'pair'
        ? user?.relationship
        : !event?.usersRelationshipAccess ||
          event?.usersRelationshipAccess === 'yes' ||
          (user?.relationship
            ? event?.usersRelationshipAccess === 'only'
            : event?.usersRelationshipAccess === 'no')

export default isUserRelationshipCorrectForEvent
