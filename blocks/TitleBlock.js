import PulseButton from '@components/PulseButton'
import { H1, H3, H4 } from '@components/tags'
import getDiffBetweenDates from '@helpers/getDiffBetweenDates'
import upperCaseFirst from '@helpers/upperCaseFirst'
import FlipClockCountdown from '@leenguyen/react-flip-clock-countdown'
import { modalsFuncAtom } from '@state/atoms'
import loggedUserAtom from '@state/atoms/loggedUserAtom'
import siteSettingsAtom from '@state/atoms/siteSettingsAtom'
import locationPropsSelector from '@state/selectors/locationPropsSelector'
import windowDimensionsTailwindSelector from '@state/selectors/windowDimensionsTailwindSelector'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useRecoilValue } from 'recoil'
import Svg30Plus from 'svg/Svg30Plus'

const TitleBlock = () => {
  const userIsLogged = !!useRecoilValue(loggedUserAtom)
  const { townRu } = useRecoilValue(locationPropsSelector)
  const modalFunc = useRecoilValue(modalsFuncAtom)
  const siteSettings = useRecoilValue(siteSettingsAtom)
  const router = useRouter()
  const device = useRecoilValue(windowDimensionsTailwindSelector)

  const [showCoundownTimer, setShowCoundownTimer] = useState(
    siteSettings.dateStartProject &&
      getDiffBetweenDates(siteSettings.dateStartProject) < 0
  )
  const sizeKoef =
    device === 'phoneV'
      ? 0.65
      : device === 'phoneH'
      ? 0.8
      : device === 'tablet'
      ? 1
      : 1.1

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

        <div className="flex justify-center flex-1 max-h-[350px] h-[20%]">
          <img
            className="object-contain max-w-[90%] laptop:max-w-[100%] h-full"
            src={'/img/logo.webp'}
            alt="polovinka_uspeha"
            // width="100%"
            // height="100%"
          />
        </div>
        {showCoundownTimer && (
          <div className="flex flex-col items-center px-6 py-2 bg-white tablet:px-10 gap-y-1 bg-opacity-20 rounded-2xl">
            <div
              className="text-xl uppercase tablet:text-2xl"
              style={{ textShadow: '1px 1px 2px black' }}
            >
              Старт проекта через
            </div>
            <FlipClockCountdown
              onComplete={() => setShowCoundownTimer(false)}
              to={siteSettings.dateStartProject}
              labels={['Дни', 'Часы', 'Минуты', 'Секунды']}
              labelStyle={{
                fontSize: 15 * sizeKoef,
                fontWeight: 500 * sizeKoef,
                textTransform: 'uppercase',
                color: 'white',
                textShadow: '1px 1px 2px black',
              }}
              digitBlockStyle={{
                width: 40 * sizeKoef,
                height: 60 * sizeKoef,
                fontSize: 30 * sizeKoef,
                color: 'black',
                background: 'white',
              }}
              dividerStyle={{ color: 'rgba(0,0,0,0.1)', height: 1 }}
              separatorStyle={{ color: '#7a5151', size: '5px' }}
              duration={0.5}
            />
          </div>
        )}
        <div className="flex flex-col justify-between gap-y-2">
          <H1
            style={{ textShadow: '1px 1px 2px black' }}
            // style={{ fontSize: '6vw', lineHeight: '5vw' }}
          >
            Центр серьёзных знакомств
          </H1>
          <div className="text-center">
            <h4
              className="px-2 py-1 text-2xl font-bold text-center duration-300 bg-white border cursor-pointer rounded-xl hover:text-white border-general hover:bg-general bg-opacity-20 text-general"
              // style={{ textShadow: '1px 1px 3px white' }}
              onClick={() => modalFunc.browseLocation()}
            >
              г.{upperCaseFirst(townRu)}
            </h4>
            <p className="font-sans text-[12px]">
              *- если это не ваш регион, то пожалуйста нажмите на него, чтобы
              сменить
            </p>
          </div>
          <H3
            // className="font-thin"
            style={{ textShadow: '1px 1px 2px black' }}
          >
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
            // onClick={() =>
            //   router.push('./login?registration=true', '', { shallow: true })
            // }
          />
        </Link>
      </div>
    </div>
  )
}

export default TitleBlock
