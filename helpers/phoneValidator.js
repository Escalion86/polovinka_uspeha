const phoneValidator = (phone) => {
  return /^7\d{10}$/.test(String(phone ?? ''))
}

export default phoneValidator
