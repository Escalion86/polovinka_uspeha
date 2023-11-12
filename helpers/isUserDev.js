const isUserDev = (user) =>
  typeof user === 'string' ? user === 'dev' : user?.role === 'dev'

export default isUserDev
