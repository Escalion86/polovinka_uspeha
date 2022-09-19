const passwordValidator = (password) => {
  if (password.length < 8) return false
  const reg = /^(?=.*[a-zа-яё])(?=.*[A-ZА-ЯЁ])(?=.*\d)[a-zA-ZА-Яа-яёЁ\d]{8,}$/
  return reg.test(password)
}

export default passwordValidator
