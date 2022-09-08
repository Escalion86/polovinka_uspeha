const isUserAdmin = (user) => user?.role === 'dev' || user?.role === 'admin'

export default isUserAdmin
