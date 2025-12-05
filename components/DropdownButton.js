import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import cn from 'classnames'
import { Dropdown, DropdownItem } from 'flowbite-react'

const DropdownButton = ({
  name,
  icon,
  items,
  rounded = true,
  big = false,
  thin = false,
  disabled = false,
}) => {
  return (
    <div className={cn(disabled ? 'cursor-not-allowed' : '')}>
      <Dropdown
        size={big ? 'md' : thin ? 'xs' : 'sm'}
        className={cn(
          'text-base text-white',
          rounded ? (big ? 'rounded-lg' : 'rounded-sm') : '',
          // big ? 'text-xl py-2' : thin ? 'h-8 py-0.5' : 'h-9 py-1',
          disabled
            ? 'bg-gray-300 cursor-not-allowed opacity-100'
            : 'bg-general cursor-pointer'
        )}
        // style={{ cursor: 'not-allowed' }}
        label={
          <div className="flex items-center justify-center gap-x-2 whitespace-nowrap">
            {icon && (
              <FontAwesomeIcon
                icon={icon}
                className="w-5 h-5 min-w-5 min-h-5"
              />
            )}
            {name}
          </div>
        }
        disabled={disabled}
        // dismissOnClick={false}
      >
        {!disabled &&
          items.map((item) => (
            <DropdownItem
              key={item.name}
              className="flex items-center justify-start text-base text-white gap-x-2 whitespace-nowrap bg-general hover:bg-white hover:text-general"
              onClick={item.onClick}
            >
              {item.icon && (
                <FontAwesomeIcon
                  icon={item.icon}
                  className="w-5 h-5 min-w-5 min-h-5"
                />
              )}
              {item.name}
            </DropdownItem>
          ))}
      </Dropdown>
    </div>
  )
}

export default DropdownButton
