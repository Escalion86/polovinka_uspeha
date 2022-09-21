import cn from 'classnames'
import { faCopy } from '@fortawesome/free-regular-svg-icons'
import { faPaste } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Tooltip from '@components/Tooltip'
import Label from './Label'
import copyToClipboard from '@helpers/copyToClipboard'
import pasteFromClipboard from '@helpers/pasteFromClipboard'
import useSnackbar from '@helpers/useSnackbar'

const SmallIconButton = ({ onClick, icon, tooltip, infoTextOnClick }) => {
  return (
    <Tooltip title={tooltip}>
      <div className="relative" onClick={onClick}>
        <div className="flex items-center justify-center p-1 bg-gray-100 border border-gray-400 rounded cursor-pointer group">
          <FontAwesomeIcon
            className="w-4 h-4 duration-200 text-general group-hover:scale-125"
            icon={icon}
            size="1x"
          />
        </div>
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
  labelPos,
  labelContentWidth,
  wrapperClassName,
  hidden = false,
}) => {
  const { info } = useSnackbar()
  return (
    <div
      className={cn(
        'duration-300 flex gap-y-1 gap-x-2',
        // inLine ? '' : 'flex-col laptop:flex-row',
        labelPos === 'top' || labelPos === 'bottom'
          ? 'flex-col'
          : labelPos === 'left' || labelPos === 'right'
          ? 'flex-row items-center'
          : 'flex-col laptop:flex-row laptop:items-center',
        hidden ? 'max-h-0 my-0 py-0' : '',
        wrapperClassName
      )}
    >
      {label && (!labelPos || labelPos === 'left' || labelPos === 'top') && (
        <Label
          text={label}
          className={labelClassName}
          required={required}
          contentWidth={labelContentWidth || labelPos === 'top'}
          textPos={labelPos === 'top' ? 'left' : 'right'}
        />
      )}
      <div className={cn('flex items-center gap-x-2 flex-1', className)}>
        {children}
        {copyPasteButtons && (
          <>
            {copyButton && value && (
              <SmallIconButton
                onClick={() => {
                  info('Текст скопирован в буфер обмена')
                  copyToClipboard(value)
                }}
                icon={faCopy}
                tooltip="Копировать"
                infoTextOnClick="Текст скопирован"
              />
            )}
            {pasteButton && onChange && (
              <SmallIconButton
                onClick={() => pasteFromClipboard(onChange)}
                icon={faPaste}
                tooltip="Вставить"
              />
            )}
          </>
        )}

        {label && (labelPos === 'right' || labelPos === 'bottom') && (
          <Label
            text={label}
            className={labelClassName}
            required={required}
            contentWidth
            textPos={labelPos === 'bottom' ? 'left' : 'right'}
          />
        )}
      </div>
    </div>
  )
}

export default InputWrapper
