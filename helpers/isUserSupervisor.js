const isUserSupervisor = (user) =>
  ['supervisor', 'dev'].includes(typeof user === 'string' ? user : user?.role)

export default isUserSupervisor
