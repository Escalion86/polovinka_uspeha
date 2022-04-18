import { signIn, signOut, useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import SvgWave from 'svg/SvgWave'
import SvgEmailConfirm from 'svg/SvgEmailConfirm'
import SvgAvatar from 'svg/SvgAvatar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock, faPassport, faUser } from '@fortawesome/free-solid-svg-icons'
import cn from 'classnames'
import EmailConfirmations from '@models/EmailConfirmations'
import Users from '@models/Users'
import Link from 'next/link'
import dbConnect from '@utils/dbConnect'

const EmailConfirm = ({ user, error, success }) => {
  const router = useRouter()

  const [counter, setCounter] = useState(5)

  useEffect(() => {
    if (success) setInterval(() => setCounter((state) => state - 1), 1000)
  }, [success])

  if (counter === 0) router.push(`/login?email=${user.email}`)
  return (
    <div className="box-border w-screen h-screen overflow-hidden">
      <SvgWave className="fixed top-0 left-0 hidden w-auto h-full laptop:block -z-10" />
      <div className="flex flex-col items-center justify-center w-full h-full px-2 bg-transparent ">
        <Link href="/">
          <a>
            <img
              src="/img/UniPlatform2_inverse.png"
              alt="uniplatform"
              width={300}
              // height={40}
            />
          </a>
        </Link>
        <SvgEmailConfirm
          className="w-2/5 mt-10 max-w-400"
          text={user.email}
          error={error}
          checked={success}
        />
        <div className="flex items-center justify-center mt-6 text-center laptop:text-lg">
          {!error && !success && 'Проверка данных...'}
          {error}
          {success}
          {success
            ? `Вы будете автоматически перенаправлены на страницу авторизации через... ${counter}`
            : null}
        </div>
      </div>
    </div>
  )
}

export default EmailConfirm

export const getServerSideProps = async (context) => {
  const { email, token } = context.query

  if (!email || !token) {
    return {
      props: {
        user: {
          email,
        },
        error: 'Неверная ссылка',
      },
    }
  }
  await dbConnect()

  // Сначала проверяем наличие запроса на регистрацию и верность токена
  const data = await EmailConfirmations.findOne({ email, token })
  if (!data) {
    return {
      props: {
        user: {
          email,
        },
        error: 'Ссылка устарела или не верна',
      },
    }
  }

  // Теперь проверяем, может такой пользователь уже существует
  const existingUser = await Users.findOne({ email })

  if (existingUser)
    return {
      props: {
        user: {
          email,
        },
        error: 'Ошибка! Пользователь с таким email уже авторизован',
      },
    }

  // Создаем пользователя
  const newUser = await Users.create({
    email,
    password: data.password,
    name: '',
  })

  if (!newUser)
    return {
      props: {
        user: {
          email,
        },
        error:
          'Ошибка создания пользователя. Пожалуйста обратитесь к администратору',
      },
    }

  // Теперь удаляем токен
  await EmailConfirmations.deleteOne({ email, token })

  return {
    props: {
      user: {
        email: context.query.email,
      },
      success: 'Почта подтверждена!',
    },
  }
}
