import getDaysFromNow from './getDaysFromNow'

const isEventExpired = (event) => getDaysFromNow(event.date, false, false) < 0

export default isEventExpired
