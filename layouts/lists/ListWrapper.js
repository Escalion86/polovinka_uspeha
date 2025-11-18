import cn from 'classnames'
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList } from 'react-window'

const ListWrapper = ({
  itemCount,
  itemSize,
  children,
  className,
  itemData,
  itemKey,
}) => {
  return (
    <div className={cn('flex-1 w-full h-full', className)}>
      <AutoSizer>
        {({ height, width }) => (
          <FixedSizeList
            height={height}
            itemCount={itemCount}
            itemSize={itemSize}
            width={width}
            itemData={itemData}
            itemKey={itemKey}
            className="overflow-x-hidden overflow-y-scroll"
          >
            {children}
          </FixedSizeList>
        )}
      </AutoSizer>
    </div>
  )
}

export default ListWrapper
