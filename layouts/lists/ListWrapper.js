import React from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'

import { FixedSizeList } from 'react-window'

const ListWrapper = ({ itemCount, itemSize, children }) => {
  return (
    <div className="flex-1 w-full bg-opacity-15 bg-general">
      <AutoSizer>
        {({ height, width }) => (
          <FixedSizeList
            height={height}
            itemCount={itemCount}
            itemSize={itemSize}
            width={width}
          >
            {children}
          </FixedSizeList>
        )}
      </AutoSizer>
    </div>
  )
}

export default ListWrapper
