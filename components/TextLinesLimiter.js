import cn from 'classnames'

const TextLinesLimiter = ({
  className,
  textClassName,
  lines = 1,
  children,
  textCenter = true,
  ...props
}) => {
  return (
    <div className={className} {...props}>
      <div
        className={cn(
          textCenter ? 'text-center' : '',
          lines === 1
            ? 'line-clamp-1'
            : lines === 2
              ? 'line-clamp-2'
              : 'line-clamp-3',
          textClassName
        )}
      >
        {/* <div className="flex items-center w-full h-full">
        <div
          className={cn('w-full overflow-hidden', textClassName)}
          style={{
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: lines,
          }}
          {...props}
        > */}
        {children}
        {/* </div>
      </div> */}
      </div>
    </div>
  )
}

export default TextLinesLimiter
