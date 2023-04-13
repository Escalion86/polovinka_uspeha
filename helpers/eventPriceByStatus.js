const eventPriceByStatus = (event, status) => {
  switch (status) {
    case 'member':
      return event.price - (event.usersStatusDiscount?.member ?? 0)
    case 'novice':
      return event.price - (event.usersStatusDiscount?.novice ?? 0)
    default:
      return event.price
  }
}

export default eventPriceByStatus
