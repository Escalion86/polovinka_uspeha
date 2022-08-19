import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { SelectItem, SelectUser } from './SelectItem'
import cn from 'classnames'

const ItemRow = ({
  onChange,
  onDelete,
  onCreateNew,
  onEdit,
  onClick,
  selectedId,
  index,
  selectedItemsIds,
  SelectItemComponent = SelectItem,
  dropDownList,
}) => {
  const onChangeItem = (value) => onChange(value, index)

  return (
    <div className="flex border-b border-gray-700">
      <SelectItemComponent
        onChange={(item) => onChangeItem(item._id)}
        selectedId={selectedId}
        exceptedIds={selectedItemsIds}
        clearButton={dropDownList && onDelete}
        onDelete={onDelete ? (item) => onDelete(index, item) : null}
        onCreateNew={onCreateNew ? () => onCreateNew(index) : null}
        onEdit={onEdit ? (item) => onEdit(index, item) : null}
        onClick={onClick ? (item) => onClick(index, item) : null}
        dropDownList={dropDownList}
      />
    </div>
  )
}

export const SelectItemList = ({
  itemsId = [],
  SelectItemComponent,
  title = '',
  onChange = null,
  onCreateNew = null,
  onEdit = null,
  onDelete = null,
  onClick = null,
  required = false,
  dropDownList = true,
  showCounter,
  counterPostfix,
  canAddItem = true,
}) => {
  if (!itemsId) itemsId = []

  const onChangeItemRow = (id, index) => {
    if (!onChange) return
    const tempItemsId = [...itemsId]
    tempItemsId[index] = id
    onChange(tempItemsId)
  }

  const addRow = () => {
    if (!onChange) return
    const tempItemsId = [...itemsId]
    tempItemsId.push('?')
    onChange(tempItemsId)
  }

  const deleteRow = (index) => {
    if (!onChange) return
    const tempItemsId = [...itemsId]
    tempItemsId.splice(index, 1)
    onChange(tempItemsId)
  }

  const itemRows = []

  itemsId.forEach((itemId) =>
    itemRows.push(({ index }) => (
      <ItemRow
        onChange={onChangeItemRow}
        onDelete={(index, item) => {
          if (onDelete) onDelete(item, () => deleteRow(index))
          else deleteRow(index)
        }}
        onCreateNew={onCreateNew}
        onEdit={onEdit}
        onClick={onClick}
        selectedId={itemId}
        index={index}
        selectedItemsIds={itemsId}
        SelectItemComponent={SelectItemComponent}
        dropDownList={dropDownList}
      />
    ))
  )

  const addButtonIsActive = canAddItem && !itemsId.includes('?')

  return (
    <>
      <div className="flex justify-between">
        <label htmlFor="itemsIds">
          {title}
          {required && <span className="text-red-700">*</span>}
        </label>
        {showCounter ? (
          <div className="flex gap-x-1">
            <span>Кол-во:</span>
            <span className="font-bold">{itemRows.length}</span>
            {counterPostfix ? <span>{counterPostfix}</span> : null}
          </div>
        ) : null}
      </div>
      <div
        name="itemsIds"
        className={cn(
          'flex flex-col flex-wrap-reverse bg-gray-200 border rounded',
          required && (itemsId.length === 0 || itemsId[0] === '?')
            ? 'border-red-700'
            : 'border-gray-700'
        )}
      >
        {itemRows.map((Item, index) => (
          <Item key={'ItemRow' + index} index={index} />
        ))}
        <div
          onClick={
            addButtonIsActive ? (dropDownList ? addRow : onCreateNew) : null
          }
          className={cn(
            'group flex items-center justify-center h-6 bg-white',
            itemRows.length > 0 ? 'rounded-b' : 'rounded',
            { 'cursor-pointer': addButtonIsActive }
          )}
        >
          <div
            className={cn('flex items-center justify-center transparent', {
              'duration-200 group-hover:scale-110': addButtonIsActive,
            })}
          >
            <FontAwesomeIcon
              className={
                'h-5 w-5 ' +
                (addButtonIsActive ? 'text-gray-700' : 'text-gray-400')
              }
              icon={faPlus}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export const SelectUserList = ({
  usersId = null,
  onChange = null,
  onDelete,
  required = false,
  title,
  filter,
  showCounter,
  maxUsers = null,
  canAddItem = true,
  exceptedIds,
  buttons,
}) => {
  return (
    <SelectItemList
      itemsId={usersId}
      title={title}
      onChange={onChange}
      onDelete={onDelete}
      SelectItemComponent={(props) =>
        SelectUser({
          ...props,
          bordered: false,
          filter,
          disableDropDownList: true,
          exceptedIds,
          buttons,
        })
      }
      required={required}
      filter={filter}
      showCounter={showCounter ?? true}
      counterPostfix={
        (typeof maxUsers === 'number' ? ' / ' + maxUsers + ' ' : '') + 'чел.'
      }
      canAddItem={canAddItem}
    />
  )
}

// export const SelectPaymentList = ({
//   paymentsId = null,
//   onChange = () => {},
//   onCreateNew = null,
//   onEdit = null,
//   onDelete = null,
//   onClick = null,
//   required = false,
//   readOnly = false,
//   title = 'Транзакции',
//   callbackArray = false,
//   dropDownList = true,
// }) => {
//   const { payments } = useSelector((state) => state)
//   return (
//     <SelectItemList
//       items={payments}
//       itemsId={paymentsId}
//       ItemComponent={PaymentItem}
//       SelectItemComponent={SelectPayment}
//       onCreateNew={onCreateNew}
//       onEdit={onEdit}
//       onDelete={onDelete}
//       onClick={onClick}
//       title={title}
//       onChange={onChange}
//       required={required}
//       readOnly={readOnly}
//       dropDownList={dropDownList}
//     />
//   )
// }
