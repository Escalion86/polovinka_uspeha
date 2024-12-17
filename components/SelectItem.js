import { faMoneyBill } from '@fortawesome/free-solid-svg-icons/faMoneyBill'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons/faPencilAlt'
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus'
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes'
import { faUsers } from '@fortawesome/free-solid-svg-icons/faUsers'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import filterWithRules from '@helpers/filterWithRules'
import { modalsFuncAtom } from '@state/atoms'
import directionsAtom from '@state/atoms/directionsAtom'
import eventsAtom from '@state/atoms/eventsAtom'
import servicesAtom from '@state/atoms/servicesAtom'
import usersAtom from '@state/atoms/usersAtom'
import cn from 'classnames'
import { useRecoilValue } from 'recoil'
import InputWrapper from './InputWrapper'
import {
  DirectionItem,
  EventItem,
  PaymentItem,
  ServiceItem,
  UserItem,
} from './ItemCards'
import Tooltip from './Tooltip'
import asyncPaymentsAtom from '@state/async/asyncPaymentsAtom'
import userSelector from '@state/selectors/userSelector'

export const SelectItem = ({
  items,
  itemComponent,
  selectedId = null,
  className = '',
  onClick = null,
  itemHeight,
  itemWidth,
  componentHeight,
  active,
}) => {
  const selectedItem = selectedId
    ? items.find((item) => item._id === selectedId)
    : null

  const Item = itemComponent

  return (
    <div
      className={cn(
        className,
        onClick ? 'cursor-pointer' : 'cursor-not-allowed',
        'relative flex justify-center items-center',
        active ? 'bg-green-200' : 'bg-gray-100'
      )}
      style={{ height: itemHeight, width: itemWidth }}
      onClick={onClick ? () => onClick(selectedItem) : null}
    >
      {selectedItem ? (
        <Item item={selectedItem} />
      ) : (
        <div
          className="flex items-center justify-center text-sm text-gray-800"
          style={{ height: componentHeight }}
        >
          Не выбрано
        </div>
      )}
    </div>
  )
}

const ItemButton = ({
  onClick,
  icon,
  iconClassName,
  tooltip,
  text,
  textClassName,
  thin,
}) => (
  <div className="flex items-center justify-center bg-gray-100 border-l border-gray-700">
    <Tooltip title={tooltip}>
      <button
        onClick={onClick}
        className={cn(
          'flex items-center justify-center gap-x-0.5 h-full rounded-r shadow-sm group whitespace-nowrap font-futuraDemi',
          thin ? 'px-1' : 'px-1.5'
        )}
      >
        {icon ? (
          <FontAwesomeIcon
            className={cn(
              'w-4 h-4 duration-300 group-hover:scale-125',
              iconClassName
            )}
            icon={icon}
          />
        ) : null}
        {text ? <div className={cn(textClassName)}>{text}</div> : null}
      </button>
    </Tooltip>
  </div>
)

const SelectItemContainer = ({
  required,
  label = '',
  onClickClearButton = null,
  onCreateNew,
  onEdit,
  bordered = true,
  children,
  error,
  buttons,
  selectedId,
  labelClassName,
  className,
  wrapperClassName,
  rounded = false,
  active,
}) => {
  const Container = ({ children }) => {
    if (label)
      return (
        <InputWrapper
          label={label}
          labelClassName={labelClassName}
          wrapperClassName={cn('flex-1 ', wrapperClassName)}
          className={className}
          required={required}
          value={selectedId}
          error={error}
        >
          <div
            className={cn(
              'flex flex-1',
              rounded ? 'rounded-sm overflow-hidden' : '',
              bordered ? 'border border-gray-700' : ''
            )}
          >
            {children}
          </div>
        </InputWrapper>
      )

    return (
      <div
        className={cn(
          'flex flex-1',
          rounded ? 'rounded-sm overflow-hidden' : '',
          error
            ? 'border border-red-500'
            : bordered
              ? 'border border-gray-700'
              : '',
          className
        )}
      >
        {children}
      </div>
    )
  }

  return (
    <Container>
      {children}
      {buttons &&
        buttons
          .filter((item) => item)
          .map((item, index) => {
            const {
              onClick,
              icon,
              iconClassName,
              tooltip,
              text,
              textClassName,
              thin,
            } = item(selectedId)
            return (
              <ItemButton
                key={'button' + selectedId + index}
                tooltip={tooltip}
                onClick={onClick}
                icon={icon}
                iconClassName={iconClassName}
                text={text}
                textClassName={textClassName}
                thin={thin}
              />
            )
          })}
      {onEdit && (
        <ItemButton
          tooltip="Редактировать"
          onClick={onEdit}
          icon={faPencilAlt}
          iconClassName="text-primary"
        />
      )}
      {onCreateNew && (
        <ItemButton
          tooltip="Создать новый"
          onClick={onCreateNew}
          icon={faPlus}
          iconClassName="text-primary"
        />
      )}
      {onClickClearButton && (
        <ItemButton
          tooltip="Удалить из списка"
          onClick={onClickClearButton}
          icon={faTimes}
          iconClassName="text-red-700"
        />
      )}
    </Container>
  )
}

