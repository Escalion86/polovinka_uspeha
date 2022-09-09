import { TabContext as MuiTabContext } from '@mui/lab'
import { Tab } from '@mui/material'
import { useState } from 'react'
import TabList from './TabList'

const TabContext = ({ value, children }) => {
  const [tab, setTab] = useState(value)
  const tabNames = []
  children.forEach((child, index) => {
    // console.log('child ' + index, child)
    // console.log('child.type.name', child.type.name)
    if (child.props?.tabName) {
      tabNames.push(child.props.tabName)
    }
  })

  // console.log('tabNames', tabNames)

  return (
    <MuiTabContext value={tab}>
      <TabList onChange={setTab}>
        {tabNames.map((tabName) => (
          <Tab key={tabName} label={tabName} value={tabName} />
        ))}
      </TabList>
      {children}
    </MuiTabContext>
  )
}

export default TabContext
