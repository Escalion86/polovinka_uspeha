const isUserAdmin = (user) =>
  typeof user === 'string' ? user === 'dev' : user?.role === 'dev'

export default isUserAdmin
