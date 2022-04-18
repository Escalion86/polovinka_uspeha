import cn from 'classnames'
import Section from './Section'

const BlockContainer = ({ id, style, className, children, small }) => (
  <div
    className={cn(
      'flex flex-col justify-center items-center gap-y-4 tablet:gap-y-6 w-full',
      !children ? '' : `px-10 tablet:px-20 ${small ? 'py-10' : 'py-20'}`,
      className
    )}
    style={style}
  >
    {id && <Section id={id} />}
    {children}
  </div>
)

export default BlockContainer
