const formatAddress = (address, textIfNoAddress, hiddenTown) => {
  if (!address?.town && !address?.street) return textIfNoAddress ?? ''

  const normalizedTown = (address?.town || '').toString().trim().toLowerCase()
  const normalizedHiddenTown = (hiddenTown || '')
    .toString()
    .trim()
    .toLowerCase()
  const shouldHideTown =
    normalizedTown &&
    normalizedHiddenTown &&
    normalizedTown === normalizedHiddenTown

  return (
    [
      shouldHideTown ? null : address?.town,
      address?.street,
      // [address?.house, address?.flat].filter((data) => data).join(' - '),
      address?.house ? `дом ${address?.house}` : '',
      address?.flat ? `кв. ${address?.flat}` : '',
      address?.entrance ? `${address?.entrance} подъезд` : '',
      address?.floor ? `${address?.floor} этаж` : '',
    ]
      .filter((data) => data)
      .join(', ') + (address?.comment ? ' (' + address.comment + ')' : '')
  )
}

export default formatAddress
