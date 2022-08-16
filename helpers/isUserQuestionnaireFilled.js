const isUserQuestionnaireFilled = (user) =>
  !!(
    user &&
    user.name &&
    user.secondName &&
    user.phone &&
    user.gender &&
    user.birthday
  )

export default isUserQuestionnaireFilled
