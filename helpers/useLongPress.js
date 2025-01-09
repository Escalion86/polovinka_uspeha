import { useCallback, useRef, useState } from 'react'

const useLongPress = (
  onLongPress,
  onClick,
  onStopLongPress,
  { shouldPreventDefault = true, delay = 300, repeatDelay = 0 } = {}
) => {
  const [longPressTriggered, setLongPressTriggered] = useState(false)
  const timeout = useRef()
  const target = useRef()
  const timeoutRepeater = useRef()

  const start = useCallback(
    (event) => {
      if (shouldPreventDefault && event.target) {
        event.target.addEventListener('touchend', preventDefault, {
          passive: false,
        })
        target.current = event.target
      }
      timeout.current = setTimeout(() => {
        onLongPress(event)
        setLongPressTriggered(true)
        if (repeatDelay > 0) {
          timeoutRepeater.current = setInterval(() => {
            onLongPress(event)
          }, repeatDelay)
        }
      }, delay)
    },
    [onLongPress, delay, shouldPreventDefault]
  )

  const clear = useCallback(
    (event, shouldTriggerClick = true) => {
      timeout.current && clearTimeout(timeout.current)
      timeoutRepeater.current && clearTimeout(timeoutRepeater.current)
      shouldTriggerClick && !longPressTriggered && onClick()
      onStopLongPress && onStopLongPress()
      setLongPressTriggered(false)
      if (shouldPreventDefault && target.current) {
        target.current.removeEventListener('touchend', preventDefault)
      }
    },
    [shouldPreventDefault, onClick, longPressTriggered]
  )

  return {
    onMouseDown: (e) => start(e),
    onTouchStart: (e) => start(e),
    onMouseUp: (e) => clear(e),
    onMouseLeave: (e) => clear(e, false),
    onTouchEnd: (e) => clear(e),
  }
}

const isTouchEvent = (event) => {
  return 'touches' in event
}

const preventDefault = (event) => {
  if (!isTouchEvent(event)) return

  if (event.touches.length < 2 && event.preventDefault) {
    event.preventDefault()
  }
}

export default useLongPress
