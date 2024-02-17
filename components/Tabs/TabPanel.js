import { TabPanel as MuiTabPanel } from '@mui/lab'
import cn from 'classnames'
import { motion } from 'framer-motion'

const TabPanel = ({ tabName, className, children }) => (
  <MuiTabPanel value={tabName} className="p-0 overflow-y-auto">
    <motion.div
      className={cn('py-2', className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {children}
    </motion.div>
  </MuiTabPanel>
)

export default TabPanel
