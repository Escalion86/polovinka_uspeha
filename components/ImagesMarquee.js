 'use client'

import PropTypes from 'prop-types'
import cn from 'classnames'
import { useEffect, useMemo, useRef, useState } from 'react'

const ImagesMarquee = ({
  images,
  className,
  imageClassName,
  heightClassName = 'h-56',
  itemWidthClassName = 'w-80',
  durationSec,
  pauseOnHover = true,
}) => {
  const preparedImages = Array.isArray(images) ? images.filter(Boolean) : []
  const wrapperRef = useRef(null)
  const trackRef = useRef(null)
  const dragStartXRef = useRef(0)
  const dragStartOffsetRef = useRef(0)
  const lastTsRef = useRef(0)
  const rafRef = useRef(null)

  const [isDragging, setIsDragging] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [halfWidth, setHalfWidth] = useState(0)
  const [offset, setOffset] = useState(0)

  if (preparedImages.length === 0) return null

  const animationDuration = useMemo(
    () =>
      Number.isFinite(durationSec)
        ? Math.max(8, Number(durationSec))
        : Math.max(16, preparedImages.length * 4),
    [durationSec, preparedImages.length]
  )

  const normalizeOffset = (value, width) => {
    if (!width) return value
    let next = value
    while (next <= -width) next += width
    while (next > 0) next -= width
    return next
  }

  useEffect(() => {
    const measure = () => {
      const fullWidth = trackRef.current?.scrollWidth ?? 0
      const nextHalfWidth = fullWidth > 0 ? fullWidth / 2 : 0
      setHalfWidth(nextHalfWidth)
      setOffset((prev) => normalizeOffset(prev, nextHalfWidth))
    }

    measure()
    window.addEventListener('resize', measure)

    let observer
    if ('ResizeObserver' in window && trackRef.current) {
      observer = new ResizeObserver(measure)
      observer.observe(trackRef.current)
    }

    return () => {
      window.removeEventListener('resize', measure)
      if (observer) observer.disconnect()
    }
  }, [preparedImages.length])

  useEffect(() => {
    const canAnimate = !isDragging && !(pauseOnHover && isHovered) && halfWidth > 0
    if (!canAnimate) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
      return undefined
    }

    const speedPxPerMs = halfWidth / (animationDuration * 1000)
    const tick = (ts) => {
      if (!lastTsRef.current) lastTsRef.current = ts
      const dt = ts - lastTsRef.current
      lastTsRef.current = ts
      setOffset((prev) => normalizeOffset(prev - speedPxPerMs * dt, halfWidth))
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
      lastTsRef.current = 0
    }
  }, [animationDuration, halfWidth, isDragging, isHovered, pauseOnHover])

  useEffect(() => {
    if (!isDragging) return undefined

    const onMouseMove = (event) => {
      const dx = event.clientX - dragStartXRef.current
      setOffset(
        normalizeOffset(dragStartOffsetRef.current + dx, halfWidth || undefined)
      )
    }
    const onTouchMove = (event) => {
      if (!event.touches?.[0]) return
      event.preventDefault()
      const dx = event.touches[0].clientX - dragStartXRef.current
      setOffset(
        normalizeOffset(dragStartOffsetRef.current + dx, halfWidth || undefined)
      )
    }
    const stopDragging = () => {
      setIsDragging(false)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', stopDragging)
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('touchend', stopDragging)
    window.addEventListener('touchcancel', stopDragging)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', stopDragging)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', stopDragging)
      window.removeEventListener('touchcancel', stopDragging)
    }
  }, [halfWidth, isDragging])

  const startDragging = (clientX) => {
    dragStartXRef.current = clientX
    dragStartOffsetRef.current = offset
    setIsDragging(true)
  }

  return (
    <>
      <div
        ref={wrapperRef}
        className={cn(
          'relative overflow-hidden bg-black select-none touch-pan-y',
          isDragging ? 'cursor-grabbing' : 'cursor-grab',
          heightClassName,
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseDown={(event) => startDragging(event.clientX)}
        onTouchStart={(event) => {
          if (!event.touches?.[0]) return
          startDragging(event.touches[0].clientX)
        }}
        onDragStart={(event) => event.preventDefault()}
      >
        <div
          ref={trackRef}
          className={cn(
            'flex h-full w-max will-change-transform'
          )}
          style={{ transform: `translate3d(${offset}px, 0, 0)` }}
          onDragStart={(event) => event.preventDefault()}
        >
          {[...preparedImages, ...preparedImages].map((src, index) => (
            <img
              key={`${src}-${index}`}
              src={src}
              alt=""
              draggable={false}
              className={cn('h-full object-cover', itemWidthClassName, imageClassName)}
            />
          ))}
        </div>
      </div>
      <style jsx global>{`
        @keyframes imagesMarqueeSlide {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </>
  )
}

ImagesMarquee.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string),
  className: PropTypes.string,
  imageClassName: PropTypes.string,
  heightClassName: PropTypes.string,
  itemWidthClassName: PropTypes.string,
  durationSec: PropTypes.number,
  pauseOnHover: PropTypes.bool,
}

export default ImagesMarquee
