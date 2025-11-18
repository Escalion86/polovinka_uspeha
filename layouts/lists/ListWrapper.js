import cn from 'classnames'
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList } from 'react-window'
import { useEffect, useRef } from 'react'

const ListWrapper = ({
  itemCount,
  itemSize,
  children,
  className,
  itemData,
  itemKey,
  debugName,
}) => {
  const safeItemCount = itemCount ?? 0
  const debugEnabled =
    debugName && process.env.NEXT_PUBLIC_DEBUG_NEWSLETTERS === 'true'
  const renderCountRef = useRef(0)

  useEffect(() => {
    if (!debugEnabled) return
    renderCountRef.current += 1
    console.debug(`[${debugName}] ListWrapper render`, {
      time: new Date().toISOString(),
      renderCount: renderCountRef.current,
      itemCount: safeItemCount,
      itemSize,
    })
  }, [debugEnabled, itemCount, itemSize, safeItemCount])
  return (
    <div className={cn('flex-1 w-full h-full', className)}>
        <AutoSizer>
          {({ height, width }) => {
            if (debugEnabled) {
              console.debug(`[${debugName}] AutoSizer`, {
                time: new Date().toISOString(),
                height,
                width,
              })
            }
            return (
              <FixedSizeList
                height={height}
                itemCount={safeItemCount}
                itemSize={itemSize}
                width={width}
                itemData={itemData}
                itemKey={itemKey}
                className="overflow-x-hidden overflow-y-scroll"
              >
                {children}
              </FixedSizeList>
            )
          }}
        </AutoSizer>
    </div>
  )
}

export default ListWrapper
