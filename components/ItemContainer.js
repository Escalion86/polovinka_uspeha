import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck'
import { faSquare } from '@fortawesome/free-regular-svg-icons/faSquare'
import { faCheckSquare } from '@fortawesome/free-regular-svg-icons/faCheckSquare'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import cn from 'classnames'

const ItemContainer = ({
  onClick,
  active,
  children,
  noPadding = false,
  className,
  noBorder = false,
  style,
}) => (
  <div
    className={cn(
      'relative flex w-full max-w-full',
      { 'hover:bg-blue-200 cursor-pointer': onClick },
      { 'bg-general/20': active },
      { 'py-0.5 px-1': !noPadding },
      { 'border-b border-gray-700 last:border-0': !noBorder },
      className
    )}
    style={style}
    onClick={
      onClick
        ? (e) => {
            e.stopPropagation()
            onClick()
          }
        : null
    }
  >
    {typeof active === 'boolean' && (
      <div
        className={cn(
          'transition-all flex items-center overflow-hidden duration-300 min-w-6',
          // active ? 'w-7' : 'w-0'
          active ? 'bg-general' : 'bg-gray-400'
        )}
      >
        {/* {typeof active === 'boolean' ? ( */}
        <FontAwesomeIcon
          icon={active ? faCheckSquare : faSquare}
          className={cn(
            'w-5 h-5 min-w-5 mx-0.5 min-h-5',
            faCheck ? 'text-white' : 'text-gray-400'
          )}
        />
        {/* ) : (
          <div className="w-6 h-6 text-lg flex items-center justify-center ml-0.5 text-white">
            {active}
          </div>
        )} */}
      </div>
    )}
    {children}
  </div>
)

export default ItemContainer
