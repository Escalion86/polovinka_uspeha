import cn from 'classnames'
import { faCopy } from '@fortawesome/free-regular-svg-icons'
import { faPaste } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  Popover,
  PopoverHandler,
  PopoverContent,
} from '@material-tailwind/react'
import Tooltip from './Tooltip'

const SmallIconButton = ({ onClick, icon, dataTip, infoTextOnClick }) => {
  return (
    <Tooltip content={dataTip}>
      <div className="relative" onClick={onClick}>
        <Popover>
          <PopoverHandler>
            {/*  */}
            <div className="flex items-center justify-center p-1 bg-gray-100 border border-gray-400 rounded cursor-pointer group">
              <FontAwesomeIcon
                className="w-4 h-4 duration-200 text-general group-hover:scale-125"
                icon={icon}
                size="1x"
                // onClick={() => {
                //   // onChange(addImageClick)
                //   selectImageClick()
                // }}
              />
            </div>
            {/* </Tooltip> */}
          </PopoverHandler>
          {infoTextOnClick && (
            <PopoverContent>{infoTextOnClick}</PopoverContent>
          )}
        </Popover>
      </div>
    </Tooltip>
  )
}

const InputWrapper = ({
  label,
  labelClassName,
  children,
  onChange,
  copyPasteButtons,
  value,
  className,
  required,
}) => {
  const copyToClipboard = (text) => navigator.clipboard.writeText(text)
  const pasteFromClipboard = () => navigator.clipboard.readText().then(onChange)

  return (
    <>
      <label
        className={cn(
          'flex items-center justify-end text-text leading-4 text-right',
          labelClassName
        )}
      >
        {label}
        {required && <span className="text-red-700">*</span>}
      </label>
      <div className={cn('flex items-center gap-x-1', className)}>
        {children}
        {copyPasteButtons && (
          <>
            <SmallIconButton
              onClick={() => {
                console.log('value', value)
                copyToClipboard(value)
              }}
              icon={faCopy}
              dataTip="Копировать"
              infoTextOnClick="Текст скопирован"
            />
            <SmallIconButton
              onClick={pasteFromClipboard}
              icon={faPaste}
              dataTip="Вставить"
            />
          </>
        )}
      </div>
    </>
  )
}

export default InputWrapper
