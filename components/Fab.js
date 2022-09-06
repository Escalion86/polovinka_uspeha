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
        // transition={{ ease: 'linear' }}
        // onBlur={() => setOpened(true)}

        className="relative p-4 duration-300 rounded-full cursor-pointer bg-general hover:scale-110"
        onClick={onClick}
      >
        <FontAwesomeIcon className="z-10 w-5 h-5 text-white" icon={faPlus} />
      </div>
    </div>
  )
}

export default Fab
