import { motion } from 'framer-motion'
import { TabPanel as MuiTabPanel } from '@mui/lab'
import cn from 'classnames'

const TabPanel = ({ name, className, children }) => (
  <MuiTabPanel value={name} className="p-0 overflow-y-auto">
    <motion.div
      className={cn('flex flex-col p-2 gap-y-2', className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {children}
    </motion.div>
  </MuiTabPanel>
)

export default TabPanel
