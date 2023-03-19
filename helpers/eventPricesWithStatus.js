const eventPricesWithStatus = (event) => ({
  member: event.price - (event.usersStatusDiscount?.member ?? 0),
  novice: event.price - (event.usersStatusDiscount?.novice ?? 0),
})

export default eventPricesWithStatus
