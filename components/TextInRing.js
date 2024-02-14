import { GRADIENT_COLORS } from '@helpers/constants'
import cn from 'classnames'
import Image from 'next/legacy/image'

const TextInRing = ({ text, fullHeight = true }) => {
  return (
    <div
      className={cn(
        'flex items-center justify-center w-full min-h-[120px] min-w-[120px] laptop:min-h-[160px] laptop:min-w-[160px]',
        fullHeight ? 'h-full' : ''
      )}
      style={{
        background: `linear-gradient(0.2turn, ${GRADIENT_COLORS[0]}, ${GRADIENT_COLORS[1]})`,
      }}
    >
      <div className="relative h-[110px] laptop:h-[150px] aspect-1">
        <Image
          src="/img/ring160px.png"
          layout="responsive"
          height="80%"
          width="80%"
          priority
        />
        {text && (
          <div
            dangerouslySetInnerHTML={{
              __html: text.replace(/-/g, '&#8209;'),
            }}
            className="absolute text-[13px] laptop:text-[17px] leading-5 text-center text-white -translate-x-1/2 -translate-y-[38%] font-adlery top-1/2 left-1/2"
          />
        )}
      </div>
    </div>
  )
}

export default TextInRing
