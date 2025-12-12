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
}) => {
  const rowProps = useMemo(
    () => ({
      data: itemData,
    }),
    [itemData]
  )

  const Row = useCallback(
    ({ index, style, data }) => {
      const renderedChild = children({ index, style, data })
      if (itemKey && isValidElement(renderedChild)) {
        const key = itemKey(index, data)
        return renderedChild.key === key
          ? renderedChild
          : cloneElement(renderedChild, { key })
      }
      return renderedChild
    },
    [children, itemKey]
  )

  return (
    <div className={cn('flex-1 w-full h-full min-h-0', className)}>
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
