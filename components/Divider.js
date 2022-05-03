import cn from 'classnames'

const Divider = ({ type = 'horizontal', light = false, thin = false }) => (
  <div
    className={cn(
      type === 'horizontal'
        ? cn('h-[1px] w-auto border-t', thin ? 'my-1' : 'my-3')
        : cn('w-[1px] h-auto border-l', thin ? 'mx-1' : 'mx-3'),
      light ? 'border-gray-400' : 'border-gray-600'
    )}
  />
)

export default Divider
