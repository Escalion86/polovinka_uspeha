const passwordValidator = (password) => {
  if (password.length < 8) return false
  const reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
  return reg.test(password)
}

export default passwordValidator
