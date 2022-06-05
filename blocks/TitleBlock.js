import PulseButton from '@components/PulseButton'
import { H2, H1 } from '@components/tags'
import Link from 'next/link'
import { useRouter } from 'next/router'

const TitleBlock = ({ userIsLogged = false }) => {
  const router = useRouter()

  return (
    <div
      className="h-screen"
      style={{
        backgroundImage: `url("/img/bg.webp")`,
        backgroundRepeat: 'no-repeat',
        // backgroundPosition: 'top 48px right',
        backgroundSize: 'cover',
      }}
    >
      <div className="flex flex-col items-center justify-center w-full h-full px-10 text-white bg-gray-800 bg-opacity-20 gap-y-4 tablet:px-20 ">
        <img
          src={'/img/logo.webp'}
          alt="polovinka_uspeha"
          // width={48}
          // height={48}
        />
        <H1
          style={{ textShadow: '1px 1px 2px black' }}
          // style={{ fontSize: '6vw', lineHeight: '5vw' }}
        >
          Центр осознанных знакомств
        </H1>
        <H2
          // className="font-thin"
          style={{ textShadow: '1px 1px 2px black' }}
        >
          г.Красноярск
        </H2>
        {/* {!userIsLogged && (
          <Link
            href={{
              pathname: '/login',
              query: { registration: true },
            }}
          >
            <PulseButton
              className="mt-8"
              title="Зарегистрироваться"
              // onClick={() => router.push('./login?registration=true')}
            />
          </Link>
        )} */}
      </div>
    </div>
  )
}

export default TitleBlock
