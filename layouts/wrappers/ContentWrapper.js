import cn from 'classnames'

const ContentWrapper = ({ children, className }) => {
  return (
    <div
      className={cn(
        'flex flex-col w-full overflow-scroll overflow-x-hidden py-1 bg-opacity-15 gap-y-2 bg-general',
        className
      )}
      style={{ gridArea: 'content' }}
    >
      {children}
    </div>
  )
}

export default ContentWrapper
