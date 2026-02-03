'use client'

import cn from 'classnames'
import {
  cloneElement,
  isValidElement,
  useCallback,
  useMemo,
} from 'react'
import { List } from 'react-window'

const ListWrapper = ({
  itemCount = 0,
  itemSize = 0,
  children,
  className,
  itemData,
  itemKey,
  maxHeight,
}) => {
  const rowProps = useMemo(
    () => ({
      data: itemData,
    }),
    [itemData]
  )

  const Row = useCallback(
    ({ index, style, data }) => {
      const baseStyle = {
        ...style,
        zIndex: itemCount - index,
        overflow: 'visible',
      }
      const renderedChild = children({ index, style, data })
      if (!isValidElement(renderedChild)) return renderedChild

      const mergedStyle = {
        ...baseStyle,
        ...(renderedChild.props?.style ?? {}),
      }

      if (itemKey) {
        const key = itemKey(index, data)
        return cloneElement(renderedChild, { key, style: mergedStyle })
      }

      return cloneElement(renderedChild, { style: mergedStyle })
    },
    [children, itemCount, itemKey]
  )

  const wrapperStyle = maxHeight ? { height: maxHeight, maxHeight } : undefined

  return (
    <div
      className={cn(
        'flex-1 w-full h-full min-h-0 relative z-0 overflow-hidden',
        className
      )}
      style={wrapperStyle}
    >
      <List
        rowComponent={Row}
        rowCount={itemCount}
        rowHeight={itemSize}
        rowProps={rowProps}
        style={{ height: '100%' }}
        className="overflow-x-hidden overflow-y-scroll"
      />
    </div>
  )
}

export default ListWrapper
