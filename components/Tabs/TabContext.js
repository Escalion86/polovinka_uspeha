import { TabContext as MuiTabContext } from '@mui/lab'
import { Tab } from '@mui/material'
import { useState } from 'react'
import TabList from './TabList'

const TabContext = ({ value, children }) => {
  const [tab, setTab] = useState(value)
  const tabs = []
  children.forEach((child, index) => {
    // console.log('child ' + index, child)
    // console.log('child?.props?.tabName', child?.props?.tabName)
    // console.log('child.type.name', child.type.name)
    if (child?.props?.tabName) {
      const tabName = child.props.tabName
      const tabAddToLabel = child.props.tabAddToLabel
      tabs.push(
        <Tab
          key={tabName}
          label={
            <div className="flex flex-col">
              <div>{tabName}</div>
              {tabAddToLabel && <div>{tabAddToLabel}</div>}
            </div>
          }
          value={tabName}
        />
      )
    }
  })

  // console.log('tabNames', tabNames)

  return (
    <MuiTabContext value={tab}>
      <TabList
        onChange={setTab}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        className="w-full max-w-[100%]"
      >
        {tabs}
      </TabList>
      {children}
    </MuiTabContext>
  )
}

export default TabContext
