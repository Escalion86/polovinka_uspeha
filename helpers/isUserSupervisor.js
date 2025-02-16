const isUserSupervisor = (user) =>
  ['president', 'supervisor', 'dev'].includes(
    typeof user === 'string' ? user : user?.role
  )

export default isUserSupervisor
