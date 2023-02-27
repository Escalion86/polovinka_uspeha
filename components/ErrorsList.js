import cn from 'classnames'
import React from 'react'

function ErrorsList({ errors, className }) {
  return (
    Object.values(errors).length > 0 && (
      <div className={cn('flex flex-col col-span-2 text-red-500', className)}>
        {Object.values(errors).map((error) => (
          <div key={error}>{error}</div>
        ))}
      </div>
    )
  )
}

export default ErrorsList
