import React from 'react'
import cn from 'classnames'

const TextLinesLimiter = ({ className, lines = 1, children, ...props }) => {
  return (
    <div
      className={cn('overflow-hidden', className)}
      style={{
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: lines,
      }}
      {...props}
    >
      {children}
    </div>
  )
}

export default TextLinesLimiter
