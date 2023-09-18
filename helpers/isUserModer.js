const isUserModer = (user) =>
  typeof user === 'string'
    ? user === 'dev' || user === 'admin' || user === 'moder'
    : ['moder', 'admin', 'dev'].includes(user?.role)

export default isUserModer
