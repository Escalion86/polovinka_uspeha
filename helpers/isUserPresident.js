const isUserPresident = (user) =>
  ['president', 'dev'].includes(typeof user === 'string' ? user : user?.role)

export default isUserPresident
