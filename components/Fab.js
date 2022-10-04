import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import cn from 'classnames'
import { useEffect, useRef, useState } from 'react'
import { useLongPress } from 'use-long-press'

const Fab = ({ onClick = () => {}, show = true }) => {
  const wrapperRef = useRef(null)
  const [showing, setShowing] = useState(show)
  const bind = useLongPress(() => {
    setShowing(false)
  })

  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target) &&
        !event.target.classList.contains('fab')
      )
        setShowing(true)
    }
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [wrapperRef])

  return (
    <div
      className={cn(
        'transition duration-300 flex flex-col justify-end absolute right-8',
        showing ? 'fab-top' : '-bottom-20'
      )}
    >
      <div
        className="relative p-4 rounded-full cursor-pointer fab w-13 h-13 bg-general group max-h-13 max-w-13"
        onClick={onClick}
        ref={wrapperRef}
        {...bind()}
      >
        <FontAwesomeIcon
          className="z-10 w-5 h-5 text-white duration-200 max-w-5 max-h-5 group-hover:scale-150"
          icon={faPlus}
        />
      </div>
    </div>
  )
}

export default Fab
