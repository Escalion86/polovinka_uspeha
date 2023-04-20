const isUserQuestionnaireFilled = (user) =>
  !!(
    (
      user &&
      user.firstName &&
      user.secondName &&
      user.phone &&
      user.gender &&
      user.birthday
    )
    // &&
    // user.images &&
    // user.images.length > 0
  )

export default isUserQuestionnaireFilled
