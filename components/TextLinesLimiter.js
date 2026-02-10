import cn from 'classnames'
import { fixNoOrphanHtml, fixNoOrphanText } from './NoOrphanText'

const TextLinesLimiter = ({
  className,
  textClassName,
  lines = 1,
  children,
  textCenter = true,
  text,
  html,
  noOrphan = true,
  ...props
}) => {
  const shouldFix = Boolean(noOrphan)
  const contentText =
    text !== undefined && text !== null
      ? text
      : typeof children === 'string' || typeof children === 'number'
        ? children
        : null

  const contentHtml =
    html !== undefined && html !== null
      ? shouldFix
        ? fixNoOrphanHtml(html)
        : html
      : null

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
        {...(contentHtml !== null
          ? { dangerouslySetInnerHTML: { __html: contentHtml } }
          : {})}
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
        {contentHtml === null
          ? contentText !== null
            ? shouldFix
              ? fixNoOrphanText(contentText)
              : contentText
            : children
          : null}
        {/* </div>
      </div> */}
      </div>
    </div>
  )
}

export default TextLinesLimiter
