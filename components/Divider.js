import cn from 'classnames'

const Divider = ({
  type = 'horizontal',
  light = false,
  thin = false,
  className,
}) => (
  <div
    className={cn(
      type === 'horizontal'
        ? cn('h-[1px] w-full border-t', thin ? 'my-1' : 'my-3')
        : cn('w-[1px] h-full border-l', thin ? 'mx-1' : 'mx-3'),
      light ? 'border-gray-400' : 'border-gray-600',
      className
    )}
  />
)

export default Divider
