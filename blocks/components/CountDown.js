import getDiffBetweenDates from '@helpers/getDiffBetweenDates'
import FlipClockCountdown from '@leenguyen/react-flip-clock-countdown'
import siteSettingsAtom from '@state/atoms/siteSettingsAtom'
import windowDimensionsTailwindSelector from '@state/selectors/windowDimensionsTailwindSelector'
import React, { useState } from 'react'
import { useRecoilValue } from 'recoil'

const CountDown = ({ children, Wrapper = ({ children }) => children }) => {
  const siteSettings = useRecoilValue(siteSettingsAtom)

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

  return showCoundownTimer ? (
    <div className="flex flex-col items-center px-6 py-2 bg-white/20 tablet:px-10 gap-y-1 rounded-2xl">
      <div
        className="text-xl text-white uppercase tablet:text-2xl"
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
  ) : (
    children
  )
}

export default CountDown
