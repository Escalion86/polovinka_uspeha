const isUserModer = (user) =>
  ['president', 'moder', 'supervisor', 'dev'].includes(
    typeof user === 'string' ? user : user?.role
  )

export default isUserModer
