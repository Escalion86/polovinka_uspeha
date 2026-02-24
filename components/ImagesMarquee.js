 'use client'

import PropTypes from 'prop-types'
import cn from 'classnames'
import { useEffect, useMemo, useRef, useState } from 'react'

const ImagesMarquee = ({
  images,
  className,
  imageClassName,
  heightClassName = 'h-56',
  itemWidthClassName = 'w-auto',
  durationSec,
  pauseOnHover = true,
  enableLightbox = true,
}) => {
  const preparedImages = Array.isArray(images) ? images.filter(Boolean) : []
  const wrapperRef = useRef(null)
  const trackRef = useRef(null)
  const dragStartXRef = useRef(0)
  const dragStartOffsetRef = useRef(0)
  const hasDraggedRef = useRef(false)
  const lastTsRef = useRef(0)
  const rafRef = useRef(null)

  const [isDragging, setIsDragging] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [halfWidth, setHalfWidth] = useState(0)
  const [offset, setOffset] = useState(0)
  const [shouldDuplicate, setShouldDuplicate] = useState(preparedImages.length > 1)
  const [lightboxIndex, setLightboxIndex] = useState(null)

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
    setShouldDuplicate(preparedImages.length > 1)
  }, [preparedImages.length])

  useEffect(() => {
    const measure = () => {
      const wrapperWidth = wrapperRef.current?.clientWidth ?? 0
      const fullWidth = trackRef.current?.scrollWidth ?? 0
      const singleSetWidth =
        fullWidth > 0 ? (shouldDuplicate ? fullWidth / 2 : fullWidth) : 0
      const needDuplicate =
        preparedImages.length > 1 &&
        singleSetWidth > 0 &&
        wrapperWidth > 0 &&
        singleSetWidth > wrapperWidth

      if (needDuplicate !== shouldDuplicate) {
        setShouldDuplicate(needDuplicate)
        return
      }

      if (!needDuplicate) {
        setHalfWidth(0)
        setOffset(0)
        return
      }

      setHalfWidth(singleSetWidth)
      setOffset((prev) => normalizeOffset(prev, singleSetWidth))
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
  }, [preparedImages.length, shouldDuplicate])

  useEffect(() => {
    const canAnimate =
      shouldDuplicate && !isDragging && !(pauseOnHover && isHovered) && halfWidth > 0
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
  }, [
    animationDuration,
    halfWidth,
    isDragging,
    isHovered,
    pauseOnHover,
    shouldDuplicate,
  ])

  useEffect(() => {
    if (!isDragging || !shouldDuplicate) return undefined

    const onMouseMove = (event) => {
      const dx = event.clientX - dragStartXRef.current
      if (Math.abs(dx) > 4) hasDraggedRef.current = true
      setOffset(
        normalizeOffset(dragStartOffsetRef.current + dx, halfWidth || undefined)
      )
    }
    const onTouchMove = (event) => {
      if (!event.touches?.[0]) return
      event.preventDefault()
      const dx = event.touches[0].clientX - dragStartXRef.current
      if (Math.abs(dx) > 4) hasDraggedRef.current = true
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
  }, [halfWidth, isDragging, shouldDuplicate])

  const startDragging = (clientX) => {
    if (!shouldDuplicate) return
    hasDraggedRef.current = false
    dragStartXRef.current = clientX
    dragStartOffsetRef.current = offset
    setIsDragging(true)
  }

  useEffect(() => {
    if (lightboxIndex === null) return undefined

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setLightboxIndex(null)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [lightboxIndex])

  return (
    <>
      <div
        ref={wrapperRef}
        className={cn(
          'relative overflow-hidden bg-black select-none touch-pan-y',
          shouldDuplicate
            ? isDragging
              ? 'cursor-grabbing'
              : 'cursor-grab'
            : 'cursor-default',
          heightClassName,
          className
        )}
        onMouseEnter={() => shouldDuplicate && setIsHovered(true)}
        onMouseLeave={() => shouldDuplicate && setIsHovered(false)}
        onMouseDown={(event) => {
          if (event.button !== 0) return
          startDragging(event.clientX)
        }}
        onTouchStart={(event) => {
          if (!shouldDuplicate) return
          if (!event.touches?.[0]) return
          startDragging(event.touches[0].clientX)
        }}
        onDragStart={(event) => event.preventDefault()}
      >
        <div
          ref={trackRef}
          className={cn(
            'flex h-full will-change-transform',
            shouldDuplicate ? 'w-max' : 'w-full justify-center'
          )}
          style={{
            transform: shouldDuplicate ? `translate3d(${offset}px, 0, 0)` : undefined,
          }}
          onDragStart={(event) => event.preventDefault()}
        >
          {(shouldDuplicate
            ? [...preparedImages, ...preparedImages]
            : preparedImages
          ).map((src, index) => (
            <img
              key={`${src}-${index}`}
              src={src}
              alt=""
              draggable={false}
              onClick={() => {
                if (!enableLightbox || hasDraggedRef.current) return
                setLightboxIndex(index % preparedImages.length)
              }}
              className={cn(
                'h-full shrink-0',
                enableLightbox ? 'cursor-zoom-in' : undefined,
                itemWidthClassName,
                imageClassName
              )}
            />
          ))}
        </div>
      </div>
      {enableLightbox && lightboxIndex !== null ? (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setLightboxIndex(null)
          }}
        >
          <button
            type="button"
            className="absolute top-4 right-4 rounded-full border border-white/25 bg-black/40 px-3 py-1 text-2xl leading-none text-white hover:bg-black/70"
            onClick={() => setLightboxIndex(null)}
            aria-label="Закрыть"
          >
            ×
          </button>
          <img
            src={preparedImages[lightboxIndex]}
            alt=""
            className="max-h-[92vh] max-w-[96vw] object-contain"
          />
        </div>
      ) : null}
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
  enableLightbox: PropTypes.bool,
}

export default ImagesMarquee
