import PulseButton from '@components/PulseButton'
import { H2, H1, H3, H4 } from '@components/tags'
import loggedUserAtom from '@state/atoms/loggedUserAtom'
import Link from 'next/link'
// import { useRouter } from 'next/router'
import { useRecoilValue } from 'recoil'
import Svg30Plus from 'svg/Svg30Plus'

const TitleBlock = () => {
  const userIsLogged = !!useRecoilValue(loggedUserAtom)
  // const router = useRouter()

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
      <div className="relative flex flex-col items-center justify-center w-full h-full max-h-[calc(100vh-70px)] px-10 pt-5 tablet:pt-12 pb-8 tablet:pb-10 text-white bg-gray-800 bg-opacity-20 laptop:px-20 ">
        {/* <img
          className="absolute w-12 h-12 tablet:w-16 tablet:h-16 top-6 right-6 tablet:top-14 tablet:right-12 laptop:h-20 laptop:w-20"
          src={'/img/other/30-plus.png'}
          alt="30+"
          // width="100%"
          // height="100%"
        /> */}
        <Svg30Plus className="absolute w-12 h-12 tablet:w-16 tablet:h-16 top-6 right-6 tablet:top-14 tablet:right-12 laptop:h-20 laptop:w-20 fill-general" />

        <div className="flex justify-center flex-1 max-h-[350px]">
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
          <H4 style={{ textShadow: '1px 1px 2px black' }} bold={false}>
            г.Красноярск
          </H4>
          <H3
            // className="font-thin"
            style={{ textShadow: '1px 1px 2px black' }}
          >
            Уникальные форматы знакомств
            <br />
            для поиска своей второй половинки
          </H3>
        </div>
        {!userIsLogged && (
          <Link
            href={{
              pathname: '/login',
              query: { registration: true },
            }}
            shallow
          >
            <PulseButton
              className="mt-4"
              title="Зарегистрироваться"
              // onClick={() =>
              //   router.push('./login?registration=true', '', { shallow: true })
              // }
            />
          </Link>
        )}
      </div>
    </div>
  )
}

export default TitleBlock
