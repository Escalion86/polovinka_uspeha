// import isDevMode from '@helpers/isDevMode'
import isLoggedUserDevSelector from '@state/selectors/isLoggedUserDevSelector'
import cn from 'classnames'
import { useRecoilValue } from 'recoil'
// import { useEffect, useState } from 'react'

const DeviceCheck = ({ textClassName = null }) => {
  const isLoggedUserDev = useRecoilValue(isLoggedUserDevSelector)

  if (!isLoggedUserDev) return null

  return (
    <div
      className={cn(
        'right-0 flex items-center justify-center text-white border-white border-t-1 border-l-1 border-b-1 fixed z-50 h-24 text-sm leading-3 w-10 top-40 bg-general rounded-l-md transform'
      )}
    >
      <div className="-rotate-90">
        <div
          className={
            (textClassName ? textClassName : '') + 'text-center phoneH:hidden'
          }
        >
          Телефон вертикаль
        </div>
        <div
          className={
            (textClassName ? textClassName : '') +
            ' text-center hidden phoneH:block tablet:hidden'
          }
        >
          Телефон горизонт
        </div>
        <div
          className={
            (textClassName ? textClassName : '') +
            ' text-center hidden tablet:block laptop:hidden'
          }
        >
          Планшет
        </div>
        <div
          className={
            (textClassName ? textClassName : '') +
            ' text-center hidden laptop:block desktop:hidden'
          }
        >
          Ноутбук
        </div>
        <div
          className={
            (textClassName ? textClassName : '') +
            ' text-center hidden desktop:block'
          }
        >
          Компьютер
        </div>
      </div>
    </div>
  )
}

export default DeviceCheck
