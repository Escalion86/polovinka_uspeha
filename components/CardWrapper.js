import { faEyeSlash } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useWindowDimensionsTailwind } from '@helpers/useWindowDimensions'
import cn from 'classnames'
import React from 'react'
import LoadingSpinner from './LoadingSpinner'

export const CardWrapper = ({
  onClick,
  loading,
  children,
  flex = true,
  gap = true,
  showOnSite = true,
}) => {
  const device = useWindowDimensionsTailwind()
  return (
    <div
      className={cn(
        'relative flex-col w-full tablet:flex-row flex-wrap duration-300 bg-white border-t border-b border-gray-400 shadow-sm hover:shadow-medium-active',
        { 'cursor-pointer': !loading },
        { flex: flex },
        { 'gap-x-2': gap }
      )}
      onClick={onClick}
    >
      {loading && (
        <div className="absolute top-0 bottom-0 left-0 right-0 z-10 flex items-center justify-center bg-general bg-opacity-80">
          <LoadingSpinner />
        </div>
      )}
      {!showOnSite && (device === 'phoneV' || device === 'phoneH') && (
        <FontAwesomeIcon
          icon={faEyeSlash}
          className="absolute z-10 w-8 h-8 p-1 text-purple-500 bg-white rounded-full top-2 left-2 "
        />
      )}
      {children}
    </div>
  )
}
