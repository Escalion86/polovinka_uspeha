const userQuestionnaireStatus = ({ user }) => {
  if (!user) return { minimum: false }
  const { gender, name, secondName, phone, phoneConfirm } = user
  const minimum = !!(gender && name && secondName && phone && phoneConfirm)
  return { minimum }
}
