const isUserModer = (user) => ['moder', 'admin', 'dev'].includes(user?.role)

export default isUserModer
