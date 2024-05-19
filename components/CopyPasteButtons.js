import { faPaste } from '@fortawesome/free-solid-svg-icons/faPaste'
import { faCopy } from '@fortawesome/free-solid-svg-icons/faCopy'
import cn from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Tooltip from './Tooltip'
import pastePhoneFromClipboard from '@helpers/pastePhoneFromClipboard'
import useSnackbar from '@helpers/useSnackbar'

const CopyPasteButtons = ({ copyText, onPaste, pastePhone }) => {
  const { info } = useSnackbar()

  return (
    <div className="flex items-center mt-2 gap-x-1">
      <Tooltip title="Копировать">
        <div
          className={cn(
            'group w-6 min-w-6 tablet:w-8 tablet:min-w-8 flex justify-center items-center',
            copyText ? 'cursor-pointer' : 'cursor-not-allowed'
          )}
          onClick={
            copyText
              ? async () => {
                  await navigator.clipboard.writeText(copyText)
                  info('Скопировано в буфер обмена')
                }
              : undefined
          }
        >
          <FontAwesomeIcon
            className={cn(
              'w-5 h-5 duration-300 tablet:w-6 tablet:min-w-6',
              copyText
                ? 'group-hover:scale-110 text-general group-hover:text-success'
                : 'text-gray-300'
            )}
            icon={faCopy}
          />
        </div>
      </Tooltip>
      <Tooltip title="Вставить">
        <div
          className="flex items-center justify-center w-6 cursor-pointer group min-w-6 tablet:w-8 tablet:min-w-8"
          onClick={async () => {
            if (pastePhone) {
              const clipboard = await pastePhoneFromClipboard()
              if (!clipboard) return
              onPaste(clipboard)
            } else {
              onPaste(await navigator.clipboard.readText())
            }
          }}
        >
          <FontAwesomeIcon
            className="w-5 h-5 duration-300 tablet:w-6 tablet:min-w-6 group-hover:scale-110 text-general group-hover:text-success"
            icon={faPaste}
          />
        </div>
      </Tooltip>
    </div>
  )
}

export default CopyPasteButtons
