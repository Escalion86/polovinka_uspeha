import cn from 'classnames'
import Image from 'next/image'
import { H2 } from './tags'

const BlockTitle = ({ title, className }) => {
  if (!title) return null
  return (
    <div
      className={cn(
        'flex items-center justify-around px-2 tablet:justify-center w-full gap-x-2 tablet:gap-x-8',
        className
      )}
    >
      <Image src="/img/svg_icons/logo.svg" width="36" height="36" />
      <H2>{title}</H2>
      <Image src="/img/svg_icons/logo.svg" width="36" height="36" />
    </div>
  )
}

export default BlockTitle
