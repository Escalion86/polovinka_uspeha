import cn from 'classnames'
import BlockTitle from './BlockTitle'
import Section from './Section'

const BlockContainer = ({
  title,
  id,
  style,
  className,
  childrenWrapperClassName,
  children,
  small,
  altBg,
}) => (
  <div className="flex flex-col items-center justify-center">
    {id && <Section id={id} />}

    {(title || children) && (
      <div
        className={cn(
          `flex flex-col justify-center tablet:gap-y-6 w-full gap-y-4 px-6 laptop:px-20`,
          small ? 'py-10' : 'py-20',
          altBg ? 'bg-secondary' : 'bg-gray-100',
          className
        )}
        style={style}
      >
        <BlockTitle title={title} />
        <div className={childrenWrapperClassName}>{children}</div>
      </div>
    )}
  </div>
)

export default BlockContainer
