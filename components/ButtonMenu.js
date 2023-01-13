import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import Divider from '@mui/material/Divider'
import IconToggleButton from './IconToggleButtons/IconToggleButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

const variants = {
  show: {
    scale: 1,
    translateX: 0,
    translateY: 0,
  },
  hide: {
    scale: 0,
    translateX: '50%',
    translateY: '-50%',
  },
}

const Item = ({ name, onClick }) => (
  <div
    onClick={onClick}
    className="hover:bg-general hover:bg-opacity-25 cursor-pointer whitespace-nowrap px-2 py-0.5"
  >
    {name}
  </div>
)

const IconButtonMenu = ({
  name,
  items,
  icon,
  onChange,
  dense,
  horizontalPos = 'right',
  disablePadding,
}) => {
  // const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)

  // const toggleMenuOpen = () => setIsMenuOpen((state) => !state)
  const open = Boolean(anchorEl)
  const closeMenu = () => setAnchorEl(null)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  return (
    <div
      className="flex items-start justify-end h-10"
      // onClick={toggleMenuOpen}
    >
      {/* <div className="relative z-10 w-10 h-10"> */}
      {/* <motion.div
          className={cn(
            'z-0 absolute bg-white flex flex-col top-10 right-0 overflow-hidden duration-300 border border-gray-300 rounded'
            // isUserMenuOpened
            //   ? 'scale-100 h-auto translate-y-0 translate-x-0 w-auto'
            //   : 'w-0 h-0 scale-0 translate-x-[40%] -translate-y-1/2'
          )}
          variants={variants}
          animate={isMenuOpen ? 'show' : 'hide'}
          initial="hide"
          transition={{ duration: 0.2, type: 'tween' }}
        >
          {items.map((item) => {
            if (!item) return <Divider thin light />
            const { name, value } = item
            return (
              <Item
                name={name}
                onClick={() => {
                  if (onChange) onChange(value)
                  // setIsMenuOpen(false)
                }}
              />
            )
          })}
        </motion.div> */}
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
          const { name, value } = item
          return (
            <MenuItem
              key={item.value}
              onClick={() => {
                if (onChange) onChange(value)
                closeMenu()
                // setIsMenuOpen(false)
              }}
            >
              {name}
            </MenuItem>
          )
        })}
      </Menu>
      <IconToggleButton value="button" onClick={handleClick}>
        {/* <div className="w-20">{sortParam.title}</div> */}

        <FontAwesomeIcon icon={icon} className="h-6" />
        {!!name && <div>{name}</div>}
      </IconToggleButton>
      {/* </div> */}
    </div>
  )
}

export default IconButtonMenu
