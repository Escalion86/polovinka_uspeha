import {
  faExclamationTriangle,
  faWarning,
} from '@fortawesome/free-solid-svg-icons'
import { faQuoteRight } from '@fortawesome/free-solid-svg-icons/faQuoteRight'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import cn from 'classnames'

const Note = ({ children, noMargin, className, type }) => (
  // <div className="relative pt-2.5 pb-2 px-2 mb-2 mt-4 text-base leading-4 bg-teal-100 border-2 border-teal-400 rounded-lg">
  //   <div className="absolute px-2 text-teal-700 bg-white rounded-md text-sm -top-[12px] left-2">
  //     <div className="absolute top-0 left-0 right-0 h-full px-1 border-t-2 border-b-2 border-l-2 border-r-2 border-teal-400 rounded-md font-semkibold" />
  //     Примечание
  //   </div>
  //   {children}
  // </div>
  <div
    className={cn(
      'relative pt-2.5 pb-2 px-2 text-base leading-4 italic border-l-4 rounded-[4px]',
      noMargin ? '' : 'my-2',
      type === 'error'
        ? 'text-red-900 bg-red-100 border-red-400'
        : type === 'warning'
          ? 'text-orange-600 bg-orange-100 border-orange-300'
          : 'text-teal-900 bg-teal-100 border-teal-400',
      className
    )}
  >
    {children}
    <FontAwesomeIcon
      icon={
        type === 'error'
          ? faExclamationTriangle
          : type === 'warning'
            ? faWarning
            : faQuoteRight
      }
      className={cn(
        'absolute w-4 h-4 right-1 top-1',
        type === 'error'
          ? 'text-red-600/70'
          : type === 'warning'
            ? 'text-orange-500/70'
            : 'text-teal-600/70'
      )}
    />
  </div>
)

export default Note
