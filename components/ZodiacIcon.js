import getZodiac from '@helpers/getZodiac'
import Tooltip from '@components/Tooltip'
import React from 'react'

const ZodiacIcon = ({ date, className }) => {
  if (!date) return null
  const zodiacObj = getZodiac(date)
  const Component = zodiacObj.component
  return (
    <Tooltip title={zodiacObj.name}>
      <div>
        <Component className={className} />
      </div>
    </Tooltip>
  )
}

export default ZodiacIcon
