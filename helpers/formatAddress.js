const formatAddress = (address, textIfNoAddress) => {
  if (!address?.town && !address?.street) return textIfNoAddress ?? ''
  return `${
    address?.town &&
    address.town + (address?.street ? ', ' + address.street : '')
  }${
    (address?.house ? ' ' + address.house : '') +
    (address.house && address.flat ? ' - ' + address.flat : '')
  }${
    address?.floor || address?.entrance
      ? ' (' +
        (address?.entrance ? `${address?.entrance} подъезд` : '') +
        (address?.floor
          ? `${address?.entrance ? ', ' : ''}${address?.floor} этаж`
          : '') +
        ')'
      : ''
  }`
}

export default formatAddress
