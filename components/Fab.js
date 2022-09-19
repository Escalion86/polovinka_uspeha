import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import cn from 'classnames'

const Fab = ({ onClick = () => {}, show = true }) => {
  return (
    <div
      className={cn(
        'duration-300 flex flex-col justify-end absolute right-8',
        show ? 'fab-top' : '-bottom-20'
      )}
    >
      <div
        className="relative p-4 rounded-full cursor-pointer w-13 h-13 bg-general group max-h-13 max-w-13"
        onClick={onClick}
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
