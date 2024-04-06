import { TabPanel as MuiTabPanel } from '@mui/lab'
import cn from 'classnames'
import { m } from 'framer-motion'

const TabPanel = ({ tabName, className, children }) => (
  <MuiTabPanel value={tabName} className="p-0 overflow-y-auto">
    <m.div
      className={cn('py-2', className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {children}
    </m.div>
  </MuiTabPanel>
)

export default TabPanel
