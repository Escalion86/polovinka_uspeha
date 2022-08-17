const phoneValidator = (phone) => {
  return phone?.toString().length === 11
}

export default phoneValidator
