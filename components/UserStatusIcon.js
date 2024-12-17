import { faQuestion } from '@fortawesome/free-solid-svg-icons/faQuestion'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons/faSignOutAlt'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import cn from 'classnames'
import Image from 'next/image'
import Tooltip from './Tooltip'
import { forwardRef } from 'react'

const UserStatusIcon = forwardRef(({ status, size, slashed = false }, ref) => {
  var numSize
  switch (size) {
    case 'xs':
      numSize = 3
      break
    case 's':
      numSize = 4
      break
    case 'm':
      numSize = 5
      break
    case 'l':
      numSize = 6
      break
    default:
      numSize = 6
  }

  switch (status) {
    case 'novice':
      return (
        <Tooltip title={'Новичок' + (slashed ? ' (запрещено)' : '')}>
          <div ref={ref} className="relative">
            <div
              className={`grayscale brightness-150 contrast-75 flex items-center justify-center min-w-${
                numSize + 1
              } w-${numSize + 1} h-${numSize + 1}`}
            >
              <Image
                alt="member"
                src="/img/svg_icons/medal.svg"
                width={numSize * 4}
                height={numSize * 4}
                style={{ width: 'auto', height: 'auto' }}
              />
            </div>
            {slashed && (
              <div
                className={`absolute -left-0.5 w-${numSize + 2} h-0 border rotate-[30deg] top-1/2 border-danger`}
              />
            )}
          </div>
        </Tooltip>
      )
    case 'member':
      return (
        <Tooltip title={'Участник клуба' + (slashed ? ' (запрещено)' : '')}>
          <div ref={ref} className="relative">
            <div
              className={`flex items-center justify-center min-w-${
                numSize + 1
              } w-${numSize + 1} h-${numSize + 1}`}
            >
              <Image
                alt="member"
                src="/img/svg_icons/medal.svg"
                width={numSize * 4}
                height={numSize * 4}
                style={{ width: 'auto', height: 'auto' }}
              />
            </div>
            {slashed && (
              <div
                className={`absolute -left-0.5 w-${numSize + 2} h-0 border rotate-[30deg] top-1/2 border-danger`}
              />
            )}
          </div>
        </Tooltip>
      )
    case 'ban':
      return (
        <Tooltip title={'Забанен' + (slashed ? ' (запрещено)' : '')}>
          <div ref={ref} className="relative">
            <div
              className={`flex items-center justify-center min-w-${
                numSize + 1
              } w-${numSize + 1} h-${numSize + 1}`}
            >
              <Image
                src="/img/svg_icons/ban.svg"
                width={numSize * 4}
                height={numSize * 4}
              />
            </div>
            {slashed && (
              <div
                className={`absolute -left-0.5 w-${numSize + 2} h-0 border rotate-[30deg] top-1/2 border-danger`}
              />
            )}
          </div>
        </Tooltip>
      )
    case 'signout':
      return (
        <Tooltip title={'Не зарегистрирован' + (slashed ? ' (запрещено)' : '')}>
          <div ref={ref} className="relative">
            <div
              className={`flex items-center justify-center min-w-${
                numSize + 1
              } w-${numSize + 1} h-${numSize + 1}`}
            >
              <FontAwesomeIcon
                className={cn(
                  `min-w-${numSize} w-${numSize} h-${numSize}`,
                  'text-blue-600'
                )}
                icon={faSignOutAlt}
              />
            </div>
            {slashed && (
              <div
                className={`absolute -left-0.5 w-${numSize + 2} h-0 border rotate-[30deg] top-1/2 border-danger`}
              />
            )}
          </div>
        </Tooltip>
      )
    default:
      return (
        <Tooltip title="Статус не указан">
          <div ref={ref} className="relative">
            <div
              className={`flex items-center justify-center min-w-${
                numSize + 1
              } w-${numSize + 1} h-${numSize + 1}`}
            >
              <FontAwesomeIcon
                className={cn(
                  `min-w-${numSize} w-${numSize} h-${numSize}`,
                  'text-danger'
                )}
                icon={faQuestion}
              />
            </div>
            {slashed && (
              <div
                className={`absolute -left-0.5 w-${numSize + 2} h-0 border rotate-[30deg] top-1/2 border-danger`}
              />
            )}
          </div>
        </Tooltip>
      )
  }
})

export default UserStatusIcon
