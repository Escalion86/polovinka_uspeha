import { getSession, signIn } from 'next-auth/react'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'

import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'

import SvgWave from 'svg/SvgWave'
// import SvgLogin from 'svg/SvgLogin'
// import SvgAvatar from 'svg/SvgAvatar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock, faUser } from '@fortawesome/free-solid-svg-icons'
import cn from 'classnames'
// import SvgMailBox from 'svg/SvgMailBox'
import { postData } from '@helpers/CRUD'
import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from 'tailwind.config.js'
import passwordValidator from '@helpers/passwordValidator'
import SvgLove from 'svg/SvgLove'
import Link from 'next/link'
import MaskedInput from 'react-text-mask'
import LoadingSpinner from '@components/LoadingSpinner'
import phoneValidator from '@helpers/phoneValidator'
import useErrors from '@helpers/useErrors'
import CheckBox from '@components/CheckBox'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import getServerSidePropsFunc from '@server/getServerSidePropsFunc'
import fetchSiteSettings from '@server/fetchSiteSettings'
import { DEFAULT_SITE_SETTINGS } from '@helpers/constants'
// import { UCALLER_VOICE, UCALLER_MIX } from '@helpers/constants'

const Input = ({
  className = '',
  name,
  label,
  icon,
  type = 'text',
  onChange,
  value,
  hidden,
  error = false,
  tabIndex,
  inputRef,
  max,
  maxLength,
  readOnly,
}) => {
  const [focused, setFocused] = useState(false)
  const onFocus = () => setFocused(true)
  const onBlur = () => setFocused(false)

  return (
    <div
      className={cn(
        'duration-300 overflow-hidden ',
        className,
        hidden ? 'max-h-0 my-0 py-0' : 'max-h-15 my-2 py-3 '
      )}
    >
      <div className="grid" style={{ gridTemplateColumns: '7% 93%' }}>
        <div
          className={cn(
            'relative w-4 flex justify-center duration-300 items-center mx-auto',
            error
              ? 'text-red-600'
              : focused || value
              ? 'text-general'
              : 'text-gray-400'
          )}
        >
          <FontAwesomeIcon icon={icon} />
        </div>
        <div className="relative h-10">
          <h5
            className={cn(
              'absolute left-3 -translate-y-1/2 duration-300',
              focused || value ? 'text-sm top-0' : 'text-lg top-1/2',
              error
                ? focused
                  ? 'text-red-600'
                  : 'text-red-400'
                : focused || value
                ? 'text-general'
                : 'text-gray-400'
            )}
          >
            {label}
          </h5>
          {type === 'phone' ? (
            <MaskedInput
              name={name}
              disabled={readOnly}
              ref={inputRef}
              className="absolute w-full h-full top-0 left-0 border-none outline-none bg-transparent py-0.5 px-1 text-lg text-gray-600"
              showMask={value == '7'}
              onFocus={onFocus}
              onBlur={onBlur}
              onChange={onChange}
              // keepCharPositions
              mask={[
                '+',
                '7',
                ' ',
                '(',
                /[1-9]/,
                /\d/,
                /\d/,
                ')',
                ' ',
                /\d/,
                /\d/,
                /\d/,
                '-',
                /\d/,
                /\d/,
                /\d/,
                /\d/,
              ]}
              value={
                value
                  ? value.toString().substr(0, 1) == '7'
                    ? value.toString().substring(1)
                    : value.toString()
                  : ''
              }
            />
          ) : (
            <input
              name={name}
              ref={inputRef}
              className="absolute w-full h-full top-0 left-0 border-none outline-none bg-transparent py-0.5 px-1 text-lg text-gray-600"
              type={type}
              onFocus={onFocus}
              onBlur={onBlur}
              value={value}
              onChange={onChange}
              tabIndex={tabIndex}
              max={max}
              maxLength={maxLength}
              disabled={readOnly}
            />
          )}
        </div>
      </div>
      <div className="relative h-0.5 flex justify-center">
        <div
          className={cn(
            'duration-400 w-full h-full',
            error ? 'bg-red-400' : 'bg-gray-300'
          )}
        />
        <div
          className={cn(
            'absolute h-full duration-400',
            error ? 'bg-red-600' : 'bg-general',
            focused || value ? 'w-full' : 'w-0'
          )}
        />
      </div>
    </div>
  )
}

