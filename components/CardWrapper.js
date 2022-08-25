import { faEyeSlash } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useWindowDimensionsTailwind } from '@helpers/useWindowDimensions'
import { modalsFuncAtom } from '@state/atoms'
import cn from 'classnames'
import React from 'react'
import { useRecoilValue } from 'recoil'
import LoadingSpinner from './LoadingSpinner'

export const CardWrapper = ({
  onClick,
  loading,
  error,
  children,
  flex = true,
  gap = true,
  showOnSite = true,
  className,
}) => {
  // const modalsFunc = useRecoilValue(modalsFuncAtom)
  const device = useWindowDimensionsTailwind()
  return (
    <div
      className={cn(
        'relative flex-col w-full laptop:flex-row items-center laptop:items-stretch duration-300 bg-white border-t border-b border-gray-400 shadow-sm hover:shadow-medium-active',
        { 'cursor-pointer': !loading },
        { flex: flex },
        { 'gap-x-2': gap },
        className
      )}
      onClick={onClick}
    >
      {error && (
        <div
          // onClick={() => modalsFunc.error(error)}
          className="absolute top-0 bottom-0 left-0 right-0 z-10 flex items-center justify-center text-2xl text-white bg-red-800 bg-opacity-80"
        >
          ОШИБКА
        </div>
      )}
      {loading && !error && (
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
