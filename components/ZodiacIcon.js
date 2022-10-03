import getZodiac from '@helpers/getZodiac'
import Tooltip from '@components/Tooltip'
import React from 'react'
import cn from 'classnames'

const ZodiacIcon = ({ date, className }) => {
  if (!date) return null
  const zodiacObj = getZodiac(date)
  const Component = zodiacObj.component
  return (
    <Tooltip title={zodiacObj.name}>
      <div>
        <Component className={cn('w-5 h-5 fill-general', className)} />
      </div>
    </Tooltip>
  )
}

export default ZodiacIcon
