const isUserModer = (user) =>
  ['moder', 'supervisor', 'dev'].includes(
    typeof user === 'string' ? user : user?.role
  )

export default isUserModer