export const SelectUser = ({
  onChange,
  onDelete,
  selectedId = null,
  exceptedIds = [],
  required = false,
  clearButton = null,
  label,
  filter,
  error,
  bordered = true,
  modalTitle,
  buttons,
  rounded = true,
  readOnly,
  active,
  itemChildren,
  nameFieldWrapperClassName,
}) => {
  const users = useRecoilValue(usersAtom)
  const modalsFunc = useRecoilValue(modalsFuncAtom)
  const selectedUser = useRecoilValue(userSelector(selectedId))

  const filteredUsers = filterWithRules(users, filter)

  const onClickClearButton =
    selectedId && clearButton
      ? onDelete
        ? () => onDelete()
        : () => onChange(null)
      : null

  return (
    <SelectItemContainer
      required={required}
      label={label}
      onClickClearButton={onClickClearButton}
      bordered={bordered}
      error={error}
      rounded={rounded}
      buttons={buttons}
      selectedId={selectedId}
    >
      <SelectItem
        items={filteredUsers}
        itemComponent={
          itemChildren
            ? (props) => (
                <UserItem
                  children={itemChildren}
                  nameFieldWrapperClassName={nameFieldWrapperClassName}
                  {...props}
                />
              )
            : UserItem
        }
        componentHeight={40}
        selectedId={selectedId}
        className={cn(
          'flex-1',
          selectedId && clearButton ? 'rounded-l' : 'rounded-sm'
        )}
        active={active}
        exceptedIds={exceptedIds}
        onClick={
          !readOnly
            ? onChange
              ? () =>
                  modalsFunc.selectUsers(
                    [selectedUser],
                    filter,
                    (data) => onChange(data[0]._id),
                    [],
                    null,
                    1,
                    false,
                    modalTitle
                  )
              : (user) => modalsFunc.user.view(user._id)
            : null
        }
        onNoChoose={onDelete}
      />
    </SelectItemContainer>
  )
}

export const SelectService = ({
  onChange,
  onDelete,
  selectedId = null,
  exceptedIds = [],
  required = false,
  clearButton = null,
  label,
  filter,
  error,
  bordered = true,
  modalTitle,
  buttons,
  rounded = true,
  readOnly,
}) => {
  const services = useRecoilValue(servicesAtom)
  const modalsFunc = useRecoilValue(modalsFuncAtom)

  const filteredServices = filterWithRules(services, filter)

  const onClickClearButton =
    selectedId && clearButton
      ? onDelete
        ? () => onDelete()
        : () => onChange(null)
      : null

  return (
    <SelectItemContainer
      required={required}
      label={label}
      onClickClearButton={onClickClearButton}
      bordered={bordered}
      error={error}
      rounded={rounded}
      buttons={buttons}
      selectedId={selectedId}
    >
      <SelectItem
        items={filteredServices}
        itemComponent={ServiceItem}
        componentHeight={40}
        selectedId={selectedId}
        className={cn(
          'flex-1',
          selectedId && clearButton ? 'rounded-l' : 'rounded-sm'
        )}
        exceptedIds={exceptedIds}
        onClick={
          !readOnly
            ? onChange
              ? () =>
                  modalsFunc.selectServices(
                    [selectedId],
                    filter,
                    (data) => onChange(data[0]),
                    [],
                    null,
                    1,
                    false,
                    modalTitle
                  )
              : (user) => modalsFunc.service.view(user._id)
            : null
        }
        onNoChoose={onDelete}
      />
    </SelectItemContainer>
  )
}

