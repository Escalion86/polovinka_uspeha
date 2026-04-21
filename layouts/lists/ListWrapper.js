'use client'

import cn from 'classnames'
import {
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react'
import { List } from 'react-window'

const scrollOffsetsByKey = new Map()

const RowComponent = ({ index, style, data }) => {
  const { itemCount, itemKey, children, itemData } = data
  const baseStyle = {
    ...style,
    zIndex: itemCount - index,
    overflow: 'visible',
  }
  const renderedChild = children({ index, style, data: itemData })
  if (!isValidElement(renderedChild)) return renderedChild

  const mergedStyle = {
    ...baseStyle,
    ...(renderedChild.props?.style ?? {}),
  }

  if (itemKey) {
    const key = itemKey(index, itemData)
    return cloneElement(renderedChild, { key, style: mergedStyle })
  }

  return cloneElement(renderedChild, { style: mergedStyle })
}

const ListWrapper = ({
  itemCount = 0,
  itemSize = 0,
  children,
  wrapperClassName,
  className,
  itemData,
  itemKey,
  maxHeight,
  persistScrollKey,
  onScroll,
}) => {
  const rowProps = useMemo(
    () => ({
      data: {
        itemData,
        itemCount,
        itemKey,
        children,
      },
    }),
    [children, itemCount, itemData, itemKey]
  )

  const listRef = useRef(null)

  const wrapperStyle = maxHeight ? { height: maxHeight, maxHeight } : undefined
  const handleScroll = useCallback(
    (event) => {
      if (persistScrollKey) {
        scrollOffsetsByKey.set(persistScrollKey, event.currentTarget.scrollTop)
      }
      if (typeof onScroll === 'function') onScroll(event)
    },
    [persistScrollKey, onScroll]
  )

  useEffect(() => {
    if (!persistScrollKey) return
    const savedOffset = scrollOffsetsByKey.get(persistScrollKey)
    if (typeof savedOffset !== 'number') return
    const element = listRef.current?.element
    if (element && element.scrollTop !== savedOffset) {
      element.scrollTop = savedOffset
    }
  }, [persistScrollKey, itemCount, itemSize])

  return (
    <div
      className={cn(
        'flex-1 w-full h-full min-h-0 relative z-0 overflow-hidden',
        wrapperClassName
      )}
      style={wrapperStyle}
    >
      <List
        listRef={listRef}
        rowComponent={RowComponent}
        rowCount={itemCount}
        rowHeight={itemSize}
        rowProps={rowProps}
        style={{ height: '100%' }}
        className={cn('overflow-x-hidden overflow-y-scroll', className)}
        onScroll={handleScroll}
      />
    </div>
  )
}

export default ListWrapper
