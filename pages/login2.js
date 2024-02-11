import ComboBox from '@components/ComboBox'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Users from '@models/Users'
import dbConnect from '@utils/dbConnect'
import cn from 'classnames'
import { getSession, signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import MaskedInput from 'react-text-mask'
import SvgLove from 'svg/SvgLove'
import SvgWave from 'svg/SvgWave'
import tailwindConfig from 'tailwind.config.js'
import resolveConfig from 'tailwindcss/resolveConfig'

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
                : 'text-disabled'
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
                  : 'text-disabled'
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

const Login = ({ users }) => {
  const router = useRouter()

  const submit = ({ phone, password }) => {
    signIn('credentials', {
      redirect: false,
      phone,
      password,
    }).then((res) => {
      if (res.error === 'CredentialsSignin') {
      } else router.push('/cabinet', '', { shallow: true })
    })
  }

  return (
    <div className="box-border w-screen h-screen overflow-y-auto">
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
            <div className="h-8 overflow-hidden text-2xl text-gray-800">
              <p>Авторизация</p>
            </div>
            <>
              <ComboBox
                wrapperClassName="my-2"
                items={users.map((user) => {
                  return {
                    name:
                      user.secondName +
                      ' ' +
                      user.firstName +
                      ' (+' +
                      user.phone +
                      ') ' +
                      user.role +
                      ' ' +
                      user.status,
                    value: user._id,
                  }
                })}
                // defaultValue={0}
                placeholder="Выбрать пользователя"
                onChange={(id) => {
                  const user = users.find((user) => user._id === id)
                  submit({ phone: user.phone, password: user.password })
                }}
              />
              <Link
                href="/"
                shallow
                tabIndex={0}
                className="block py-3 mt-2 mb-5 duration-300 border-t border-gray-400 cursor-pointer hover:text-general"
              >
                Вернуться на главную страницу сайта
              </Link>
            </>
            {/* )} */}
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login

export const getServerSideProps = async (context) => {
  const session = await getSession({ req: context.req })

  if (process.env.NODE_ENV !== 'development') {
    return {
      redirect: {
        destination: `/login`,
      },
    }
  }

  if (session) {
    return {
      redirect: {
        destination: `/cabinet`,
      },
    }
  }

  const db = await dbConnect()

  const users = await Users.find({})

  return {
    props: {
      session,
      users: JSON.parse(JSON.stringify(users)),
    },
    // notFound: true,
  }
}
