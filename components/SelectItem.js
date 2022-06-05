// import { useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPencilAlt,
  faPlus,
  faSearch,
  faTimes,
  faTrash,
} from '@fortawesome/free-solid-svg-icons'
import { useEffect, useRef, useState } from 'react'
import { Virtuoso } from 'react-virtuoso'
import {
  UserItem,
  EventItem,
  // ProductItem,
  // SetItem,
  // PersonaItem,
  // PaymentItem,
  // DistrictItem,
} from './ItemCards'

import cn from 'classnames'
import usersAtom from '@state/atoms/usersAtom'
import { useRecoilValue } from 'recoil'
import eventsAtom from '@state/atoms/eventsAtom'
// import useClickOutside from '@helpers/hooks/21-useClickOutside/useClickOutside'

const filteredItems = (
  items = [],
  searchText = '',
  exceptedIds = [],
  rules = []
) =>
  (searchText || exceptedIds?.length || rules?.length
    ? [...items].filter((item) => {
        if (Object.entries(rules).length)
          for (const [key, rule] of Object.entries(rules)) {
            if (rule[0] === '>') {
              if (rule[1] === '=') {
                if (!(item[key] >= parseInt(rule.substr(2)))) return false
              } else if (!(item[key] > parseInt(rule.substr(1)))) return false
            }
            if (rule[0] === '<') {
              if (rule[1] === '=') {
                if (!(item[key] <= parseInt(rule.substr(2)))) return false
              } else if (!(item[key] < parseInt(rule.substr(1)))) return false
            }
            if (rule[0] === '=') {
              if (!(item[key] == parseInt(rule.substr(1)))) return false
            }
          }

        if (searchText[0] === '>') {
          if (searchText[1] === '=')
            return item.price >= parseInt(searchText.substr(2)) * 100
          return item.price > parseInt(searchText.substr(1)) * 100
        }
        if (searchText[0] === '<') {
          if (searchText[1] === '=')
            return item.price <= parseInt(searchText.substr(2)) * 100
          return item.price < parseInt(searchText.substr(1)) * 100
        }
        if (searchText[0] === '=') {
          return item.price == parseInt(searchText.substr(1)) * 100
        }

        const searchTextLowerCase = searchText.toLowerCase()
        // const itemNameLowerCase = item.name?.toLowerCase()
        return (
          !exceptedIds.includes(item._id) &&
          (item.name?.toString().toLowerCase().includes(searchTextLowerCase) ||
            item.number?.toString().includes(searchTextLowerCase) ||
            item.phone?.toString().includes(searchTextLowerCase) ||
            item.whatsapp?.toString().includes(searchTextLowerCase) ||
            item.viber?.toString().includes(searchTextLowerCase) ||
            item.telegram?.toString().includes(searchTextLowerCase) ||
            item.instagram?.toString().includes(searchTextLowerCase) ||
            item.vk?.toString().includes(searchTextLowerCase) ||
            item.price?.toString().includes(searchTextLowerCase))
          // ||
          // item.fullPrice?.toString().includes(searchTextLowerCase)
        )
      })
    : [...items]
  ).sort((a, b) => {
    if (a.name < b.name) {
      return -1
    }
    if (a.name > b.name) {
      return 1
    }
    return 0
  })

