const isUserAdmin = (user) =>
  ['president', 'supervisor', 'admin', 'dev'].includes(
    typeof user === 'string' ? user : user?.role
  )

export default isUserAdmin
