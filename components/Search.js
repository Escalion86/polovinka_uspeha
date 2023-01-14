import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import cn from 'classnames'

const Search = ({ searchText, show, onChange, className }) => {
  const inputRef = useRef()

  useEffect(() => inputRef?.current?.focus(), [inputRef])

  return (
    <motion.div
      // initial={{}}
      animate={{ height: show ? 'auto' : 0 }}
      transition={{ type: 'just' }}
      className={cn('flex flex-wrap justify-end overflow-hidden', className)}
    >
      <div
        className={cn(
          'flex w-full gap-1 items-center border-gray-700 border p-1 bg-white rounded my-0.5'
          // { hidden: !isMenuOpen }
        )}
      >
        <input
          ref={inputRef}
          className="flex-1 bg-transparent outline-none"
          type="text"
          value={searchText}
          onChange={(e) => onChange(e.target.value)}
        />
        <FontAwesomeIcon
          className={'w-6 h-6 text-gray-700 cursor-pointer'}
          icon={searchText ? faTimes : faSearch}
          onClick={
            searchText ? () => onChange('') : () => inputRef.current.focus()
          }
        />
      </div>
    </motion.div>
  )
}

export default Search
