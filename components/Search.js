import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch'
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useDebounceEffect } from '@helpers/useDebounceEffect'
import cn from 'classnames'
import { m } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

const Search = ({
  searchText,
  show,
  onChange,
  className,
  debounceDelay = 500,
}) => {
  const inputRef = useRef()

  const [text, setText] = useState(searchText)

  const debouncedSearchTerm = useDebounceEffect(text, debounceDelay)

  useEffect(() => {
    onChange(debouncedSearchTerm)
  }, [debouncedSearchTerm])

  useEffect(() => {
    if (show) inputRef?.current?.focus()
  }, [inputRef, show])

  return (
    <m.div
      initial={{ height: 0, minHeight: 0 }}
      animate={{ height: show ? 38 : 0, minHeight: show ? 38 : 0 }}
      transition={{ type: 'just' }}
      className={cn(
        'relative flex flex-wrap justify-end overflow-hidden',
        className
      )}
    >
      <div className="min-h-[34px] h-[34px] absolute bottom-0 left-0 right-0 flex w-full gap-1 items-center border-gray-700 border p-1 bg-white rounded my-0.5">
        <input
          ref={inputRef}
          className="flex-1 bg-transparent outline-none"
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          aria-label="Search"
        />
        <FontAwesomeIcon
          className={'w-6 h-6 text-gray-700 cursor-pointer'}
          icon={text ? faTimes : faSearch}
          onClick={text ? () => setText('') : () => inputRef.current.focus()}
        />
      </div>
    </m.div>
  )
}

export default Search
