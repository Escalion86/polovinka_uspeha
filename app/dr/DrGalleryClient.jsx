'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import PropTypes from 'prop-types'

const ROTATIONS = [-10, 8, -6, 12, -4, 9, -8, 6, -12, 7, -5, 10]
const SHIFTS_X = [-16, 12, -10, 14, -8, 10, -12, 9]
const SHIFTS_Y = [-12, 10, -8, 14, -10, 8, -6, 12]
const RANDOM_SHIFT_RANGE_X = 100
const RANDOM_SHIFT_RANGE_Y = 25
const BASE_Y_OFFSET = 72
const CHANGE_DELAY_MS = 5000

export default function DrGalleryClient({ imagePaths }) {
  const [visibleCount, setVisibleCount] = useState(
    imagePaths.length > 0 ? 1 : 0
  )

  useEffect(() => {
    if (imagePaths.length <= 1) {
      return undefined
    }

    const intervalId = setInterval(() => {
      setVisibleCount((prevCount) =>
        prevCount >= imagePaths.length ? 1 : prevCount + 1,
      )
    }, CHANGE_DELAY_MS)

    return () => clearInterval(intervalId)
  }, [imagePaths.length])

  const sceneItems = useMemo(
    () =>
      imagePaths.map((src, index) => {
        const rotate = ROTATIONS[index % ROTATIONS.length]
        const randomX = Math.round((Math.random() * 2 - 1) * RANDOM_SHIFT_RANGE_X)
        const randomY = Math.round((Math.random() * 2 - 1) * RANDOM_SHIFT_RANGE_Y)
        const shiftX = SHIFTS_X[index % SHIFTS_X.length] + randomX
        const shiftY =
          SHIFTS_Y[index % SHIFTS_Y.length] + randomY + BASE_Y_OFFSET

        return {
          src,
          index,
          rotate,
          shiftX,
          shiftY,
        }
      }),
    [imagePaths]
  )

  return (
    <main
      className="relative min-h-screen overflow-hidden bg-[#100f16] bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/dr_fon.png')" }}
    >
      <div className="absolute inset-0 pointer-events-none bg-black/10" />

      <section className="relative flex items-center justify-center min-h-screen px-4 py-8 sm:px-6">
        <div className="relative h-[min(70vh,840px)] w-[min(82vw,620px)]">
          {sceneItems.map(({ src, index, rotate, shiftX, shiftY }) => {
            const isVisible = index < visibleCount

            return (
              <div
                key={src}
                className="absolute left-1/2 top-1/2 h-[min(68vh,800px)] w-[min(80vw,600px)] transition-opacity duration-[3000ms] ease-in-out"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: `translate(-50%, -50%) translate(${shiftX}px, ${shiftY}px) rotate(${rotate}deg)`,
                  zIndex: index + 1,
                }}
              >
                <Image
                  src={src}
                  alt={`DR slide ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 88vw, 680px"
                  className="object-contain select-none"
                  priority={index === 0}
                />
              </div>
            )
          })}
        </div>
      </section>
    </main>
  )
}

DrGalleryClient.propTypes = {
  imagePaths: PropTypes.arrayOf(PropTypes.string).isRequired,
}
