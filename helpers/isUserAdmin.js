const isUserAdmin = (user) =>
  typeof user === 'string'
    ? user === 'dev' || user === 'admin'
    : user?.role === 'dev' || user?.role === 'admin'

export default isUserAdmin
