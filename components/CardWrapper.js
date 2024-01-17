import { faEyeSlash } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import windowDimensionsTailwindSelector from '@state/selectors/windowDimensionsTailwindSelector'
import cn from 'classnames'
import { useRecoilValue } from 'recoil'
import LoadingSpinner from './LoadingSpinner'

const parentHasAttr = (e, attr) => {
  if (!e.parentNode || e.parentNode.tagName === 'BODY') return false
  if (e.parentNode.getAttribute('data-prevent-parent-click')) return true
  return parentHasAttr(e.parentNode, attr)
}

export const CardWrapper = ({
  onClick,
  loading,
  error,
  children,
  flex = true,
  gap = true,
  showOnSite = true,
  className,
  hidden,
  style,
}) => {
  const device = useRecoilValue(windowDimensionsTailwindSelector)
  return (
    <div
      style={style}
      className={cn('w-full', hidden ? 'overflow-hidden' : '')}
      onClick={(e) => {
        if (onClick && !parentHasAttr(e.target, 'data-prevent-parent-click'))
          onClick()
      }}
    >
      <div className="py-0.5">
        <div
          className={cn(
            'bg-white border-t border-b border-gray-400 relative w-full duration-300 shadow-sm hover:shadow-medium-active',
            { 'cursor-pointer': !loading },
            {
              'flex flex-col laptop:flex-row items-center laptop:items-stretch':
                flex,
            },
            { 'gap-x-2': gap },
            className
          )}
        >
          {error && (
            <div className="absolute top-0 bottom-0 left-0 right-0 z-10 flex items-center justify-center text-2xl text-white bg-red-800 bg-opacity-80">
              ОШИБКА
            </div>
          )}
          {loading && !error && (
            <div className="absolute top-0 bottom-0 left-0 right-0 z-20 flex items-center justify-center bg-general bg-opacity-80">
              <LoadingSpinner />
            </div>
          )}
          {!showOnSite &&
            (device === 'phoneV' ||
              device === 'phoneH' ||
              device == 'tablet') && (
              <div className="absolute top-0 left-0 z-10 w-12 h-12 overflow-hidden">
                <div className="absolute w-24 h-24 pb-1 pr-1 bg-purple-500 rounded-full pt-[54px] pl-[54px] -left-12 -top-12">
                  <FontAwesomeIcon
                    className="text-white w-7 h-7"
                    icon={faEyeSlash}
                  />
                </div>
              </div>
            )}
          {children}
        </div>
      </div>
    </div>
  )
}
