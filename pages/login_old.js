import { getSession, signIn, signOut, useSession } from 'next-auth/react'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import SvgWave from 'svg/SvgWave'
import SvgLogin from 'svg/SvgLogin'
import SvgAvatar from 'svg/SvgAvatar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock, faPassport, faUser } from '@fortawesome/free-solid-svg-icons'
import cn from 'classnames'
import emailValidator from '@helpers/emailValidator'
import SvgEmailConfirm from 'svg/SvgEmailConfirm'
import SvgMailBox from 'svg/SvgMailBox'
import { postData } from '@helpers/CRUD'
import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from 'tailwind.config.js'
import passwordValidator from '@helpers/passwordValidator'
import SvgLove from 'svg/SvgLove'
import Link from 'next/link'

// import UndrawGraduation from 'public/img/login/undraw_graduation.svg'
// import Image from 'next/image'

const Input = ({
  className = '',
  name,
  icon,
  type = 'text',
  onChange,
  value,
  hidden,
  error = false,
  tabIndex,
  inputRef,
}) => {
  const [focused, setFocused] = useState(false)
  const onFocus = () => setFocused(true)
  const onBlur = () => setFocused(false)

  return (
    <div
      className={cn(
        'my-2 py-3 duration-300 overflow-hidden max-h-15',
        className,
        {
          'max-h-0 my-0 py-0': hidden,
        }
      )}
    >
      <div className={'grid'} style={{ gridTemplateColumns: '7% 93%' }}>
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
              'absolute top-1/2 left-3 -translate-y-1/2 text-lg duration-300',
              { 'text-sm -top-0.5': focused || value },
              error
                ? focused
                  ? 'text-red-600'
                  : 'text-red-400'
                : focused || value
                ? 'text-general'
                : 'text-gray-400'
            )}
          >
            {name}
          </h5>
          <input
            ref={inputRef}
            className="absolute w-full h-full top-0 left-0 border-none outline-none bg-transparent py-0.5 px-1 text-lg text-gray-600"
            type={type}
            onFocus={onFocus}
            onBlur={onBlur}
            value={value}
            onChange={onChange}
            tabIndex={tabIndex}
          />
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

