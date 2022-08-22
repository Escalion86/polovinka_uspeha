const formatAddress = (address, textIfNoAddress) => {
  if (!address?.town && !address?.street) return textIfNoAddress ?? ''

  return (
    [
      address?.town,
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
