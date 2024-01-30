import Chip from '@components/Chips/Chip'
import InputWrapper from '@components/InputWrapper'
import { faWrench } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { modalsFuncAtom } from '@state/atoms'
import siteSettingsAtom from '@state/atoms/siteSettingsAtom'
import cn from 'classnames'
import { forwardRef, useState } from 'react'
import { Popover } from 'react-tiny-popover'
import { useRecoilValue } from 'recoil'

const ChipsSelector = forwardRef(
  (
    {
      label,
      onChange,
      value,
      items,
      className,
      labelClassName,
      error = false,
      noBorder = false,
      placeholder,
      disabled = false,
      required,
      fullWidth = false,
      noMargin = false,
      smallMargin = false,
      showDisabledIcon = true,
      prefix,
      prefixClassName,
      postfix,
      postfixClassName,
      showErrorText = false,
      floatingLabel = true,
      canEditChips = false,
      readOnly = false,
      popoverAlign = 'center',
    },
    ref
  ) => {
    const modalsFunc = useRecoilValue(modalsFuncAtom)
    const [isPopoverOpen, setIsPopoverOpen] = useState(false)
    const [isJustOpened, setIsJustOpened] = useState(false)

    const filteredValue =
      typeof value === 'object' && value.length > 0
        ? value.filter((text) => text)
        : []

    const Trigger = forwardRef((props, ref) => (
      <InputWrapper
        label={label}
        labelClassName={labelClassName}
        value={filteredValue}
        className={cn(readOnly ? '' : 'cursor-pointer', className)}
        required={required}
        floatingLabel={floatingLabel}
        error={error}
        showErrorText={showErrorText}
        paddingY
        paddingX
        postfix={postfix}
        prefix={prefix}
        prefixClassName={prefixClassName}
        postfixClassName={postfixClassName}
        ref={ref}
        disabled={disabled}
        fullWidth={fullWidth}
        noBorder={noBorder}
        noMargin={noMargin}
        showDisabledIcon={showDisabledIcon}
        wrapperClassName="gap-x-1 flex-wrap gap-y-1"
        smallMargin={smallMargin}
        {...props}
      >
        {filteredValue.length > 0 ? (
          filteredValue.map((text, index) => (
            <Chip
              key={'chip' + text}
              text={text}
              color={items.find((item) => item.text === text)?.color}
              onClose={
                readOnly
                  ? undefined
                  : () => onChange(value.filter((val) => val !== text))
              }
            />
          ))
        ) : (
          <div className="text-disabled">{placeholder}</div>
        )}
        {!readOnly && canEditChips && (
          <div className="flex items-center justify-end flex-1">
            <div
              onClick={(e) => {
                e.stopPropagation()
                setIsPopoverOpen(false)
                modalsFunc.eventsTags.edit()
              }}
              className="flex items-center justify-center p-0.5 cursor-pointer group"
            >
              <FontAwesomeIcon
                icon={faWrench}
                className="w-4 h-4 duration-300 text-disabled group-hover:text-gray-700 group-hover:scale-125"
              />
            </div>
          </div>
        )}
      </InputWrapper>
    ))

    if (readOnly) return <Trigger ref={ref} />

    return (
      <Popover
        ref={ref}
        isOpen={isPopoverOpen}
        containerClassName="z-50"
        onClickOutside={() => {
          if (!isJustOpened) setIsPopoverOpen(false)
          setIsJustOpened(false)
        }}
        align={popoverAlign}
        positions={['top', 'bottom', 'left', 'right']} // preferred positions by priority
        content={
          <div
            className={cn(
              'z-50 grid grid-cols-2 gap-[1px] overflow-hidden bg-gray-400 border border-gray-400 rounded-md',
              items.length <= 8
                ? 'grid-cols-1'
                : items.length <= 16
                ? 'grid-cols-2'
                : 'grid-cols-3'
            )}
          >
            {items.map((item, index) => {
              const isActive = filteredValue.includes(item.text)
              return (
                <div
                  key={'popover_chip' + item.text}
                  className={cn(
                    'px-2 py-1 overflow-hidden uppercase cursor-pointer select-none',
                    isActive ? 'text-gray-700' : 'text-disabled'
                  )}
                  style={{
                    backgroundColor: isActive ? item.color : 'white',
                  }}
                  onClick={() =>
                    isActive
                      ? onChange(
                          filteredValue.filter((text) => text !== item.text)
                        )
                      : onChange([...filteredValue, item.text])
                  }
                >
                  {item.text}
                </div>
              )
            })}
          </div>
        }
      >
        <Trigger
          onClick={() => {
            if (!isPopoverOpen) setIsJustOpened(true)
            setIsPopoverOpen((state) => !state)
          }}
        />
      </Popover>
    )
  }
)

export default ChipsSelector