const fullConfig = resolveConfig(tailwindConfig)
const generalColor = fullConfig.theme.colors.general

const secondsToWait = 60

const RepeatCall = ({ onClickRepeat }) => {
  const timer = useRef(null)
  const [secondsLeft, setIsSecondsLeft] = useState(secondsToWait)

  const stopInterval = () => {
    if (timer?.current) {
      clearInterval(timer?.current)
      // timer?.current = undefined
    }
  }

  const startInterval = () => {
    // if (!timer?.current)
    stopInterval()
    timer.current = setInterval(() => {
      setIsSecondsLeft((state) => state - 1)
    }, 1000)
  }

  // useEffect(() => console.log('timer?.current', timer?.current), [secondsLeft])

  // var timer

  useEffect(() => {
    if (secondsLeft === secondsToWait) {
      startInterval()
    } else if (timer?.current && secondsLeft <= 0) {
      stopInterval()
    }
    // return () => {
    //   console.log('Child unmounted')
    //   if (timer) clearInterval(timer)
    // }
    // return () => {
    //   clearInterval(timer.current)
    // }
  }, [secondsLeft])

  // useEffect(() => {
  //   startInterval()
  //   return () => {
  //     stopInterval()
  //   }
  // }, [])

  // console.log('timer', timer)

  return (
    <div className="mt-2">
      {secondsLeft > 0 ? (
        <>Запросить повторый звонок возможно через {secondsLeft} сек</>
      ) : (
        <>
          Звонок не поступил?{' '}
          <div
            onClick={async () => {
              onClickRepeat && (await onClickRepeat())
              setIsSecondsLeft(secondsToWait)
            }}
            className="font-bold cursor-pointer"
          >
            Повторный звонок
          </div>
        </>
      )}
    </div>
  )
}

const submitEnquiryForm = (gReCaptchaToken, onSuccess, onError) => {
  fetch('/api/enquiry', {
    method: 'POST',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      gRecaptchaToken: gReCaptchaToken,
    }),
  })
    .then((res) => res.json())
    .then((res) => {
      console.log(res, 'response from backend')
      if (res?.status === 'success') {
        // console.log('responce captcha', res?.message)
        onSuccess()
      } else {
        // console.log('responce captcha', res?.message)
        onError()
      }
    })
}

