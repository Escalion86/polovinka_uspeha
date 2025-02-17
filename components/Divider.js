import cn from 'classnames'

const Divider = ({
  type = 'horizontal',
  light = false,
  thin = false,
  className,
  title,
}) =>
  title ? (
    <div
      className={cn(
        type === 'horizontal'
          ? cn('flex items-center gap-x-2 w-full', thin ? 'my-1' : 'my-3')
          : cn(
              'flex items-center flex-col gap-y-2 h-full',
              thin ? 'mx-1' : 'mx-3'
            ),
        className
      )}
    >
      <div
        className={cn(
          'flex-1',
          type === 'horizontal'
            ? cn('h-[1px] border-t')
            : cn('w-[1px] border-l'),
          light ? 'border-gray-400' : 'border-gray-600'
        )}
      />
      <div>{title}</div>
      <div
        className={cn(
          'flex-1',
          type === 'horizontal'
            ? cn('h-[1px] border-t')
            : cn('w-[1px] border-l'),
          light ? 'border-gray-400' : 'border-gray-600'
        )}
      />
    </div>
  ) : (
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
