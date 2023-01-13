import { faEyeSlash } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { useWindowDimensionsTailwind } from '@helpers/useWindowDimensions'
import windowDimensionsTailwindSelector from '@state/selectors/windowDimensionsTailwindSelector'
import cn from 'classnames'
// import { motion } from 'framer-motion'
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
  hidden,
  style,
}) => {
  // const device = useWindowDimensionsTailwind()
  const device = useRecoilValue(windowDimensionsTailwindSelector)
  return (
    <div
      style={style}
      className={cn(
        'w-full',

        hidden ? 'overflow-hidden' : ''
      )}
      onClick={onClick}
      // transition={{ duration: 0.3, type: 'just' }}
      // animate={{
      //   height: hidden ? 0 : 'auto',
      // }}
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
      </div>
    </div>
  )
}
