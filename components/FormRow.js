import cn from 'classnames'
import React from 'react'

const FormRow = ({ children, className }) => {
  return (
    <div className={cn('flex flex-1 gap-x-2 items-center', className)}>
      {children}
    </div>
  )
}

export default FormRow
