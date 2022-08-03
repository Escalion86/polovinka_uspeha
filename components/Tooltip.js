import React from 'react'
import { Tooltip as MaterialTooltip } from '@material-tailwind/react'

const Tooltip = ({ children, content }) => (
  <MaterialTooltip
    content={content}
    // placement="bottom"
    animate={{
      mount: {
        scale: 1,
        transition: {
          delay: 1,
        },
      },
      unmount: { scale: 0 },
    }}
  >
    {children}
  </MaterialTooltip>
)

export default Tooltip