const LoginPage = (props) => {
  const router = useRouter()
  // const { data: session, status } = useSession()
  // const { courseId, lectureId } = router.query
  // const [codeSendService, setCodeSendService]
  const [process, setProcess] = useState('authorization')
  const [registrationLevel, setRegistrationLevel] = useState(1)
  const [waitingResponse, setWaitingResponse] = useState(false)
  const [inputPhone, setInputPhone] = useState('')
  const [inputPassword, setInputPassword] = useState('')
  const [inputPinCode, setInputPinCode] = useState('')
  const [inputPasswordRepeat, setInputPasswordRepeat] = useState('')
  const [checkHave18Years, setCheckHave18Years] = useState(false)
  // const [errors, setErrors] = useState({})
  const [errors, checkErrors, addError, removeError, clearErrors] = useErrors()
  // const [needToCheckMail, setNeedToCheckMail] = useState(false)
  const inputPhoneRef = useRef()
  const inputPasswordRef = useRef()

  const { executeRecaptcha } = useGoogleReCaptcha()

  const codeSendService =
    props?.siteSettings?.codeSendService ??
    DEFAULT_SITE_SETTINGS.codeSendService

  // const handleSumitForm = useCallback(
  //   (e) => {
  //     e.preventDefault()
  //     if (!executeRecaptcha) {
  //       console.log('Execute recaptcha not yet available')
  //       return
  //     }
  //     executeRecaptcha('enquiryFormSubmit').then((gReCaptchaToken) => {
  //       console.log(gReCaptchaToken, 'response Google reCaptcha server')
  //       submitEnquiryForm(gReCaptchaToken)
  //     })
  //   },
  //   [executeRecaptcha]
  // )

  useEffect(() => {
    if (router.query?.registration === 'true') setProcess('registration')
  }, [router])

  useEffect(() => {
    if (router.query?.phone && inputPasswordRef.current) {
      setInputPhone(router.query.phone)
      inputPasswordRef?.current?.focus()
    }
  }, [router, inputPasswordRef.current])

  const submit = () => {
    clearErrors()

    if (inputPhone === '') {
      return addError({ phone: 'Укажите телефон' })
      // newErrors.phone = 'Укажите телефон'
    } else if (!phoneValidator(inputPhone)) {
      // newErrors.phone = 'Телефон указан не верно'
      return addError({ phone: 'Телефон указан не верно' })
    }

    if (process === 'authorization') {
      if (inputPassword === '') {
        // newErrors.password = 'Введите пароль'
        return addError({ password: 'Введите пароль' })
      }
    } else if (process === 'registration' || process === 'forgotPassword') {
      if (registrationLevel === 3) {
        if (!passwordValidator(inputPassword)) {
          return addError({
            password: 'Пароль должен быть длинной не менее 8 символов',
            // 'Пароль должен быть длинной не менее 8 символов, содержать строчные и заглавные буквы, а также минимум одну цифру',
          })
          // newErrors.password =
          //   'Пароль должен содержать строчные и заглавные буквы, а также минимум одну цифру'
        } else if (inputPassword !== inputPasswordRepeat) {
          // newErrors.password = 'Пароли не совпадают'
          return addError({ password: 'Пароли не совпадают' })
        }
      }
    }

    // if (inputPhone === '') {
    //   newErrors.phone = 'Укажите телефон'
    // } else if (!phoneValidator(inputPhone)) {
    //   newErrors.phone = 'Телефон указан не верно'
    // }

    // if (process === 'registration') {
    //   if (inputPassword === '') {
    //     newErrors.password = 'Введите пароль'
    //   } else if (process === 'authorization') {
    //     if (!passwordValidator(inputPassword)) {
    //       newErrors.password =
    //         'Пароль должен содержать строчные и заглавные буквы, а также минимум одну цифру'
    //     } else if (inputPassword !== inputPasswordRepeat) {
    //       newErrors.password = 'Пароли не совпадают'
    //     }
    //   }
    // }

    // if (Object.keys(newErrors).length > 0) {
    //   return setErrors(newErrors)
    // } else {
    //   clearErrors()
    // }

    if (process === 'registration' || process === 'forgotPassword') {
      if (registrationLevel === 1) {
        if (!executeRecaptcha) {
          console.log('Execute recaptcha not yet available')
          return
        }
        setWaitingResponse(true)

        executeRecaptcha('enquiryFormSubmit').then((gReCaptchaToken) => {
          // console.log(gReCaptchaToken, 'response Google reCaptcha server')
          submitEnquiryForm(
            gReCaptchaToken,
            () => {
              postData(
                `/api/${codeSendService}`,
                {
                  phone: inputPhone,
                  forgotPassword: process === 'forgotPassword',
                },
                (res) => {
                  setWaitingResponse(false)
                  if (res.error) {
                    addError({ [res.error.type]: res.error.message })
                    // updateErrors(res.error.type, res.error.message)
                  } else {
                    setRegistrationLevel(2)
                  }
                },
                (error) => {
                  setWaitingResponse(false)
                  addError({ error })
                },
                false,
                null,
                true
              )
            },
            () => {
              addError({
                captcha:
                  'Похоже что вы робот, сработала система защиты от спама',
              })
              setWaitingResponse(false)
            }
          )
        })
      }
      if (registrationLevel === 2) {
        setWaitingResponse(true)

        postData(
          `/api/${codeSendService}`,
          {
            phone: inputPhone,
            code: inputPinCode,
            forgotPassword: process === 'forgotPassword',
          },
          (res) => {
            setWaitingResponse(false)

            if (res.error) {
              addError({ [res.error.type]: res.error.message })
              // updateErrors(res.error.type, res.error.message)
            } else {
              setRegistrationLevel(3)
            }

            // Если код не верный
            // if (res.errorNum === 3) {
            //   updateErrors('pinCode', 'Неверный код')
            // }
            // Если небыло ошибок и статус подтвержден
            // if (!res.errorNum && res.confirmed) {
            //   setRegistrationLevel(3)
            // }
          },
          undefined,
          false,
          null,
          true
        )
      }
      if (registrationLevel === 3) {
        setWaitingResponse(true)

        postData(
          `/api/${codeSendService}`,
          {
            phone: inputPhone,
            password: inputPassword,
            forgotPassword: process === 'forgotPassword',
          },
          (res) => {
            if (res.error) {
              setWaitingResponse(false)
              addError({ [res.error.type]: res.error.message })
              // updateErrors(res.error.type, res.error.message)
            } else {
              // setRegistrationLevel(4)
              // router.push('/cabinet/questionnaire')
              signIn('credentials', {
                redirect: false,
                phone: inputPhone,
                password: inputPassword,
              }).then((res) => {
                if (res.error === 'CredentialsSignin') {
                  setWaitingResponse(false)
                  setInputPassword('')
                  addError({ password: 'Телефон или пароль не верны' })
                } else router.push('/cabinet/questionnaire')
              })
            }
            // Если код не верный
            // if (res.errorNum === 3) {
            //   updateErrors('pinCode', 'Неверный код')
            // }
            // Если небыло ошибок
            // if (!res.errorNum) {
            //   setRegistrationLevel(3)
            // }
            // if (res.status) setRegistrationLevel(2)
            // else console.log('Ошибка ответа регистрации')
          },
          undefined,
          false,
          null,
          true
        )
      }
    } else {
      setWaitingResponse(true)
      // Если это авторизация
      signIn('credentials', {
        redirect: false,
        phone: inputPhone,
        password: inputPassword,
      }).then((res) => {
        if (res.error === 'CredentialsSignin') {
          setWaitingResponse(false)
          setInputPassword('')
          addError({ password: 'Телефон или пароль не верны' })
        } else {
          if (router.query?.event)
            router.push('/event/' + router.query?.event, '', { shallow: true })
          else if (router.query?.service)
            router.push('/service/' + router.query?.service, '', {
              shallow: true,
            })
          else router.push('/cabinet', '', { shallow: true })
        }
      })
    }
  }

  // const clearErrors = () => {
  //   if (Object.keys(errors).length > 0) setErrors({})
  // }

  // const updateErrors = (key, error) => {
  //   if (errors[key] !== error)
  //     setErrors((state) => {
  //       return { ...state, [key]: error }
  //     })
  // }

  // useEffect(() => {
  //   if (router) {
  //     if (!session && status !== 'loading') {
  //       // signIn('google')
  //     } else if (status === 'authenticated') {
  //       // if (courseId && lectureId)
  //       //   router.push(`/course/${courseId}/${lectureId}`)
  //       // else
  //       router.push(`/cabinet`)
  //     }
  //   }
  // }, [!!session, status, router])

  const varifyPhone = inputPhone?.toString().length === 11

  const message =
    (process === 'registration' || process === 'forgotPassword') &&
    registrationLevel === 2 ? (
      // UCALLER_MIX ? (
      //   <>
      //     На телефон <b>+{inputPhone}</b> поступит звонок. Введите последние 4
      //     цифры номера телефона или возьмите трубку и введите 4 цифры кода
      //     которые Вам продиктуют
      //   </>
      // ) : UCALLER_VOICE ? (
      //   <>
      //     На телефон <b>+{inputPhone}</b> поступит звонок. Введите 4 цифры кода
      //     которые Вам продиктуют
      //   </>
      // ) : (
      <>
        На телефон <b>+{inputPhone}</b> поступит звонок. Трубку брать не нужно,
        введите 4 последние цифры номера входящего звонка
      </>
    ) : // )
    process === 'registration' && registrationLevel === 3 ? (
      <>
        Для завершения регистрации создайте пароль.
        <br />
        Пароль должен быть длинной не менее 8 символов.
        {/* , содержать строчные и */}
        {/* заглавные буквы, а также минимум одну цифру. */}
        <br />
        Ваш логин: <b>+{inputPhone}</b>
      </>
    ) : process === 'forgotPassword' && registrationLevel === 3 ? (
      <>
        Создайте новый пароль.
        <br />
        Пароль должен быть длинной не менее 8 символов.
        {/* , содержать строчные и */}
        {/* заглавные буквы, а также минимум одну цифру. */}
        <br />
        Ваш логин: <b>+{inputPhone}</b>
      </>
    ) : null

  const isButtonDisabled =
    !varifyPhone ||
    (process === 'authorization' && inputPassword.length === 0) ||
    (process === 'registration' &&
      ((registrationLevel === 1 && !checkHave18Years) ||
        (registrationLevel === 2 && inputPinCode.length !== 4) ||
        (registrationLevel === 3 &&
          (inputPassword.length === 0 || inputPasswordRepeat.length === 0)))) ||
    (process === 'forgotPassword' &&
      ((registrationLevel === 2 && inputPinCode.length !== 4) ||
        (registrationLevel === 3 &&
          (inputPassword.length === 0 || inputPasswordRepeat.length === 0))))

  return (
    <div className="box-border w-screen h-screen overflow-y-auto">
      {/* <Wave /> */}
      {/* <Image src="/public/img/login/wave.svg" width={174} height={84} /> */}
      <SvgWave
        color={generalColor}
        className="fixed top-0 left-0 hidden w-auto h-full laptop:block -z-10"
      />
      <div className="grid w-full h-full grid-cols-1 px-2 bg-transparent laptop:grid-cols-2 gap-7">
        <div className="items-center hidden text-center laptop:flex">
          <SvgLove color={generalColor} className="w-124" />
        </div>
        <div className="flex items-center justify-center text-center laptop:justify-start">
          <form className="pt-4 pb-10 w-90">
            <div className="flex justify-center w-full">
              {/* <SvgAvatar color={generalColor} className="w-24" /> */}
              <img
                className="rounded-full h-1/6"
                src={'/img/logo.webp'}
                alt="logo"
                // width={48}
                // height={48}
              />
            </div>
            {/* <h2 className="my-4 text-4xl text-gray-900 uppercase">
              Добро пожаловать
            </h2> */}
            <div className="h-8 overflow-hidden text-2xl text-gray-800">
              <p
                className={cn('duration-300', {
                  'opacity-0 h-0': process !== 'registration',
                })}
              >
                Регистрация
              </p>
              <p
                className={cn('duration-300', {
                  'opacity-0 h-0': process !== 'authorization',
                })}
              >
                Авторизация
              </p>
              <p
                className={cn('duration-300', {
                  'opacity-0 h-0': process !== 'forgotPassword',
                })}
              >
                Смена пароля
              </p>
            </div>
            {/* {needToCheckMail ? (
              <div className="flex flex-col items-center mt-6">
                <SvgMailBox color={generalColor} className="w-60" />
                <p className="mt-4">
                  Проверьте почту!
                  <br />
                  Вам было отправлено письмо для завершения регистрации
                </p>
              </div>
            ) : ( */}
            <>
              <Input
                inputRef={inputPhoneRef}
                className="mt-0"
                type="phone"
                label="Телефон"
                name="phone"
                icon={faUser}
                onChange={(event) => {
                  removeError('phone')

                  const value = event.target.value.replace(/[^0-9]/g, '')

                  setInputPhone(
                    !value
                      ? '7'
                      : value == '77' || value == '78'
                      ? '7'
                      : Number(value)
                  )
                }}
                value={inputPhone}
                error={errors.phone}
                max={9999999999}
                maxLength="10"
                tabIndex={
                  (process === 'registration' && registrationLevel === 1) ||
                  process === 'authorization'
                    ? 0
                    : -1
                }
                hidden={
                  (process === 'registration' ||
                    process === 'forgotPassword') &&
                  registrationLevel !== 1
                }
                readOnly={waitingResponse}
              />

              {message && <div className="mt-2">{message}</div>}
              <Input
                type="text"
                label="Последние 4 цифры номера"
                name="pinCode"
                icon={faLock}
                onChange={(event) => {
                  removeError('pinCode')
                  // updateErrors('pinCode', null)
                  setInputPinCode(event.target.value)
                }}
                value={inputPinCode}
                error={errors.pinCode}
                hidden={process === 'authorization' || registrationLevel !== 2}
                tabIndex={
                  process === 'authorization' && registrationLevel === 2
                    ? 0
                    : -1
                }
                readOnly={waitingResponse}
                maxLength="4"
              />
              <Input
                inputRef={inputPasswordRef}
                className="mt-0"
                type="password"
                label="Пароль"
                name="password"
                icon={faLock}
                onChange={(event) => {
                  removeError('password')
                  // updateErrors('password', null)
                  setInputPassword(event.target.value)
                }}
                value={inputPassword}
                error={errors.password}
                tabIndex={
                  ((process === 'registration' ||
                    process === 'forgotPassword') &&
                    registrationLevel === 3) ||
                  process === 'authorization'
                    ? 0
                    : -1
                }
                hidden={process !== 'authorization' && registrationLevel !== 3}
                readOnly={waitingResponse}
              />
              <Input
                type="password"
                label="Повтор пароля"
                name="password2"
                icon={faLock}
                onChange={(event) => {
                  removeError('password')
                  // updateErrors('password', null)
                  setInputPasswordRepeat(event.target.value)
                }}
                value={inputPasswordRepeat}
                error={errors.password}
                tabIndex={
                  (process === 'registration' ||
                    process === 'forgotPassword') &&
                  registrationLevel === 3
                    ? 0
                    : -1
                }
                hidden={process === 'authorization' || registrationLevel !== 3}
                readOnly={waitingResponse}
              />
              <CheckBox
                checked={checkHave18Years}
                labelPos="right"
                onChange={(e) => setCheckHave18Years(!checkHave18Years)}
                label="Мне исполнилось 18 лет"
                wrapperClassName={cn(
                  'overflow-hidden',
                  process === 'registration' && registrationLevel === 1
                    ? 'max-h-15 my-2 py-3'
                    : ''
                )}
                hidden={process !== 'registration' || registrationLevel !== 1}
              />

              {Object.values(errors).length > 0 && (
                <ul className="mb-3 ml-5 text-left text-red-600 list-disc">
                  {Object.values(errors).map(
                    (error, index) =>
                      error && <li key={'error' + error}>{error}</li>
                  )}
                </ul>
              )}
              {errors.pinCodeCountLimit && registrationLevel === 1 && (
                <div
                  className="mb-2 cursor-pointer"
                  onClick={() => setRegistrationLevel(2)}
                >
                  Я знаю код
                </div>
              )}
              {waitingResponse ? (
                <div
                  className={cn(
                    'block border-gray-500 bg-gray-200 w-full h-12 mt-4 text-white uppercase duration-300 border-2 outline-none rounded-3xl'
                  )}
                >
                  <LoadingSpinner size="xxs" />
                </div>
              ) : (
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    submit()
                  }}
                  className={cn(
                    isButtonDisabled
                      ? 'bg-gray-200'
                      : 'bg-gray-500 focus:bg-general focus:border-2 focus:border-black hover:bg-general',
                    'block w-full h-12 text-white uppercase duration-300  border-0 outline-none  rounded-3xl'
                  )}
                  tabIndex={0}
                  disabled={isButtonDisabled}
                >
                  {process === 'authorization'
                    ? 'Авторизироваться'
                    : registrationLevel === 1
                    ? process === 'registration'
                      ? 'Зарегистрироваться'
                      : 'Сменить пароль'
                    : registrationLevel === 2
                    ? 'Отправить код'
                    : process === 'registration'
                    ? 'Завершить регистрацию'
                    : 'Сменить пароль и авторизироваться'}
                </button>
              )}
              {(process === 'registration' || process === 'forgotPassword') &&
                registrationLevel === 2 && (
                  <RepeatCall
                    onClickRepeat={async () => {
                      setWaitingResponse(true)
                      await postData(
                        `/api/${codeSendService}`,
                        {
                          phone: inputPhone,
                          forgotPassword: process === 'forgotPassword',
                        },
                        (res) => {
                          setWaitingResponse(false)
                          if (res.error) {
                            addError({ [res.error.type]: res.error.message })
                            // updateErrors(res.error.type, res.error.message)
                          }
                        },
                        undefined,
                        false,
                        null,
                        true
                      )
                    }}
                  />
                )}
              <div className="flex justify-between mt-4">
                <a
                  tabIndex={0}
                  onClick={() => {
                    clearErrors()
                    setProcess((state) =>
                      state === 'authorization'
                        ? 'registration'
                        : 'authorization'
                    )
                    setRegistrationLevel(1)
                  }}
                  className="block text-sm text-right duration-300 cursor-pointer hover:text-general"
                >
                  {process === 'authorization' ? 'Регистрация' : 'Авторизация'}
                </a>
                {/* TODO Сделать восстановление пароля */}
                <a
                  tabIndex={0}
                  className="block text-sm text-right duration-300 cursor-pointer hover:text-general"
                  onClick={() => {
                    clearErrors()
                    setProcess('forgotPassword')
                    setRegistrationLevel(1)
                  }}
                >
                  Забыли пароль?
                </a>
              </div>
              {/* <div className="my-5 text-lg text-gray-700">Или</div>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    signIn('google')
                  }}
                  // style={{
                  //   backgroundImage:
                  //     'linear-gradient(to right, #32be8f, #38d39f, #32be8f)',
                  // }}
                  className="flex items-center w-full h-12 px-4 text-lg text-black duration-300 bg-white border-2 border-gray-500 outline-none focus:border-general group hover:border-general rounded-3xl"
                >
                  <img
                    className="group-hover:animate-spin"
                    src="/img/google.png"
                  />
                  <span className="flex-1">Google</span>
                </button> */}
              <Link href="/" shallow>
                <a
                  tabIndex={0}
                  className="block py-3 mt-2 mb-5 duration-300 border-t border-gray-400 cursor-pointer hover:text-general"
                >
                  Вернуться на главную страницу сайта
                </a>
              </Link>
            </>
            {/* )} */}
          </form>
        </div>
      </div>
    </div>
  )
}

const Login = (props) => (
  <GoogleReCaptchaProvider
    reCaptchaKey="6Lcw5bwkAAAAAD1qgHYKcEzcbdATVfdI3lIiO5X2"
    scriptProps={{
      async: false,
      defer: false,
      appendTo: 'body',
      nonce: undefined,
    }}
  >
    <LoginPage {...props} />
  </GoogleReCaptchaProvider>
)

export default Login

export const getServerSideProps = async (context) => {
  const session = await getSession({ req: context.req })

  if (session) {
    return {
      redirect: {
        destination: `/cabinet`,
      },
    }
  }
  const response = await getServerSidePropsFunc(
    context,
    getSession,
    fetchSiteSettings
  )

  return response

  // return {
  //   props: {
  //     session,
  //   },
  //   // notFound: true,
  // }
}
