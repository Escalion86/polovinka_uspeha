import { useState } from 'react'
import validateEmail from './validateEmail'

const useErrors = () => {
  const [errors, setErrors] = useState({})

  const addError = (newError) => {
    setErrors((errors) => {
      return { ...errors, ...newError }
    })
    return true
  }
  const removeError = (errorKey) => {
    if (errors[errorKey]) {
      const errorsCopy = { ...errors }
      delete errorsCopy[errorKey]
      setErrors(errorsCopy)
    }
    return true
  }

  const clearErrors = () => {
    setErrors({})
    return true
  }

  const checkErrors = (object) => {
    clearErrors()
    let error = false
    const setError = (data) => {
      addError(data)
      error = true
    }
    const checks = {
      title: (data) =>
        !data ? setError({ title: 'Необходимо ввести название' }) : null,
      description: (data) =>
        !data ? setError({ description: 'Необходимо ввести описание' }) : null,
      image: (data) =>
        !image ? setError({ image: 'Необходимо загрузить картинку' }) : null,
      images: (data) =>
        !data || data.length === 0
          ? setError({ images: 'Необходимо загрузить хотябы одно фото' })
          : null,
      image: (data) =>
        !data ? setError({ image: 'Необходимо загрузить картинку' }) : null,
      directionId: (data) =>
        !data
          ? setError({
              directionId: 'Необходимо выбрать направление мероприятия',
            })
          : null,
      organizerId: (data) =>
        !data
          ? setError({ organizerId: 'Необходимо указать организатора' })
          : null,
      date: (data) =>
        !data ? setError({ date: 'Необходимо ввести дату' }) : null,
      userId: (data) =>
        !data ? setError({ userId: 'Необходимо указать пользователя' }) : null,
      eventId: (data) =>
        !data ? setError({ eventId: 'Необходимо указать мероприятие' }) : null,
      sum: (data) =>
        !data ? setError({ sum: 'Необходимо указать сумму' }) : null,
      author: (data) =>
        !data ? setError({ author: 'Необходимо ввести имя автора' }) : null,
      reviewText: (data) =>
        !data
          ? setError({ reviewText: 'Необходимо ввести текст отзыва' })
          : null,
      firstName: (data) =>
        !data ? setError({ firstName: 'Необходимо ввести имя' }) : null,
      secondName: (data) =>
        !data ? setError({ secondName: 'Необходимо ввести фамилию' }) : null,
      gender: (data) =>
        !data ? setError({ gender: 'Необходимо ввести пол' }) : null,
      phone: (data) =>
        !data
          ? setError({ phone: 'Необходимо ввести текст отзыва' })
          : `${data}`.length !== 11
          ? setError({ phone: 'Некорректно введен номер телефона' })
          : null,
      viber: (data) => {
        return data && `${data}`.length !== 11
          ? setError({ viber: 'Некорректно введен номер viber' })
          : null
      },
      whatsapp: (data) =>
        data && `${data}`.length !== 11
          ? setError({ whatsapp: 'Некорректно введен номер whatsapp' })
          : null,
      email: (data) =>
        data && !validateEmail(data)
          ? setError({ email: 'Некорректно введен email' })
          : null,
      birthday: (data) =>
        !data
          ? setError({ birthday: 'Необходимо ввести дату рождения' })
          : null,
    }

    for (const [key, value] of Object.entries(object)) {
      // console.log('key', key)
      // console.log('value', value)
      // console.log('checks[key](value)', checks[key](value))
      checks[key] && checks[key](value)
      // console.log('error', error)
    }

    return error
  }

  return [errors, checkErrors, addError, removeError, clearErrors]
}

export default useErrors