export const SelectItem = ({
  items,
  itemComponent,
  onChange,
  selectedId = null,
  exceptedIds = [],
  className = '',
  dropDownList = true,
  onClick = null,
  itemHeight = 40,
  noSearch = false,
  itemWidth = 0,
  moreOneFilterTurnOn = true,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(selectedId === '?')
  const [searchText, setSearchText] = useState('')
  const [moreOneFilter, setMoreOneFilter] = useState(moreOneFilterTurnOn)

  const ref = useRef()
  const inputRef = useRef()

  const moreOneFilterTurnOnExists = items.length && items[0].count !== undefined

  // useClickOutside(inputRef, () => {
  //   console.log(`OUTSIDE`)
  //   if (isMenuOpen) setIsMenuOpen(false)
  // })

  const selectedItem = selectedId
    ? items.find((item) => item._id === selectedId)
    : null

  const Item = itemComponent

  const filteredItemsArray = isMenuOpen
    ? filteredItems(
        items,
        searchText,
        exceptedIds,
        moreOneFilterTurnOnExists && moreOneFilter ? { count: '>0' } : {}
      )
    : []

  const toggleIsMenuOpen = () => setIsMenuOpen((state) => !state)

  useEffect(() => {
    // console.log(`ref.current`, ref.current)
    const checkIfClickedOutside = (e) => {
      // console.log(
      //   `ref.current.contains(e.target)`,
      //   ref.current.contains(e.target)
      // )
      if (
        dropDownList &&
        isMenuOpen &&
        ref.current &&
        !ref.current.contains(e.target)
      ) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', checkIfClickedOutside)

    if (isMenuOpen && !noSearch) inputRef.current.focus()

    return () => {
      document.removeEventListener('mousedown', checkIfClickedOutside)
    }
  }, [dropDownList, isMenuOpen, ref, inputRef])

  return (
    <div
      className={cn(
        className,
        'relative bg-gray-200 flex justify-center items-center cursor-pointer'
      )}
      style={{ height: itemHeight, width: itemWidth }}
      onClick={() => {
        if (dropDownList) toggleIsMenuOpen()
        if (onClick) onClick(selectedItem)
      }}
      ref={ref}
    >
      {dropDownList && (
        <div
          className={
            cn(
              'absolute overflow-hidden max-h-64 transform duration-300 ease-out flex flex-col top-full left-0 right-0 bg-white shadow-sm border border-gray-700 z-50',
              { 'opacity-0': !isMenuOpen }
            ) // scale-y-0 -translate-y-1/2
          }
          // style={{ width: itemWidth }}
          onClick={(e) => e.stopPropagation()}
        >
          {!noSearch && (
            <div
              className={cn(
                'flex gap-1 items-center border-gray-700 border-b p-1',
                { hidden: !isMenuOpen }
              )}
            >
              <input
                ref={inputRef}
                className="flex-1 outline-none"
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <FontAwesomeIcon
                className={'w-6 h-6 text-gray-700 cursor-pointer'}
                icon={searchText ? faTimes : faSearch}
                onClick={
                  searchText
                    ? () => setSearchText('')
                    : () => inputRef.current.focus()
                }
              />
              {moreOneFilterTurnOnExists ? (
                <div
                  className={cn(
                    moreOneFilter ? 'bg-yellow-400' : 'bg-primary',
                    'hover:bg-toxic text-white flex items-center justify-center font-bold rounded cursor-pointer w-7 h-7'
                  )}
                  onClick={() => setMoreOneFilter(!moreOneFilter)}
                >
                  {'>0'}
                </div>
              ) : null}
            </div>
          )}
          {isMenuOpen && (
            <Virtuoso
              totalCount={filteredItemsArray.length}
              style={{
                maxHeight: 400,
                height: filteredItemsArray.length * itemHeight,
              }}
              className={cn({ hidden: !isMenuOpen })}
              data={filteredItemsArray}
              itemContent={(index, item) => (
                <Item
                  key={item._id}
                  item={item}
                  onClick={() => {
                    setIsMenuOpen(false)
                    onChange(item)
                  }}
                  active={item._id === selectedId}
                />
              )}
            />
          )}
        </div>
      )}
      {selectedItem ? (
        <Item item={selectedItem} />
      ) : (
        <div className="text-sm text-gray-800">Не выбрано</div>
      )}
    </div>
  )
}

const SelectItemContainer = ({
  required,
  label = '',
  onClickClearButton = null,
  onCreateNew,
  onEdit,
  children,
}) => {
  const Container = ({ children }) => (
    <>
      <label className="flex items-center justify-end leading-4 text-right">
        {label}
        {required && <span className="text-red-700">*</span>}
      </label>
      <div className="flex flex-1 border border-gray-700 rounded">
        {children}
      </div>
    </>
  )

  return (
    <Container>
      {children}
      {onEdit && (
        <div className="flex items-center justify-center border-l border-gray-700">
          <button
            onClick={onEdit}
            className="flex items-center justify-center w-8 h-full rounded-r shadow group whitespace-nowrap font-futuraDemi"
          >
            <FontAwesomeIcon
              className="w-3 h-3 duration-300 text-primary group-hover:scale-125"
              icon={faPencilAlt}
            />
          </button>
        </div>
      )}
      {onCreateNew && (
        <div className="flex items-center justify-center border-l border-gray-700">
          <button
            onClick={onCreateNew}
            className="flex items-center justify-center w-8 h-full rounded-r shadow group whitespace-nowrap font-futuraDemi"
          >
            <FontAwesomeIcon
              className="w-3 h-3 duration-300 text-primary group-hover:scale-125"
              icon={faPlus}
            />
          </button>
        </div>
      )}
      {onClickClearButton && (
        <div className="flex items-center justify-center border-l border-gray-700">
          <button
            onClick={onClickClearButton}
            className="flex items-center justify-center w-8 h-full rounded-r shadow group whitespace-nowrap font-futuraDemi"
          >
            <FontAwesomeIcon
              className="w-3 h-3 text-red-700 duration-300 group-hover:scale-125"
              icon={faTrash}
            />
          </button>
        </div>
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
}) => {
  const users = useRecoilValue(usersAtom)
  return (
    <SelectItemContainer
      required={required}
      label="Платильщик"
      onClickClearButton={
        selectedId && clearButton
          ? onDelete
            ? () => onDelete()
            : () => onChange(null)
          : null
      }
    >
      <SelectItem
        items={users}
        itemComponent={UserItem}
        onChange={onChange}
        selectedId={selectedId}
        className={
          'flex-1' + (selectedId && clearButton ? ' rounded-l' : ' rounded')
        }
        exceptedIds={exceptedIds}
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
}) => {
  const events = useRecoilValue(eventsAtom)
  return (
    <SelectItemContainer
      required={required}
      label="Мероприятие"
      onClickClearButton={
        selectedId && clearButton
          ? onDelete
            ? () => onDelete()
            : () => onChange(null)
          : null
      }
    >
      <SelectItem
        items={events}
        itemComponent={EventItem}
        onChange={onChange}
        selectedId={selectedId}
        className={
          'flex-1' + (selectedId && clearButton ? ' rounded-l' : ' rounded')
        }
        exceptedIds={exceptedIds}
      />
    </SelectItemContainer>
  )
}

// export const SelectProduct = ({
//   onChange,
//   onDelete,
//   selectedId = null,
//   exceptedIds = [],
//   required = false,
//   className = null,
//   clearButton = null,
// }) => {
//   const { products } = useSelector((state) => state)
//   return (
//     <SelectItemContainer
//       required={required}
//       label="Товар"
//       className={className}
//       onClickClearButton={
//         selectedId && clearButton
//           ? onDelete
//             ? () => onDelete()
//             : () => onChange(null)
//           : null
//       }
//     >
//       <SelectItem
//         items={products}
//         itemComponent={ProductItem}
//         onChange={onChange}
//         selectedId={selectedId}
//         className={
//           'flex-1' +
//           ( selectedId && clearButton
//             ? ' rounded-l-lg'
//             : ' rounded-lg')
//         }
//         exceptedIds={exceptedIds}
//       />
//     </SelectItemContainer>
//   )
// }

// export const SelectSet = ({
//   onChange,
//   onDelete,
//   selectedId = null,
//   exceptedIds = [],
//   required = false,
//   className = null,
//   clearButton = null,
//   readOnly = false,
// }) => {
//   const { sets } = useSelector((state) => state)
//   return (
//     <SelectItemContainer
//       required={required}
//       label="Набор"
//       className={className}
//       onClickClearButton={
//         selectedId && clearButton
//           ? onDelete
//             ? () => onDelete()
//             : () => onChange(null)
//           : null
//       }
//       readOnly={readOnly}
//     >
//       <SelectItem
//         items={sets}
//         itemComponent={SetItem}
//         onChange={onChange}
//         selectedId={selectedId}
//         className={className}
//         className={
//           'flex-1' +
//           (!readOnly && selectedId && clearButton
//             ? ' rounded-l-lg'
//             : ' rounded-lg')
//         }
//         exceptedIds={exceptedIds}
//         readOnly={readOnly}
//       />
//     </SelectItemContainer>
//   )
// }

// export const SelectClient = ({
//   onChange,
//   onDelete,
//   selectedId = null,
//   exceptedIds = [],
//   required = false,
//   className = null,
//   clearButton = null,
//   readOnly = false,
// }) => {
//   const { clients } = useSelector((state) => state)
//   return (
//     <SelectItemContainer
//       required={required}
//       label="Клиент"
//       className={className}
//       onClickClearButton={
//         selectedId && clearButton
//           ? onDelete
//             ? () => onDelete()
//             : () => onChange(null)
//           : null
//       }
//       readOnly={readOnly}
//     >
//       <SelectItem
//         items={clients}
//         itemComponent={PersonaItem}
//         onChange={onChange}
//         selectedId={selectedId}
//         className={
//           'flex-1' +
//           (!readOnly && selectedId && clearButton
//             ? ' rounded-l-lg'
//             : ' rounded-lg')
//         }
//         exceptedIds={exceptedIds}
//         readOnly={readOnly}
//       />
//     </SelectItemContainer>
//   )
// }

// export const SelectOrder = ({
//   onChange,
//   onDelete,
//   selectedId = null,
//   exceptedIds = [],
//   required = false,
//   className = null,
//   clearButton = null,
//   readOnly = false,
// }) => {
//   const { orders } = useSelector((state) => state)
//   return (
//     <SelectItemContainer
//       required={required}
//       label="Заказ"
//       className={className}
//       onClickClearButton={
//         selectedId && clearButton
//           ? onDelete
//             ? () => onDelete()
//             : () => onChange(null)
//           : null
//       }
//       readOnly={readOnly}
//     >
//       <SelectItem
//         items={orders}
//         itemComponent={OrderItem}
//         onChange={onChange}
//         selectedId={selectedId}
//         className={
//           'flex-1' +
//           (!readOnly && selectedId && clearButton
//             ? ' rounded-l-lg'
//             : ' rounded-lg')
//         }
//         exceptedIds={exceptedIds}
//         readOnly={readOnly}
//       />
//     </SelectItemContainer>
//   )
// }

// export const SelectPayment = ({
//   onChange,
//   onDelete,
//   onCreateNew,
//   onEdit,
//   selectedId = null,
//   exceptedIds = [],
//   required = false,
//   className = null,
//   clearButton = null,
//   label = null,
//   onClick = null,
//   dropDownList,
//   readOnly = false,
// }) => {
//   const { payments } = useSelector((state) => state)
//   const payment = payments.find((payment) => payment._id === selectedId)

//   return (
//     <SelectItemContainer
//       required={required}
//       label={label}
//       className={className}
//       onClickClearButton={
//         selectedId && clearButton
//           ? onDelete
//             ? () => onDelete(payment)
//             : () => onChange(null)
//           : null
//       }
//       onCreateNew={selectedId === '?' ? onCreateNew : null}
//       onEdit={
//         onEdit && selectedId !== '?' && payment ? () => onEdit(payment) : null
//       }
//       readOnly={readOnly}
//     >
//       <SelectItem
//         items={payments}
//         itemComponent={PaymentItem}
//         onChange={onChange}
//         selectedId={selectedId}
//         className={
//           'flex-1' +
//           (!readOnly && selectedId && clearButton
//             ? ' rounded-l-lg'
//             : ' rounded-lg')
//         }
//         exceptedIds={exceptedIds}
//         onClick={selectedId !== '?' && payment ? () => onClick(payment) : null}
//         dropDownList={dropDownList}
//         readOnly={readOnly}
//       />
//     </SelectItemContainer>
//   )
// }

// export const SelectDeliver = ({
//   onChange,
//   selectedId = null,
//   exceptedIds = [],
//   required = false,
//   className = null,
//   clearButton = null,
//   readOnly = false,
// }) => {
//   const { users } = useSelector((state) => state)
//   const delivers = users.filter(
//     (user) => user.role === 'deliver' || user.subRoles?.includes('deliver')
//   )
//   return (
//     <SelectItemContainer
//       required={required}
//       label="Курьер"
//       className={className}
//       onClickClearButton={
//         selectedId && clearButton ? () => onChange(null) : null
//       }
//       readOnly={readOnly}
//     >
//       <SelectItem
//         items={delivers}
//         itemComponent={PersonaItem}
//         onChange={onChange}
//         selectedId={selectedId}
//         className={
//           'flex-1' +
//           (!readOnly && selectedId && clearButton
//             ? ' rounded-l-lg'
//             : ' rounded-lg')
//         }
//         exceptedIds={exceptedIds}
//         readOnly={readOnly}
//       />
//     </SelectItemContainer>
//   )
// }

// export const SelectAerodesigner = ({
//   onChange,
//   selectedId = null,
//   exceptedIds = [],
//   required = false,
//   className = null,
//   clearButton = null,
//   readOnly = false,
// }) => {
//   const { users } = useSelector((state) => state)
//   const aerodesigners = users.filter(
//     (user) =>
//       user.role === 'aerodesigner' || user.subRoles?.includes('aerodesigner')
//   )
//   return (
//     <SelectItemContainer
//       required={required}
//       label="Аэродизайнер"
//       className={className}
//       onClickClearButton={
//         selectedId && clearButton ? () => onChange(null) : null
//       }
//       readOnly={readOnly}
//     >
//       <SelectItem
//         items={aerodesigners}
//         itemComponent={PersonaItem}
//         onChange={onChange}
//         selectedId={selectedId}
//         className={
//           'flex-1' +
//           (!readOnly && selectedId && clearButton
//             ? ' rounded-l-lg'
//             : ' rounded-lg')
//         }
//         exceptedIds={exceptedIds}
//         readOnly={readOnly}
//       />
//     </SelectItemContainer>
//   )
// }

// export const SelectOperator = ({
//   onChange,
//   selectedId = null,
//   exceptedIds = [],
//   required = false,
//   className = null,
//   clearButton = null,
//   readOnly = false,
// }) => {
//   const { users } = useSelector((state) => state)
//   const operators = users.filter(
//     (user) => user.role === 'operator' || user.subRoles?.includes('operator')
//   )
//   return (
//     <SelectItemContainer
//       required={required}
//       label="Оператор"
//       className={className}
//       onClickClearButton={
//         selectedId && clearButton ? () => onChange(null) : null
//       }
//       readOnly={readOnly}
//     >
//       <SelectItem
//         items={operators}
//         itemComponent={PersonaItem}
//         onChange={onChange}
//         selectedId={selectedId}
//         className={
//           'flex-1' +
//           (!readOnly && selectedId && clearButton
//             ? ' rounded-l-lg'
//             : ' rounded-lg')
//         }
//         exceptedIds={exceptedIds}
//         readOnly={readOnly}
//       />
//     </SelectItemContainer>
//   )
// }

// export const SelectDistrict = ({
//   onChange,
//   selectedId = null,
//   exceptedIds = [],
//   required = false,
//   className = null,
//   clearButton = true,
//   readOnly = false,
// }) => {
//   const { districts } = useSelector((state) => state)
//   return (
//     <SelectItemContainer
//       required={required}
//       label="Район"
//       className={className ? ' ' + className : ''}
//       onClickClearButton={
//         selectedId && clearButton ? () => onChange(null) : null
//       }
//       inLine
//       readOnly={readOnly}
//     >
//       <SelectItem
//         items={districts}
//         itemComponent={DistrictItem}
//         onChange={onChange}
//         selectedId={selectedId}
//         className={
//           'flex-1' +
//           (!readOnly && selectedId && clearButton
//             ? ' rounded-l-lg'
//             : ' rounded-lg')
//         }
//         exceptedIds={exceptedIds}
//         itemHeight={24}
//         itemWidth="100%"
//         noSearch
//         sort="name"
//         readOnly={readOnly}
//       />
//     </SelectItemContainer>
//   )
// }
