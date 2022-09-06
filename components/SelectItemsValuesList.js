import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'
import { SelectItem } from './SelectItem'
import cn from 'classnames'

const ItemRow = ({
  items,
  onChange,
  onDelete,
  selectedId,
  count = undefined,
  index,
  selectedItemsIds,
}) => {
  const onChangeCount = (e) =>
    onChange(selectedId, Number(e.target.value), index)
  // const onChangeItem = (e) => onChange(e.target.value, count, index)
  const onChangeItem = (value) =>
    count ? onChange(value, count, index) : onChange(value, index)
  const incCount = () => onChange(selectedId, count + 1, index)

  const decCount = () => onChange(selectedId, count - 1, index)

  return (
    <div className="flex border-b border-gray-700">
      <SelectItem
        items={items}
        className={'flex-1' + (index === 0 ? ' rounded-tl-lg' : '')}
        onChange={(item) => onChangeItem(item._id)}
        selectedId={selectedId}
        exceptedIds={selectedItemsIds}
      />
      {count !== undefined && (
        <div className="flex items-center justify-between border-l border-gray-700">
          <div
            className={
              'flex items-center justify-center h-full px-1 group cursor-pointer'
              // (count > 0 ? 'cursor-pointer' : 'cursor-not-allowed')
            }
            onClick={count > 1 ? decCount : () => onDelete(index)}
          >
            <FontAwesomeIcon
              className={
                count > 1
                  ? 'text-gray-700 transform group-hover:hover:scale-125 duration-200 '
                  : // : 'text-gray-400'
                    'text-red-700'
              }
              icon={count > 1 ? faMinus : faTrash}
              size="sm"
            />
          </div>
          <input
            className="w-10 text-sm text-center bg-gray-200 border-l border-r border-gray-700 outline-none"
            type="text"
            value={parseInt(count)}
            onChange={onChangeCount}
            onKeyPress={(e) => {
              e = e || window.event
              var charCode = typeof e.which == 'undefined' ? e.keyCode : e.which
              if (!(charCode >= 48 && charCode <= 57)) {
                e?.preventDefault()
              }
            }}
          />
          <div
            className="flex items-center justify-center h-full px-1 cursor-pointer group"
            onClick={incCount}
          >
            <FontAwesomeIcon
              className="text-gray-700 duration-200 transform group-hover:hover:scale-125"
              icon={faPlus}
              size="sm"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export const SelectItemsList = ({
  items = [],
  itemsIdCount = null,
  itemsId = null,
  title = '',
  onChange = () => {},
  required = false,
}) => {
  const itemRows = []

  let selectedItemsIds = []
  if (itemsIdCount) {
    selectedItemsIds = Object.keys(itemsIdCount)
    for (const [id, count] of Object.entries(itemsIdCount)) {
      itemRows.push(({ index }) => (
        <ItemRow
          items={items}
          onChange={onChangeItemRow}
          onDelete={deleteRow}
          selectedId={id}
          count={count}
          index={index}
          selectedItemsIds={selectedItemsIds}
        />
      ))
    }
  } else if (itemsId) {
    selectedItemsIds = itemsId
    itemsId.forEach((itemId) =>
      itemRows.push(({ index }) => (
        <ItemRow
          items={items}
          onChange={onChangeItemRow}
          onDelete={deleteRow}
          selectedId={itemId}
          index={index}
          selectedItemsIds={itemsId}
        />
      ))
    )
  }

  const onChangeItemRow = (id, count, index) => {
    if (itemsIdCount) {
      const tempItemsIdCount = {}
      let i = 0
      for (const [id_old, count_old] of Object.entries(itemsIdCount)) {
        if (i === index) tempItemsIdCount[id] = count
        else tempItemsIdCount[id_old] = count_old
        i++
      }
      onChange(tempItemsIdCount)
    }
    // const newProductsIdCount = productsIdCount.map((item, index) => {
    //   if (index === e.index) return { id: e.id, count: e.count }
    //   return item
    // })
    // onChange(newProductsIdCount)
  }

  const addRow = () => {
    if (itemsIdCount) onChange(Object.assign(itemsIdCount, { ['?']: 1 }))
    else if (itemsId) onChange('?')
  }

  const deleteRow = (index) => {
    if (itemsIdCount) {
      const tempItemsIdCount = {}
      let i = 0
      for (const [id, count] of Object.entries(itemsIdCount)) {
        if (i !== index) tempItemsIdCount[id] = count
        i++
      }
      onChange(tempItemsIdCount)
    } else if (itemsId) {
      const tempItemsId = [...itemsId]
      tempItemsId.splice(index, 1)
      onChange(tempItemsId)
    }
  }

  const addButtonIsActive = itemsIdCount ? !('?' in itemsIdCount) : false

  return (
    <div className="flex flex-col">
      <label htmlFor="itemsIds">
        {title}
        {required && <span className="text-red-700">*</span>}
      </label>
      <div
        name="itemsIds"
        className={cn(
          'flex flex-col flex-wrap-reverse bg-gray-200 border rounded-lg',
          required &&
            required !== 'star' &&
            (selectedItemsIds.length === 0 || selectedItemsIds[0] === '?')
            ? 'border-red-700'
            : 'border-gray-700'
        )}
      >
        {itemRows.map((Item, index) => (
          <Item key={'ItemRow' + index} index={index} />
        ))}
        {itemsIdCount && (
          <div
            onClick={addButtonIsActive ? addRow : null}
            className={cn(
              'group flex items-center justify-center h-6 bg-white rounded-lg',
              { 'cursor-pointer': addButtonIsActive }
            )}
          >
            <div
              className={cn(
                'flex items-center justify-center flex-1 transparent',
                { 'duration-200 group-hover:scale-125': addButtonIsActive }
              )}
            >
              <FontAwesomeIcon
                className={
                  addButtonIsActive ? 'text-gray-700' : 'text-gray-400'
                }
                icon={faPlus}
                size="1x"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// export const SelectProductsList = ({
//   productsIdCount = null,
//   onChange = () => {},
//   required = false,
//   readOnly = false,
//   title = 'Список товаров',
//   callbackArray = false,
// }) => {
//   const { products } = useSelector((state) => state)
//   return (
//     <SelectItemsList
//       items={products}
//       itemsIdCount={productsIdCount}
//       title={title}
//       onChange={(itemsIdCount) => {
//         if (callbackArray) {
//           const tempItemsIdCount = []
//           for (const [id, count] of Object.entries(itemsIdCount)) {
//             tempItemsIdCount.push({
//               product:
//                 id === '?'
//                   ? null
//                   : products.find((product) => product._id === id),
//               count,
//             })
//           }
//           onChange(tempItemsIdCount)
//         } else onChange(itemsIdCount)
//       }}
//       required={required}
//       readOnly={readOnly}
//     />
//   )
// }

// export const SelectSetsList = ({
//   setsIdCount = null,
//   onChange = () => {},
//   required = false,
//   readOnly = false,
//   title = 'Список наборов',
//   callbackArray = false,
// }) => {
//   const { products, sets } = useSelector((state) => state)
//   return (
//     <SelectItemsList
//       items={sets}
//       subItems={products}
//       subItemsIdCountKey="productsIdCount"
//       itemsIdCount={setsIdCount}
//       title={title}
//       onChange={(itemsIdCount) => {
//         if (callbackArray) {
//           const tempItemsIdCount = []
//           for (const [id, count] of Object.entries(itemsIdCount)) {
//             tempItemsIdCount.push({
//               set: id === '?' ? null : sets.find((set) => set._id === id),
//               count,
//             })
//           }
//           onChange(tempItemsIdCount)
//         } else onChange(itemsIdCount)
//       }}
//       required={required}
//       readOnly={readOnly}
//     />
//   )
// }
