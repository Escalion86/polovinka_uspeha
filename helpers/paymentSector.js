const paymentSector = (payment) =>
  payment.eventId
    ? 'event'
    : payment.serviceId
    ? 'service'
    : payment.productId
    ? 'product'
    : null

export default paymentSector
