import React from 'react'
import Image from 'next/image'
import { GRADIENT_COLORS } from '@helpers/constants'

const TextInRing = ({ text }) => {
  return (
    <div
      className="flex items-center justify-center w-full h-full min-h-40 min-w-40"
      style={{
        background: `linear-gradient(0.2turn, ${GRADIENT_COLORS[0]}, ${GRADIENT_COLORS[1]})`,
      }}
    >
      <div className="relative w-[152px] h-[152px] aspect-1">
        <Image
          src="/img/ring160px.png"
          layout="responsive"
          height="80%"
          width="80%"
          priority={text}
        />
        <div
          dangerouslySetInnerHTML={{
            __html: text.replace(/-/g, '&#8209;'),
          }}
          className="absolute text-[17px] leading-5 text-center text-white -translate-x-1/2 -translate-y-[38%] font-adlery top-1/2 left-1/2"
        />
      </div>
    </div>
  )
}

export default TextInRing
