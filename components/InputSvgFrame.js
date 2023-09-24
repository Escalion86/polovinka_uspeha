import { modalsFuncAtom } from '@state/atoms'
import cn from 'classnames'
import { useRecoilValue } from 'recoil'
import InputWrapper from './InputWrapper'
import frames from './frames/frames'

const InputSvgFrame = ({
  label = 'Рамка',
  frameId = null,
  // noImage = '/img/no_image.png',
  onChange = () => {},
  required = false,
  noEditButton = false,
  // directory = null,
  // imageName = null,
  // onDelete = null,
  labelClassName,
  className,
  error,
}) => {
  const modalsFunc = useRecoilValue(modalsFuncAtom)

  const Copmponent = () => (
    <div className="flex items-center justify-center w-20 h-20 leading-4 text-center text-gray-400">
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
      onChange={onChange}
      value={frameId}
      className={cn('flex-1 max-w-[100px]', className)}
      required={required}
      error={error}
      fullWidth={false}
      // paddingY
      // labelPos="top"
    >
      <div
        className={cn(
          'relative border rounded-sm h-20 w-20 overflow-hidden group',
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
