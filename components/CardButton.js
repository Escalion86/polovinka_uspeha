import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Tooltip from '@components/Tooltip'
import cn from 'classnames'
import Popover from './Popover'
import { useState } from 'react'
import { Alert, Snackbar } from '@mui/material'
import useSnackbar from '@helpers/useSnackbar'
// import {
//   Popover,
//   PopoverHandler,
//   PopoverContent,
// } from '@material-tailwind/react'
// import { useSnackbar } from 'notistack'

const CardButton = ({ active, icon, onClick, color = 'red', tooltipText }) => (
  <Tooltip
    title={tooltipText}
    // onClose={() => {
    //   const timer = setTimeout(() => {
    //     setClicked(false)
    //     clearTimeout(timer)
    //   }, 200)
    // }}

    // onOpen={() => setOpen(true)}
    // open={open}
    // disableFocusListener
    // disableHoverListener
    // disableTouchListener
    // PopperProps={{
    //   disablePortal: true,
    // }}
  >
    <div
      className={cn(
        `cursor-pointer text-base font-normal duration-300 flex border items-center justify-center w-8 h-8 hover:bg-${color}-600 border-${color}-500 hover:border-${color}-600 hover:text-white`,
        active ? `bg-${color}-500 text-white` : `bg-white text-${color}-500`
      )}
      onClick={(e) => {
        e.stopPropagation()
        onClick && onClick()
      }}
    >
      <FontAwesomeIcon
        icon={icon}
        className="w-6 h-6"
        // onClick={handlePopower}
      />
    </div>
  </Tooltip>
)

export default CardButton