export const SelectEvent = ({
  onChange,
  onDelete,
  selectedId = null,
  exceptedIds = [],
  required = false,
  clearButton = null,
  error,
  bordered = true,
  className,
  label,
  filter,
  modalTitle,
  rounded = true,
  readOnly,
  showPaymentsButton = false,
  showEventUsersButton = false,
  showEditButton = false,
}) => {
  const modalsFunc = useRecoilValue(modalsFuncAtom)
  const events = useRecoilValue(eventsAtom)
  return (
    <SelectItemContainer
      required={required}
      label={label}
      onClickClearButton={
        selectedId && clearButton
          ? onDelete
            ? () => onDelete()
            : () => onChange(null)
          : null
      }
      error={error}
      bordered={bordered}
      rounded={rounded}
      selectedId={selectedId}
      className={className}
    >
      <SelectItem
        items={events}
        itemComponent={EventItem}
        componentHeight={40}
        // onChange={onChange}
        selectedId={selectedId}
        className={cn(
          'flex-1',
          selectedId && clearButton ? 'rounded-l' : 'rounded-sm'
        )}
        onClick={
          !readOnly
            ? onChange
              ? () =>
                  modalsFunc.selectEvents(
                    [selectedId],
                    filter,
                    (data) => onChange(data[0]),
                    [],
                    null,
                    1,
                    false,
                    modalTitle
                  )
              : (event) => modalsFunc.event.view(event._id)
            : null
        }
        exceptedIds={exceptedIds}
      />
      {selectedId && showEditButton && (
        <div
          className="flex items-center justify-center text-orange-500 bg-gray-100 border-l border-gray-700 cursor-pointer w-7 group"
          onClick={() => {
            modalsFunc.event.edit(selectedId)
          }}
        >
          <FontAwesomeIcon
            icon={faPencilAlt}
            className={cn('w-4 h-4 duration-300 group-hover:scale-125')}
          />
        </div>
      )}
      {selectedId && showEventUsersButton && (
        <div
          className="flex items-center justify-center text-green-500 bg-gray-100 border-l border-gray-700 cursor-pointer w-7 group"
          onClick={() => {
            modalsFunc.event.users(selectedId)
          }}
        >
          <FontAwesomeIcon
            icon={faUsers}
            className={cn('w-4 h-4 duration-300 group-hover:scale-125')}
          />
        </div>
      )}
      {selectedId && showPaymentsButton && (
        <div
          className="flex items-center justify-center bg-gray-100 border-l border-gray-700 cursor-pointer w-7 group text-amber-500"
          onClick={() => {
            modalsFunc.event.payments(selectedId)
          }}
        >
          <FontAwesomeIcon
            icon={faMoneyBill}
            className={cn('w-4 h-4 duration-300 group-hover:scale-125')}
          />
        </div>
      )}
    </SelectItemContainer>
  )
}

export const SelectDirection = ({
  onChange,
  onDelete,
  selectedId = null,
  exceptedIds = [],
  required = false,
  clearButton = null,
  error,
  bordered = true,
  modalTitle,
  rounded = true,
}) => {
  const modalsFunc = useRecoilValue(modalsFuncAtom)
  const directions = useRecoilValue(directionsAtom)

  return (
    <SelectItemContainer
      required={required}
      label="Направление"
      onClickClearButton={
        selectedId && clearButton
          ? onDelete
            ? () => onDelete()
            : () => onChange(null)
          : null
      }
      error={error}
      bordered={bordered}
      rounded={rounded}
      selectedId={selectedId}
    >
      <SelectItem
        items={directions}
        itemComponent={DirectionItem}
        componentHeight={50}
        selectedId={selectedId}
        className={cn(
          'flex-1',
          selectedId && clearButton ? 'rounded-l' : 'rounded-sm'
        )}
        onClick={
          onChange
            ? () =>
                modalsFunc.selectDirections(
                  [selectedId],
                  [],
                  (data) => onChange(data[0]),
                  [],
                  null,
                  1,
                  false,
                  modalTitle
                )
            : (direction) => modalsFunc.direction.view(direction._id)
        }
        exceptedIds={exceptedIds}
      />
    </SelectItemContainer>
  )
}

export const SelectPayment = ({
  onChange,
  onDelete,
  label = 'Транзакция',
  selectedId = null,
  exceptedIds = [],
  required = false,
  clearButton = null,
  error,
  bordered = true,
  rounded = true,
  readOnly,
  showUser,
  showEvent,
  showSectorIcon,
}) => {
  const modalsFunc = useRecoilValue(modalsFuncAtom)
  const payments = useRecoilValue(asyncPaymentsAtom)

  return (
    <SelectItemContainer
      required={required}
      label={label}
      onClickClearButton={
        selectedId && clearButton
          ? onDelete
            ? () => onDelete()
            : () => onChange(null)
          : null
      }
      error={error}
      bordered={bordered}
      rounded={rounded}
      selectedId={selectedId}
    >
      <SelectItem
        items={payments}
        itemComponent={(props) => (
          <PaymentItem
            {...props}
            showUser={showUser}
            showEvent={showEvent}
            showSectorIcon={showSectorIcon}
          />
        )}
        componentHeight={50}
        selectedId={selectedId}
        className={cn(
          'flex-1',
          selectedId && clearButton ? ' rounded-l' : ' rounded-sm'
        )}
        onClick={
          !readOnly ? (payment) => modalsFunc.payment.edit(payment._id) : null
        }
        exceptedIds={exceptedIds}
      />
    </SelectItemContainer>
  )
}
