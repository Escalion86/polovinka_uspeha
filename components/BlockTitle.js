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
      <div className="w-[36px] h-[36px] relative">
        <Image
          src="/img/svg_icons/logo.svg"
          // width={36}
          // height={36}
          fill
          alt="logo"
          // priority
          // placeholder="blur"
          // blurDataURL={'/img/logo_heart_24px.png'}
          // style={{ width: 'auto', height: 'auto' }}
        />
      </div>
      <H2>{title}</H2>
      <div className="w-[36px] h-[36px] relative">
        <Image
          src="/img/svg_icons/logo.svg"
          // width={36}
          // height={36}
          fill
          alt="logo"
          // priority
          // placeholder="blur"
          // blurDataURL={'/img/logo_heart_24px.png'}
          // style={{ width: 'auto', height: 'auto' }}
        />
      </div>
    </div>
  )
}

export default BlockTitle
