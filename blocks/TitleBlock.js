import PulseButton from '@components/PulseButton'
import { H1, H3 } from '@components/tags'
import upperCaseFirst from '@helpers/upperCaseFirst'
import { modalsFuncAtom } from '@state/atoms'
import loggedUserAtom from '@state/atoms/loggedUserAtom'
import locationPropsSelector from '@state/selectors/locationPropsSelector'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useRecoilValue } from 'recoil'
import Svg30Plus from 'svg/Svg30Plus'
import CountDown from './components/CountDown'

const TitleBlock = () => {
  const userIsLogged = !!useRecoilValue(loggedUserAtom)
  const { townRu } = useRecoilValue(locationPropsSelector)
  const modalsFunc = useRecoilValue(modalsFuncAtom)
  const router = useRouter()

  return (
    <div
      className="h-[calc(100vh-70px)]"
      style={{
        backgroundImage: `url("/img/bg.webp")`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
    >
      <div className="relative flex flex-col items-center justify-center w-full h-full max-h-[calc(100vh-70px)] px-10 pt-5 tablet:pt-12 pb-8 tablet:pb-10 text-white bg-gray-800 bg-opacity-20 laptop:px-20 ">
        <Svg30Plus className="absolute w-12 h-12 tablet:w-16 tablet:h-16 top-6 right-6 tablet:top-14 tablet:right-12 laptop:h-20 laptop:w-20 fill-general" />

        <div className="flex justify-center flex-1 max-h-[350px] h-[20%]">
          <img
            className="object-contain max-w-[90%] laptop:max-w-[100%] h-full"
            src={'/img/logo.webp'}
            alt="polovinka_uspeha"
          />
        </div>

        <CountDown
          Wrapper={({ children }) => (
            <div className="flex flex-col items-center px-6 py-2 bg-white tablet:px-10 gap-y-1 bg-opacity-20 rounded-2xl">
              <div
                className="text-xl uppercase tablet:text-2xl"
                style={{ textShadow: '1px 1px 2px black' }}
              >
                Старт проекта через
              </div>
              {children}
            </div>
          )}
        />
        <div className="flex flex-col justify-between gap-y-2">
          <H1 style={{ textShadow: '1px 1px 2px black' }}>
            Центр серьёзных знакомств
          </H1>
          <div className="text-center">
            <h4
              className="px-2 py-1 text-2xl font-bold text-center duration-300 bg-white border cursor-pointer rounded-xl hover:text-white border-general hover:bg-general bg-opacity-20 text-general"
              onClick={() => modalsFunc.browseLocation()}
            >
              г.{upperCaseFirst(townRu)}
            </h4>
            <p className="font-sans text-[12px]">
              *- если это не ваш регион, то пожалуйста нажмите на него, чтобы
              сменить
            </p>
          </div>
          <H3 style={{ textShadow: '1px 1px 2px black' }}>
            Уникальные форматы знакомств
            <br />
            для поиска своей второй половинки
          </H3>
        </div>
        <Link
          href={{
            pathname: userIsLogged ? '/cabinet/events' : '/login',
            query: !userIsLogged && { ...router.query, registration: true },
          }}
          shallow
        >
          <PulseButton
            className="mt-4"
            title={userIsLogged ? 'Мой кабинет' : 'Зарегистрироваться'}
            noPulse={userIsLogged}
          />
        </Link>
      </div>
    </div>
  )
}

export default TitleBlock
