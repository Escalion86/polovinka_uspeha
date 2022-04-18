import { useState } from 'react'

const useErrors = () => {
  const [errors, setErrors] = useState({})

  const addError = (newError) =>
    setErrors((errors) => {
      return { ...errors, ...newError }
    })
  const removeError = (errorKey) => {
    if (errors[errorKey]) {
      const errorsCopy = { ...errors }
      delete errorsCopy[errorKey]
      setErrors(errorsCopy)
    }
  }

  const clearErrors = () => setErrors({})

  return [errors, addError, removeError, clearErrors]
}

export default useErrors
