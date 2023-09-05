import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import cn from 'classnames'
// import { useEffect, useRef, useState } from 'react'
// import { useLongPress } from 'use-long-press'

const Fab = ({
  onClick = () => {},
  show = true,
  icon = faPlus,
  bgClass = 'bg-general',
  href,
}) => {
  // const wrapperRef = useRef(null)
  // const [showing, setShowing] = useState(show)
  // const bind = useLongPress(() => {
  //   setShowing(false)
  // })

  // useEffect(() => {
  //   /**
  //    * Alert if clicked on outside of element
  //    */
  //   function handleClickOutside(event) {
  //     if (
  //       wrapperRef.current &&
  //       !wrapperRef.current.contains(event.target) &&
  //       !event.target.classList.contains('fab')
  //     )
  //       setShowing(true)
  //   }
  //   // Bind the event listener
  //   document.addEventListener('mousedown', handleClickOutside)
  //   return () => {
  //     // Unbind the event listener on clean up
  //     document.removeEventListener('mousedown', handleClickOutside)
  //   }
  // }, [wrapperRef])

  return (
    <div
      className={cn(
        'z-10 transition duration-300 flex flex-col justify-end fixed right-8',
        show
          ? // 'fab-top'
            'bottom-10'
          : '-bottom-20'
      )}
    >
      <div
        className={cn(
          'absolute animate-ping w-[52px] h-[52px] max-h-[52px] max-w-[52px] rounded-full',
          bgClass
        )}
      ></div>
      {href ? (
        <a
          className={cn(
            'relative p-4 rounded-full cursor-pointer w-[52px] h-[52px]group max-h-[52px] max-w-[52px]',
            bgClass
          )}
          // ref={wrapperRef}
          href={href}
          target="_blank"
        >
          <FontAwesomeIcon
            className="z-10 w-5 h-5 text-white duration-200 max-w-5 max-h-5 group-hover:scale-150"
            icon={icon}
          />
        </a>
      ) : (
        <div
          className={cn(
            'relative p-4 rounded-full cursor-pointer fab w-[52px] h-[52px]group max-h-[52px] max-w-[52px]',
            bgClass
          )}
          onClick={onClick}
          // ref={wrapperRef}
        >
          <FontAwesomeIcon
            className="z-10 w-5 h-5 text-white duration-200 max-w-5 max-h-5 group-hover:scale-150"
            icon={icon}
          />
        </div>
      )}
    </div>
  )
}

export default Fab
