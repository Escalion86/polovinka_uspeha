function pinValidator(pin) {
  const a = /^[0-9]+$/.test(pin)
  return !!(a && pin.toString().length === 4)
}

export default pinValidator
