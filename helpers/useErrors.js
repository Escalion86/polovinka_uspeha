import { useState } from 'react'
import birthDateToAge from './birthDateToAge'
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
      title: (data) => (!data ? setError({ title: 'Введите название' }) : null),
      description: (data) =>
        !data ? setError({ description: 'Введите описание' }) : null,
      images: (data) =>
        !data || data.length === 0
          ? setError({ images: 'Загрузите хотябы одно фото' })
          : null,
      image: (data) =>
        !data ? setError({ image: 'Загрузите картинку' }) : null,
      directionId: (data) =>
        !data
          ? setError({
              directionId: 'Выберите направление мероприятия',
            })
          : null,
      organizerId: (data) =>
        !data ? setError({ organizerId: 'Выберите организатора' }) : null,
      date: (data) => (!data ? setError({ date: 'Введите дату' }) : null),
      dateStart: (data) =>
        !data ? setError({ dateStart: 'Введите дату начала' }) : null,
      dateEnd: (data) =>
        !data ? setError({ dateEnd: 'Введите дату завершения' }) : null,
      payAt: (data) =>
        !data
          ? setError({ payAt: 'Введите дату совершения транзакции' })
          : null,
      userId: (data) =>
        !data ? setError({ userId: 'Выберите пользователя' }) : null,
      eventId: (data) =>
        !data ? setError({ eventId: 'Выберите мероприятие' }) : null,
      price: (data) =>
        Number(data) < 0
          ? setError({ sum: 'Стоиомсть не может быть отрицательной' })
          : null,
      notificationTelegramUserName: (data) =>
        !data
          ? setError({
              notificationTelegramUserName:
                'Введите имя пользователя Telegram для оповещений',
            })
          : null,
      sum: (data) =>
        Number(data) < 0
          ? setError({ sum: 'Сумма не может быть отрицательной' })
          : null,
      author: (data) =>
        !data ? setError({ author: 'Введите имя автора' }) : null,
      reviewText: (data) =>
        !data ? setError({ reviewText: 'Введите текст отзыва' }) : null,
      firstName: (data) =>
        !data ? setError({ firstName: 'Введите имя' }) : null,
      secondName: (data) =>
        !data ? setError({ secondName: 'Введите фамилию' }) : null,
      gender: (data) => (!data ? setError({ gender: 'Укажите пол' }) : null),
      phone: (data) =>
        !data
          ? setError({ phone: 'Введите номер телефона' })
          : `${data}`.length !== 11
          ? setError({ phone: 'Некорректно введен номер телефона' })
          : null,
      phoneNoRequired: (data) =>
        data && `${data}`.length !== 11
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
          ? setError({ birthday: 'Введите дату рождения' })
          : birthDateToAge(data, false, false, false) < 18
          ? setError({
              birthday: 'Возраст не может быть менее 18 лет',
            })
          : null,
    }

    for (const [key, value] of Object.entries(object)) {
      checks[key] && checks[key](value)
    }

    return error
  }

  return [errors, checkErrors, addError, removeError, clearErrors]
}

export default useErrors
