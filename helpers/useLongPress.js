import { useEffect, useState } from 'react'

const useLongPress = (onLongPressRepeat, onFinish) => {
  // const [isLongPressed, setIsLongPressed] = useState(false)
  const [timerId, setTimerId] = useState(null)
  const [intervalId, setIntervalId] = useState(null)

  const handleMouseDown = () => {
    setTimerId(
      setTimeout(() => {
        // setIsLongPressed(true)
        setIntervalId(
          setInterval(() => {
            onLongPressRepeat()
          }, 50)
        )
      }, 500)
    )
  }

  const handleMouseUp = () => {
    // setIsLongPressed(false)
    clearTimeout(timerId)
    clearInterval(intervalId)

    // if (!isLongPressed) onLongPressRepeat()
  }

  useEffect(() => {
    return () => {
      clearTimeout(timerId)
      clearInterval(intervalId)
    }
  }, [timerId, intervalId])

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
