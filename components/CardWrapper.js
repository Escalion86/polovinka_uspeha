import cn from 'classnames'
import React from 'react'
import LoadingSpinner from './LoadingSpinner'

export const CardWrapper = ({ onClick, loading, children, flex = true }) => {
  return (
    <div
      className={cn(
        'relative duration-300 bg-white border-t border-b border-gray-400 shadow-sm hover:shadow-medium-active',
        { 'cursor-pointer': !loading },
        { 'flex gap-x-2': flex }
      )}
      onClick={onClick}
    >
      {loading && (
        <div className="absolute top-0 bottom-0 left-0 right-0 z-10 flex items-center justify-center bg-general bg-opacity-80">
          <LoadingSpinner />
        </div>
      )}
      {children}
    </div>
  )
}
