import cn from 'classnames'
import ReactTooltip from 'react-tooltip'
import { useRef, useState } from 'react'
import { faCopy } from '@fortawesome/free-regular-svg-icons'
import { faPaste } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { motion } from 'framer-motion'

const SmallIconButton = ({ onClick, icon, dataTip, infoTextOnClick }) => {
  const [showInfo, setShowInfo] = useState(false)
  const tooltipRef = useRef(null)

  const startShowInfo = () => {
    if (!showInfo) {
      ReactTooltip.hide()
      setShowInfo(true)
      setTimeout(() => {
        setShowInfo(false)
      }, 2000)
    }
  }

  return (
    <div className="relative">
      {infoTextOnClick && showInfo && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="absolute px-2 py-1 text-white -translate-x-1/2 bg-black rounded bg-opacity-90 left-1/2 -top-10 whitespace-nowrap"
        >
          {infoTextOnClick}
        </motion.div>
      )}
      <div
        onClick={() => {
          startShowInfo()
          onClick()
        }}
        className="flex items-center justify-center p-1 bg-gray-100 border border-gray-400 rounded cursor-pointer group"
        data-tip={dataTip}
      >
        <FontAwesomeIcon
          className="w-4 h-4 duration-200 text-general group-hover:scale-125"
          icon={icon}
          size="1x"
          // onClick={() => {
          //   // onChange(addImageClick)
          //   selectImageClick()
          // }}
        />
        <ReactTooltip
          ref={tooltipRef}
          effect="solid"
          delayShow={400}
          // disable={!showInfo}
          // backgroundColor="white"
          // textColor="black"
          // border
          // borderColor="gray"
          type="dark"
        />
      </div>
    </div>
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
              onClick={() => copyToClipboard(value)}
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
