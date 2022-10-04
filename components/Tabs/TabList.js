import { TabList as MuiTabList } from '@mui/lab'
import cn from 'classnames'

import { TabScrollButton } from '@mui/material'
import { styled } from '@mui/styles'

const MyTabScrollButton = styled(TabScrollButton)({
  '&.Mui-disabled': {
    width: 0,
  },
  overflow: 'hidden',
  transition: 'width 0.5s',
  width: 34,
})

const TabList = ({
  variant = 'fullWidth',
  className,
  onChange,
  children,
  scrollButtons,
  allowScrollButtonsMobile,
}) => (
  <MuiTabList
    ScrollButtonComponent={MyTabScrollButton}
    variant={variant}
    onChange={(e, newValue) => onChange(newValue)}
    className={cn('border-b border-gray-600', className)}
    scrollButtons={scrollButtons}
    allowScrollButtonsMobile={allowScrollButtonsMobile}
  >
    {children}
  </MuiTabList>
)

export default TabList
