const isEventActive = (event) => event?.status === 'active' || !event?.status

export default isEventActive
