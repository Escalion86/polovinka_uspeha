import isDevMode from '@helpers/isDevMode'
import cn from 'classnames'
import { useEffect, useState } from 'react'

const DeviceCheck = ({ textClassName = null, right = false }) => {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (isDevMode) setShow(true)
  })

  if (!show) return null

  return (
    <div
      className={cn(
        'flex items-center justify-center text-white border-white border-t-1 border-r-1 border-l-1 fixed z-50 h-10 text-sm leading-3 w-24 top-40 bg-general rounded-t-md transform',
        right ? '-right-7 -rotate-90' : '-left-7 rotate-90'
      )}
    >
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
  )
}

export default DeviceCheck
