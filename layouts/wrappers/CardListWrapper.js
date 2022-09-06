import cn from 'classnames'

const CardListWrapper = ({ children, className }) => {
  return (
    <div
      className={cn(
        'flex-1 flex flex-col w-full overflow-scroll overflow-x-hidden py-1 bg-opacity-15 gap-y-2 bg-general',
        className
      )}
    >
      {children}
    </div>
  )
}

export default CardListWrapper
