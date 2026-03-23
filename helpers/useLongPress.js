import { useCallback, useEffect, useRef } from 'react'

const useLongPress = (onLongPressRepeat, onFinish) => {
  const timerRef = useRef(null)
  const intervalRef = useRef(null)

  const clearTimers = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const handleMouseDown = useCallback(() => {
    clearTimers()
    timerRef.current = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        onLongPressRepeat()
      }, 50)
    }, 500)
  }, [clearTimers, onLongPressRepeat])

  const handleMouseUp = useCallback(() => {
    clearTimers()
  }, [clearTimers])

  useEffect(() => {
    return () => {
      clearTimers()
    }
  }, [clearTimers])

  return {
    onMouseDown: () => {
      onLongPressRepeat()
      handleMouseDown()
    },
    onMouseUp: () => {
      handleMouseUp()
      onFinish && onFinish()
    },
    onTouchStart: () => {
      handleMouseDown()
    },
    onTouchEnd: () => {
      handleMouseUp()
    },
  }
}

// const useLongPress = (
//   onLongPress,
//   // onClick,
//   onStopLongPress,
//   { shouldPreventDefault = true, delay = 500, repeatDelay = 50 } = {}
// ) => {
//   const [longPressTriggered, setLongPressTriggered] = useState(false)
//   const timeout = useRef()
//   const target = useRef()
//   const timeoutRepeater = useRef()

//   const start = useCallback(
//     (event) => {
//       if (shouldPreventDefault && event.target) {
//         event.target.addEventListener('touchend', preventDefault, {
//           passive: false,
//         })
//         target.current = event.target
//       }
//       timeout.current = setTimeout(() => {
//         onLongPress(event)
//         setLongPressTriggered(true)
//         if (repeatDelay > 0) {
//           timeoutRepeater.current = setInterval(() => {
//             onLongPress(event)
//           }, repeatDelay)
//         }
//       }, delay)
//     },
//     [onLongPress, delay, shouldPreventDefault]
//   )

//   const clear = useCallback(
//     (event, shouldTriggerClick = true) => {
//       timeout.current && clearTimeout(timeout.current)
//       timeoutRepeater.current && clearTimeout(timeoutRepeater.current)
//       // shouldTriggerClick && onStopLongPress && onStopLongPress()
//       // onLongPress(event)
//       shouldTriggerClick && !longPressTriggered && onStopLongPress()
//       setLongPressTriggered(false)
//       if (shouldPreventDefault && target.current) {
//         target.current.removeEventListener('touchend', preventDefault)
//       }
//     },
//     [
//       shouldPreventDefault,
//       // onClick,
//       longPressTriggered,
//       onStopLongPress,
//     ]
//   )

//   return {
//     onMouseDown: (e) => start(e),
//     onTouchStart: (e) => start(e),
//     onMouseUp: (e) => {
//       clear(e, false)
//       onStopLongPress(e)
//     },
//     onMouseLeave: (e) => clear(e, false),
//     onTouchEnd: (e) => {
//       clear(e, false)
//       onStopLongPress(e)
//     },
//     // onClick: (e) => onStopLongPress(e),
//   }
// }

// const isTouchEvent = (event) => {
//   return 'touches' in event
// }

// const preventDefault = (event) => {
//   if (!isTouchEvent(event)) return

//   if (event.touches.length < 2 && event.preventDefault) {
//     event.preventDefault()
//   }
// }

export default useLongPress
