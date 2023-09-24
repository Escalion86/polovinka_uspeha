import { TabList as MuiTabList } from '@mui/lab'
import cn from 'classnames'

import TabScrollButton from '@mui/material/TabScrollButton'

const TabList = ({
  variant = 'fullWidth',
  className,
  onChange,
  children,
  scrollButtons,
  allowScrollButtonsMobile,
}) => (
  <MuiTabList
    ScrollButtonComponent={TabScrollButton}
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
