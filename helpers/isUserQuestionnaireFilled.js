const isUserQuestionnaireFilled = (user) =>
  !!(
    user &&
    user.firstName &&
    user.secondName &&
    user.phone &&
    user.gender &&
    user.birthday
  )

export default isUserQuestionnaireFilled
