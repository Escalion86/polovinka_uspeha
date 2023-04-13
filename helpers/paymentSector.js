const paymentSector = (payment) => {
  if (!payment.sector)
    return payment.eventId
      ? 'event'
      : payment.serviceId
      ? 'service'
      : payment.productId
      ? 'product'
      : 'event'
  else return payment.sector
}

export default paymentSector
