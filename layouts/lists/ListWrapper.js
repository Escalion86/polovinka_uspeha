import cn from 'classnames'
import React from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'

import { FixedSizeList } from 'react-window'

const ListWrapper = ({ itemCount, itemSize, children, className }) => {
  return (
    <div className={cn('flex-1 w-full h-full', className)}>
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
