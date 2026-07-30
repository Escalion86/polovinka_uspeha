'use client'

import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'

export const DEFAULT_HERO_IMAGES = [
  '/img/general/1.jpg',
  '/img/general/2.jpg',
  '/img/general/3.jpg',
  '/img/general/4.jpg',
  '/img/general/5.jpg',
  '/img/general/6.png',
  '/img/general/7.jpg',
  '/img/general/8.png',
  '/img/general/9.jpg',
  '/img/general/10.png',
  '/img/general/11.png',
  '/img/general/12.png',
  '/img/general/13.png',
  '/img/general/14.png',
  '/img/general/15.png',
]

const HeroImageSlider = ({
  images = DEFAULT_HERO_IMAGES,
  alt = 'Участники проекта на живых встречах',
  intervalMs = 5000,
}) => {
  const preparedImages = Array.isArray(images) ? images.filter(Boolean) : []
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (preparedImages.length <= 1) return undefined

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    if (reducedMotion) return undefined

    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % preparedImages.length)
    }, intervalMs)

    return () => window.clearInterval(intervalId)
  }, [intervalMs, preparedImages.length])

  if (preparedImages.length === 0) return null

  return (
    <div
      className="relative aspect-[1.55/1] h-full w-full overflow-hidden"
      role="img"
      aria-label={alt}
      data-hero-slider
      data-active-slide={activeIndex}
    >
      {preparedImages.map((src, index) => (
        <img
          key={src}
          src={src}
          alt=""
          aria-hidden="true"
          loading={index === 0 ? 'eager' : 'lazy'}
          fetchPriority={index === 0 ? 'high' : 'auto'}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1400ms] ease-in-out motion-reduce:transition-none ${
            index === activeIndex ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
    </div>
  )
}

HeroImageSlider.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string),
  alt: PropTypes.string,
  intervalMs: PropTypes.number,
}

export default HeroImageSlider
