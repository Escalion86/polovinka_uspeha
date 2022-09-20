import cn from 'classnames'
import BlockTitle from './BlockTitle'
import Section from './Section'
import { H2 } from './tags'

const BlockContainer = ({
  title,
  id,
  style,
  className,
  children,
  small,
  altBg,
}) => {
  // if (!children)
  //   return (
  //     <>
  //       <section id={id} className="relative -top-[72px]" />
  //       <BlockTitle title={title} className="mt-20" />
  //     </>
  //   )
  return (
    <div
      className="flex flex-col items-center justify-center"
      // style={style}
    >
      {id && <Section id={id} />}

      {(title || children) && (
        <div
          className={cn(
            `flex flex-col justify-center tablet:gap-y-6 w-full gap-y-4 px-6 laptop:px-20`,
            small ? 'py-10' : 'py-20',
            altBg ? 'bg-secondary' : 'bg-white',
            className
          )}
          style={style}
        >
          <BlockTitle title={title} />
          {children}
        </div>
      )}
    </div>
  )
}

export default BlockContainer
