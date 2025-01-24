import modalsFuncAtom from '@state/modalsFuncAtom'
import cn from 'classnames'
import { useAtomValue } from 'jotai'
import InputWrapper from './InputWrapper'
import frames from './frames/frames'

const InputSvgFrame = ({
  label = 'Рамка',
  frameId = null,
  onChange = () => {},
  required = false,
  labelClassName,
  className,
  error,
}) => {
  const modalsFunc = useAtomValue(modalsFuncAtom)

  var Copmponent = () => (
    <div className="flex items-center justify-center w-20 h-20 leading-4 text-center text-disabled">
      БЕЗ РАМКИ
    </div>
  )
  if (frameId) {
    const frame = frames.find(({ id }) => id === frameId)
    if (frame) Copmponent = frame.Frame
  }

  return (
    <InputWrapper
      label={label}
      labelClassName={labelClassName}
      value={frameId}
      className={cn('flex-1 max-w-[100px]', className)}
      required={required}
      error={error}
      fullWidth={false}
    >
      <div
        className={cn(
          'relative border rounded-xs h-20 w-20 overflow-hidden group',
          error ? ' border-red-700' : ' border-gray-400'
        )}
      >
        <div
          className="w-20 h-20 bg-white cursor-pointer"
          onClick={() => modalsFunc.selectSvgFrame(frameId, onChange)}
        >
          <Copmponent />
        </div>
      </div>
    </InputWrapper>
  )
}

export default InputSvgFrame
