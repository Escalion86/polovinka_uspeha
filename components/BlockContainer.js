import cn from 'classnames'
import Section from './Section'

const BlockContainer = ({ id, style, className, children, small }) => {
  if (!children) return <section id={id} className="relative -top-[72px]" />

  return (
    <div
      className={cn(
        `flex flex-col justify-center items-center tablet:gap-y-6 w-full marker:gap-y-4 px-10 tablet:px-20 ${
          small ? 'py-10' : 'py-20'
        }`,
        className
      )}
      style={style}
    >
      {id && <Section id={id} />}
      {children}
    </div>
  )
}

export default BlockContainer
