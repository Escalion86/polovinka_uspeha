import getZodiac from '@helpers/getZodiac'
import Tooltip from '@components/Tooltip'
import React from 'react'
import cn from 'classnames'

const ZodiacIcon = ({ date, className, small = false }) => {
  if (!date) return null
  const zodiacObj = getZodiac(date)
  const Component = zodiacObj.component
  return (
    <Tooltip title={zodiacObj.name}>
      <div>
        <Component
          className={cn(
            'fill-general',
            small ? 'w-4 h-4' : 'w-5 h-5',
            className
          )}
        />
      </div>
    </Tooltip>
  )
}

export default ZodiacIcon
