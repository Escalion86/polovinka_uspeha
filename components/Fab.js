import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import cn from 'classnames'

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
        'z-10 transition duration-300 flex flex-col justify-end fixed right-7',
        show
          ? // 'fab-top'
            'bottom-10'
          : '-bottom-20'
      )}
    >
      <div
        className={cn(
          'absolute animate-ping w-12 h-12 max-h-12 max-w-12 rounded-full',
          bgClass
        )}
      ></div>
      {href ? (
        <a
          className={cn(
            'relative flex items-center justify-center rounded-full cursor-pointer w-12 h-12 group max-h-12 max-w-12',
            bgClass
          )}
          // ref={wrapperRef}
          href={href}
          target="_blank"
        >
          <FontAwesomeIcon
            className="z-10 w-6 h-6 text-white duration-200 max-w-6 max-h-6 group-hover:scale-125"
            icon={icon}
          />
        </a>
      ) : (
        <div
          className={cn(
            'relative flex items-center justify-center rounded-full cursor-pointer fab w-12 h-12 group max-h-12 max-w-12',
            bgClass
          )}
          onClick={onClick}
          // ref={wrapperRef}
        >
          <FontAwesomeIcon
            className="z-10 w-6 h-6 text-white duration-200 max-w-6 max-h-6 group-hover:scale-125"
            icon={icon}
          />
        </div>
      )}
    </div>
  )
}

export default Fab
