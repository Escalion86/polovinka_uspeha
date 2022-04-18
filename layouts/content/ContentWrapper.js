import cn from 'classnames'

const ContentWrapper = ({ children, className }) => {
  return (
    <div
      className={cn(
        'flex flex-col w-full overflow-scroll overflow-x-hidden',
        className
      )}
      style={{ gridArea: 'content' }}
    >
      {children}
    </div>
  )
}

export default ContentWrapper
