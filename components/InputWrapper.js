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
import Label from './Label'
import copyToClipboard from '@helpers/copyToClipboard'
import pasteFromClipboard from '@helpers/pasteFromClipboard'

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
            <PopoverContent className="z-50">{infoTextOnClick}</PopoverContent>
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
  copyButton = true,
  pasteButton = true,
  value,
  className,
  required,
}) => (
  <>
    <Label text={label} className={labelClassName} required={required} />
    <div className={cn('flex items-center gap-x-1', className)}>
      {children}
      {copyPasteButtons && (
        <>
          {copyButton && (
            <SmallIconButton
              onClick={() => copyToClipboard(value)}
              icon={faCopy}
              dataTip="Копировать"
              infoTextOnClick="Текст скопирован"
            />
          )}
          {pasteButton && (
            <SmallIconButton
              onClick={() => pasteFromClipboard(onChange)}
              icon={faPaste}
              dataTip="Вставить"
            />
          )}
        </>
      )}
    </div>
  </>
)

export default InputWrapper
