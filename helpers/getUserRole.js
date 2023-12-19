const getUserRole = (user, roles) => {
  if (!user) return null
  const roleName = user.role
  const userRole = roles.find(({ _id }) => String(_id) === roleName)
  return userRole
}

export default getUserRole
