import cn from 'classnames'

const TextLinesLimiter = ({
  className,
  textClassName,
  lines = 1,
  children,
  ...props
}) => {
  return (
    <div className={className}>
      <div className="flex items-center w-full h-full">
        <div
          className={cn('w-full overflow-hidden', textClassName)}
          style={{
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: lines,
          }}
          {...props}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

export default TextLinesLimiter