const Login = () => {
  const router = useRouter()
  // const { data: session, status } = useSession()
  // const { courseId, lectureId } = router.query
  const [isRegistrationProcess, setIsRegistrationProcess] = useState(false)
  const [inputEmail, setInputEmail] = useState('')
  const [inputPassword, setInputPassword] = useState('')
  const [inputPasswordRepeat, setInputPasswordRepeat] = useState('')
  const [errors, setErrors] = useState({})
  const [needToCheckMail, setNeedToCheckMail] = useState(false)

  const inputEmailRef = useRef()
  const inputPasswordRef = useRef()

  useEffect(() => {
    if (router.query?.registration === 'true') setIsRegistrationProcess(true)
  }, [router])

  useEffect(() => {
    if (router.query?.email && inputPasswordRef.current) {
      setInputEmail(router.query.email)
      inputPasswordRef?.current?.focus()
    }
  }, [router, inputPasswordRef.current])

  const submit = () => {
    const newErrors = {}

    if (inputEmail === '') {
      newErrors.email = 'Укажите Email'
    } else if (!emailValidator(inputEmail)) {
      newErrors.email = 'Email указан не верно'
    }

    if (inputPassword === '') {
      newErrors.password = 'Введите пароль'
    } else if (isRegistrationProcess) {
      if (!passwordValidator(inputPassword)) {
        newErrors.password =
          'Пароль должен содержать строчные и заглавные буквы, а также минимум одну цифру'
      } else if (inputPassword !== inputPasswordRepeat) {
        newErrors.password = 'Пароли не совпадают'
      }
    }

    if (Object.keys(newErrors).length > 0) {
      return setErrors(newErrors)
    } else {
      clearErrors()
    }

    if (isRegistrationProcess) {
      // Если это регистрация
      postData(
        `/api/emailconfirm`,
        { email: inputEmail, password: inputPassword },
        (res) => {
          if (res.error === 'User already registered') {
            setErrors({
              email: 'Пользователь с таким Email уже зарегистрирован',
            })
            setInputPassword('')
            setInputPasswordRepeat('')
          } else if (res.error) {
            setErrors({
              email: res.error,
            })
          } else {
            setNeedToCheckMail(true)
          }
        }
      )
    } else {
      // Если это авторизация
      signIn('credentials', {
        redirect: false,
        username: inputEmail.toLowerCase(),
        password: inputPassword,
      }).then((res) => {
        if (res.error === 'CredentialsSignin') {
          setInputPassword('')
          setErrors({ password: 'Логин или пароль не верны' })
        }
      })
    }
  }

  const clearErrors = () => {
    if (Object.keys(errors).length > 0) setErrors({})
  }

  const updateErrors = (key, error) => {
    if (errors[key] !== error) setErrors({ ...errors, [key]: error })
  }

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
                  'opacity-0 -mt-8': !isRegistrationProcess,
                })}
              >
                Регистрация
              </p>
              <p
                className={cn('duration-300', {
                  'opacity-0 mt-8': isRegistrationProcess,
                })}
              >
                Авторизация
              </p>
            </div>
            {needToCheckMail ? (
              <div className="flex flex-col items-center mt-6">
                <SvgMailBox color={generalColor} className="w-60" />
                <p className="mt-4">
                  Проверьте почту!
                  <br />
                  Вам было отправлено письмо для завершения регистрации
                </p>
              </div>
            ) : (
              <>
                <Input
                  inputRef={inputEmailRef}
                  className="mt-0"
                  type="text"
                  name="E-Mail"
                  icon={faUser}
                  onChange={(event) => {
                    updateErrors('email', null)
                    setInputEmail(event.target.value)
                  }}
                  value={inputEmail}
                  error={errors.email}
                />
                <Input
                  inputRef={inputPasswordRef}
                  type="password"
                  name="Пароль"
                  icon={faLock}
                  onChange={(event) => {
                    updateErrors('password', null)
                    setInputPassword(event.target.value)
                  }}
                  value={inputPassword}
                  error={errors.password}
                />
                <Input
                  type="password"
                  name="Повтор пароля"
                  icon={faLock}
                  onChange={(event) => {
                    updateErrors('password', null)
                    setInputPasswordRepeat(event.target.value)
                  }}
                  value={inputPasswordRepeat}
                  hidden={!isRegistrationProcess}
                  error={errors.password}
                  tabIndex={isRegistrationProcess ? 0 : -1}
                />
                <div className="flex justify-between">
                  <a
                    tabIndex={0}
                    onClick={() => {
                      clearErrors()
                      setIsRegistrationProcess((state) => !state)
                    }}
                    className="block text-sm text-right duration-300 cursor-pointer hover:text-general"
                  >
                    {isRegistrationProcess ? 'Авторизация' : 'Регистрация'}
                  </a>
                  {/* TODO Сделать восстановление пароля */}
                  <a
                    tabIndex={0}
                    className="block text-sm text-right duration-300 cursor-pointer hover:text-general"
                  >
                    Забыли пароль?
                  </a>
                </div>
                {Object.values(errors).length > 0 && (
                  <ul className="mt-4 ml-5 text-left text-red-600 list-disc">
                    {Object.values(errors).map(
                      (error, index) =>
                        error && <li key={'error' + index}>{error}</li>
                    )}
                  </ul>
                )}
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    submit()
                  }}
                  // style={{
                  //   backgroundImage:
                  //     'linear-gradient(to right, #32be8f, #38d39f, #32be8f)',
                  // }}
                  className={
                    'focus:bg-general focus:border-2 focus:border-black block w-full h-12 mt-4 text-white uppercase duration-300 bg-gray-500 border-0 outline-none hover:bg-general rounded-3xl'
                  }
                  tabIndex={0}
                >
                  {isRegistrationProcess
                    ? 'Зарегистрироваться'
                    : 'Авторизироваться'}
                </button>
                <div className="my-5 text-lg text-gray-700">Или</div>
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
                </button>
                <Link href="/">
                  <a
                    tabIndex={0}
                    className="block py-3 my-5 duration-300 border-t border-gray-400 cursor-pointer hover:text-general"
                  >
                    Вернуться на главную страницу сайта
                  </a>
                </Link>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

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

  return {
    props: {
      session,
    },
    // notFound: true,
  }
}
