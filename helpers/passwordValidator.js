const passwordValidator = (password) => {
  const reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
  return reg.test(password)
}

export default passwordValidator
