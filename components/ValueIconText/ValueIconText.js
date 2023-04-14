import TextLinesLimiter from '@components/TextLinesLimiter'
import Tooltip from '@components/Tooltip'
import { faQuestion } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

const ValueIconText = ({ value, array }) => {
  if (!array) return null
  const item = array.find((item) => item.value === value)
  if (!item)
    return (
      <div className={`flex items-center justify-center min-w-4 w-4 h-4`}>
        <FontAwesomeIcon
          className="w-3 h-3 text-gray-400 min-w-3"
          icon={faQuestion}
        />
      </div>
    )

  return (
    <div className="flex items-center gap-x-1 leading-[14px]">
      <Tooltip title="Новичок">
        <div className={`flex items-center justify-center min-w-4 w-4 h-4`}>
          <FontAwesomeIcon
            className={'min-w-3 w-3 h-3 text-' + item.color}
            icon={item.icon}
          />
        </div>
      </Tooltip>
      <TextLinesLimiter lines={1}>{item.name}</TextLinesLimiter>
    </div>
  )
}

export default ValueIconText
