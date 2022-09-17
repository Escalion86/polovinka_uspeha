import { TabList as MuiTabList } from '@mui/lab'
import cn from 'classnames'

const TabList = ({
  variant = 'fullWidth',
  className,
  onChange,
  children,
  scrollButtons,
  allowScrollButtonsMobile,
}) => (
  <MuiTabList
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
