import cn from 'classnames'
import Image from 'next/image'

const ImageCheckBox = ({
  checked = false,
  onClick = null,
  small = false,
  big = false,
  label = null,
  labelClassName,
  readOnly = false,
  hidden = false,
  wrapperClassName,
  error,
  noMargin,
  disabled,
  src,
}) => {
  if (readOnly && !checked) return null

  return (
    (!readOnly || checked) && (
      <div
        className={cn(
          'flex gap-x-1.5 pl-1 items-center',
          noMargin ? '' : 'my-2',
          hidden ? 'hidden' : '',
          wrapperClassName
        )}
      >
        <div
          className={cn(
            'duration-300',
            !readOnly && !disabled ? 'cursor-pointer' : '',
            big
              ? 'min-w-6 min-h-6 w-6 h-6'
              : small
                ? 'min-w-4 min-h-4 w-4 h-4'
                : 'min-w-5 min-h-5 w-5 h-5',
            checked ? '' : 'grayscale'
          )}
          onClick={!readOnly || disabled ? onClick : null}
        >
          <Image
            src={src}
            width={big ? 24 : small ? 16 : 20}
            height={big ? 24 : small ? 16 : 20}
          />
        </div>
        <div
          className={cn(
            'leading-[0.875rem]',
            error ? 'text-danger' : '',
            labelClassName
          )}
        >
          {label}
        </div>
      </div>
    )
  )
}

export default ImageCheckBox
