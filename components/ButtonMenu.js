import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Divider from '@mui/material/Divider'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { useState } from 'react'
import IconToggleButton from './IconToggleButtons/IconToggleButton'
import cn from 'classnames'

const IconButtonMenu = ({
  name,
  items,
  icon,
  onChange,
  dense,
  horizontalPos = 'right',
  disablePadding,
}) => {
  const [anchorEl, setAnchorEl] = useState(null)

  const open = Boolean(anchorEl)
  const closeMenu = () => setAnchorEl(null)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  return (
    <div className="flex items-start justify-end h-10 w-fit">
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={closeMenu}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
          disablePadding,
          dense,
        }}
        transformOrigin={{ horizontal: horizontalPos, vertical: 'top' }}
        anchorOrigin={{ horizontal: horizontalPos, vertical: 'bottom' }}
      >
        {items.map((item, index) => {
          if (!item) return <Divider key={'divider' + index} />
          const { name, value, icon, iconClassNameColor } = item
          return (
            <MenuItem
              key={item.value}
              icon={icon}
              onClick={() => {
                if (onChange) onChange(value)
                closeMenu()
                // setIsMenuOpen(false)
              }}
              className="text-gray-700"
            >
              {icon && (
                <FontAwesomeIcon
                  icon={icon}
                  className={cn('w-5 h-5 mr-2', iconClassNameColor)}
                />
              )}
              {name}
            </MenuItem>
          )
        })}
      </Menu>
      <IconToggleButton
        value="button"
        onClick={handleClick}
        aria-label="ButtonMenu"
      >
        <FontAwesomeIcon icon={icon} className="h-6" />
        {!!name && <div>{name}</div>}
      </IconToggleButton>
    </div>
  )
}

export default IconButtonMenu
