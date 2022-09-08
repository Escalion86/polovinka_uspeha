import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { SelectItem, SelectUser } from './SelectItem'
import cn from 'classnames'
import { modalsFuncAtom } from '@state/atoms'
import { useRecoilValue } from 'recoil'

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
  readOnly,
}) => {
  const onChangeItem = (value) => onChange(value, index)

  return (
    <div
      className={cn('flex', index === 0 ? null : 'border-t border-gray-700')}
    >
      <SelectItemComponent
        onChange={readOnly ? null : (item) => onChangeItem(item._id)}
        selectedId={selectedId}
        exceptedIds={selectedItemsIds}
        clearButton={!readOnly && dropDownList && onDelete}
        onDelete={
          !readOnly && onDelete ? (item) => onDelete(index, item) : null
        }
        onCreateNew={!readOnly && onCreateNew ? () => onCreateNew(index) : null}
        onEdit={!readOnly && onEdit ? (item) => onEdit(index, item) : null}
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
  filter,
  exceptedIds,
  modalFuncKey,
  maxItems,
  readOnly,
}) => {
  const modalsFunc = useRecoilValue(modalsFuncAtom)

  if (!itemsId) itemsId = []

  const onChangeItemRow = (id, index) => {
    if (!onChange) return
    const tempItemsId = [...itemsId]
    tempItemsId[index] = id
    onChange(tempItemsId)
  }

  const addRow = () => {
    if (modalFuncKey)
      modalsFunc[modalFuncKey](itemsId, filter, onChange, exceptedIds, maxItems)
    else {
      if (!onChange) return
      const tempItemsId = [...itemsId]
      tempItemsId.push('?')
      onChange(tempItemsId)
    }
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
        readOnly={readOnly}
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
      {itemRows.length === 0 && readOnly ? (
        <div>{'Нет записей'}</div>
      ) : (
        <div
          name="itemsIds"
          className={cn(
            'flex flex-col flex-wrap-reverse bg-gray-200 border rounded overflow-hidden',
            required && (itemsId.length === 0 || itemsId[0] === '?')
              ? 'border-red-700'
              : 'border-gray-700'
          )}
        >
          {itemRows.map((Item, index) => (
            <Item key={'ItemRow' + index} index={index} />
          ))}
          {!readOnly && (
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
          )}
        </div>
      )}
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
  readOnly,
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
      exceptedIds={exceptedIds}
      maxItems={maxUsers}
      modalFuncKey="selectUsers"
      readOnly={readOnly}
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
