const serviceStatus = (service) => {
  if (service?.status === 'cancel') return 'canceled'
  if (service?.status === 'closed') return 'closed'
  if (service?.status === 'active') return 'active'
  return 'active'
}

export default serviceStatus
