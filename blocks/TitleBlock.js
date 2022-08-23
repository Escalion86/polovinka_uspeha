import PulseButton from '@components/PulseButton'
import { H2, H1, H3 } from '@components/tags'
import Link from 'next/link'
import { useRouter } from 'next/router'

const TitleBlock = ({ userIsLogged = false }) => {
  const router = useRouter()

  return (
    <div
      className="h-[calc(100vh-70px)]"
      style={{
        backgroundImage: `url("/img/bg.webp")`,
        backgroundRepeat: 'no-repeat',
        // backgroundPosition: 'top 48px right',
        backgroundSize: 'cover',
      }}
    >
      <div className="flex flex-col items-center justify-center w-full h-full max-h-[calc(100vh-70px)] px-10 pt-5 tablet:pt-12 pb-8 tablet:pb-10 text-white bg-gray-800 bg-opacity-20 tablet:px-20 ">
        <div className="flex justify-center flex-1 max-h-[400px]">
          <img
            className="object-contain max-w-[90%] laptop:max-w-[100%] h-full"
            src={'/img/logo.webp'}
            alt="polovinka_uspeha"
            // width="100%"
            // height="100%"
          />
        </div>
        <div className="flex flex-col justify-between gap-y-2">
          <H1
            style={{ textShadow: '1px 1px 2px black' }}
            // style={{ fontSize: '6vw', lineHeight: '5vw' }}
          >
            Центр осознанных знакомств
          </H1>
          <H3 style={{ textShadow: '1px 1px 2px black' }} bold={false}>
            г.Красноярск
          </H3>
          <H2
            // className="font-thin"
            style={{ textShadow: '1px 1px 2px black' }}
          >
            Мы работаем онлайн и организовываем офлайн-события
            <br />
            для поиска своей половинки 30+
          </H2>
        </div>
        {!userIsLogged && (
          <Link
            href={{
              pathname: '/login',
              query: { registration: true },
            }}
          >
            <PulseButton
              className="mt-4"
              title="Зарегистрироваться"
              onClick={() => router.push('./login?registration=true')}
            />
          </Link>
        )}
      </div>
    </div>
  )
}

export default TitleBlock
