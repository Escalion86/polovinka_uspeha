import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { modalsFuncAtom } from '@state/atoms'
import cn from 'classnames'
import { useRecoilValue } from 'recoil'
import Label from './Label'
import {
  SelectEvent,
  SelectItem,
  SelectPayment,
  SelectUser,
} from './SelectItem'
import isObject from '@helpers/isObject'

const ItemRow = ({
  onDelete,
  onCreateNew,
  onEdit,
  onClick,
  selectedId,
  index,
  selectedItemsIds,
  SelectItemComponent = SelectItem,
  readOnly,
}) => (
  <div className="flex border-b border-gray-700 last:border-0">
    <SelectItemComponent
      selectedId={selectedId}
      exceptedIds={selectedItemsIds}
      clearButton={!readOnly && onDelete}
      onDelete={!readOnly && onDelete ? (item) => onDelete(index, item) : null}
      onCreateNew={!readOnly && onCreateNew ? () => onCreateNew(index) : null}
      onEdit={!readOnly && onEdit ? (item) => onEdit(index, item) : null}
      onClick={onClick ? (item) => onClick(index, item) : null}
    />
  </div>
)

export const SelectItemList = ({
  itemsId = [],
  SelectItemComponent,
  label,
  onChange = null,
  onCreateNew = null,
  onEdit = null,
  onDelete = null,
  onClick = null,
  required = false,
  showCounter,
  counterClassName,
  counterPostfix,
  canAddItem = true,
  exceptedIds,
  acceptedIds,
  modalFuncKey,
  maxItems,
  readOnly,
  labelClassName,
  filter,
  modalTitle,
  canSelectNone,
  className,
}) => {
  const modalsFunc = useRecoilValue(modalsFuncAtom)

  if (!itemsId) itemsId = []

  const addRow = () => {
    if (modalFuncKey)
      modalsFunc[modalFuncKey](
        itemsId,
        filter,
        onChange,
        exceptedIds,
        acceptedIds,
        maxItems,
        canSelectNone,
        modalTitle
      )
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
        readOnly={readOnly}
      />
    ))
  )

  const addButtonIsActive = canAddItem && !itemsId.includes('?')

  return (
    <div className={className}>
      <div className="flex items-center justify-between">
        {label && (
          <Label
            text={label}
            className={labelClassName}
            required={required}
            contentWidth
          />
        )}
        {showCounter && (
          <div className="flex gap-x-1">
            <span>Кол-во:</span>
            <span className={counterClassName}>{itemRows.length}</span>
            {counterPostfix ? <span>{counterPostfix}</span> : null}
          </div>
        )}
      </div>
      {itemRows.length === 0 && readOnly ? (
        <div className="italic">{'Нет записей'}</div>
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
              onClick={addButtonIsActive ? addRow : null}
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
                    (addButtonIsActive ? 'text-gray-700' : 'text-disabled')
                  }
                  icon={faPlus}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export const SelectUserList = ({
  usersId = null,
  onChange = null,
  onDelete,
  required = false,
  label,
  filter,
  showCounter,
  counterClassName,
  maxUsers = null,
  canAddItem = true,
  exceptedIds,
  acceptedIds,
  buttons,
  readOnly,
  labelClassName,
  modalTitle,
  canSelectNone = true,
  className,
  activeIds,
  itemChildren,
  nameFieldWrapperClassName,
}) => {
  return (
    <SelectItemList
      itemsId={usersId}
      label={label}
      modalTitle={modalTitle}
      onChange={onChange}
      onDelete={onDelete}
      SelectItemComponent={(props) =>
        SelectUser({
          ...props,
          bordered: false,
          filter,
          exceptedIds,
          buttons: buttons,
          rounded: false,
          active: isObject(activeIds)
            ? activeIds.includes(props.selectedId)
            : false,
          itemChildren,
          nameFieldWrapperClassName,
        })
      }
      required={required}
      filter={filter}
      showCounter={showCounter ?? true}
      counterClassName={counterClassName}
      counterPostfix={
        (typeof maxUsers === 'number' ? ' / ' + maxUsers + ' ' : '') + 'чел.'
      }
      canAddItem={canAddItem}
      exceptedIds={exceptedIds}
      acceptedIds={acceptedIds}
      maxItems={maxUsers}
      modalFuncKey="selectUsers"
      readOnly={readOnly}
      labelClassName={labelClassName}
      canSelectNone={canSelectNone}
      className={className}
    />
  )
}

export const SelectEventList = ({
  eventsId = null,
  onChange = null,
  onDelete,
  required = false,
  label,
  filter,
  showCounter = false,
  canAddItem = false,
  exceptedIds,
  buttons,
  readOnly,
  labelClassName,
  modalTitle,
  canSelectNone = true,
  className,
}) => {
  return (
    <SelectItemList
      itemsId={eventsId}
      label={label}
      modalTitle={modalTitle}
      onChange={onChange}
      onDelete={onDelete}
      SelectItemComponent={(props) =>
        SelectEvent({
          ...props,
          bordered: false,
          filter,
          exceptedIds,
          buttons,
          rounded: false,
        })
      }
      required={required}
      filter={filter}
      showCounter={showCounter}
      canAddItem={canAddItem}
      exceptedIds={exceptedIds}
      modalFuncKey="selectEvents"
      readOnly={readOnly}
      labelClassName={labelClassName}
      canSelectNone={canSelectNone}
      className={className}
    />
  )
}

export const SelectPaymentList = ({
  paymentsId = null,
  onChange = null,
  onDelete,
  required = false,
  label,
  filter,
  showCounter = false,
  canAddItem = false,
  exceptedIds,
  buttons,
  readOnly,
  labelClassName,
  modalTitle,
  canSelectNone = true,
  className,
  showUser,
  showEvent,
  showSectorIcon,
}) => {
  return (
    <SelectItemList
      itemsId={paymentsId}
      label={label}
      modalTitle={modalTitle}
      onChange={onChange}
      onDelete={onDelete}
      SelectItemComponent={(props) =>
        SelectPayment({
          ...props,
          bordered: false,
          filter,
          exceptedIds,
          label: null,
          buttons,
          rounded: false,
          showUser,
          showEvent,
          showSectorIcon,
        })
      }
      required={required}
      filter={filter}
      showCounter={showCounter}
      canAddItem={canAddItem}
      exceptedIds={exceptedIds}
      modalFuncKey="selectPayments"
      readOnly={readOnly}
      labelClassName={labelClassName}
      canSelectNone={canSelectNone}
      className={className}
    />
  )
}
