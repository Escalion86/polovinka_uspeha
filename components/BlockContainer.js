import cn from 'classnames'
import Section from './Section'

const BlockContainer = ({ id, style, className, children, small, altBg }) => {
  if (!children) return <section id={id} className="relative -top-[72px]" />

  return (
    <div
      className="flex flex-col items-center justify-center"
      // style={style}
    >
      {id && <Section id={id} />}
      <div
        className={cn(
          `flex flex-col justify-center items-center tablet:gap-y-6 w-full gap-y-4 px-6 laptop:px-20 ${
            small ? 'py-10' : 'py-20'
          }`,
          altBg ? 'bg-secondary' : 'bg-white',
          className
        )}
        style={style}
      >
        {children}
      </div>
    </div>
  )
}

export default BlockContainer
