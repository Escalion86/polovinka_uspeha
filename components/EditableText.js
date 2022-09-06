import { useState, useEffect } from 'react'

import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import cn from 'classnames'
import { EditText } from 'react-edit-text'
import { LoadingSpinner } from '.'

const EditableText = ({
  className,
  value,
  onChange,
  onSave,
  readonly = false,
  textClass,
  style,
  inline,
  placeholder,
  uncontrolled = true,
}) => {
  const [text, setText] = useState(value)
  const [isSaveProcess, setIsSaveProcess] = useState(false)

  const save = async () => {
    if (onSave) {
      uncontrolled && setIsSaveProcess(true)
      await onSave(text)
    }
  }

  useEffect(() => {
    if (value !== text) setText(value)
    uncontrolled && setIsSaveProcess(false)
  }, [value])

  return (
    <div className={cn('w-full flex', className)}>
      {readonly ? (
        <div className={'flex-1 px-1 m-0'}>{text}</div>
      ) : (
        <div
          className={cn(
            'flex items-center w-full border-b ',
            isSaveProcess ? 'border-transparent' : 'bg-white border-purple-600'
          )}
        >
          <EditText
            style={{ minHeight: 28, ...style }}
            inline={inline}
            className={cn(
              'flex-1 px-1 py-0 m-0 whitespace-normal  outline-none items-center ',
              textClass
            )}
            value={uncontrolled ? text : value}
            // inline
            onChange={(newValue) => {
              if (uncontrolled) setText(newValue)
              else onChange && onChange(newValue)
            }}
            readonly={uncontrolled && isSaveProcess}
            // onSave={({ value }) => onSave && onSave(value)}
            placeholder={placeholder}
            // onEditMode={() => setIsEditProcess(true)}
            // onBlur={() => setIsEditProcess(false)}
          />
          {uncontrolled && !isSaveProcess && value !== text && (
            <>
              <div
                className={
                  'border-transparent border hover:border-danger p-1 rounded-full relative duration-300 hover:scale-125 flex items-center w-6 h-6 justify-center text-danger'
                }
                style={{ width: 20 }}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setText(value)
                  // deleteTask()
                }}
              >
                <FontAwesomeIcon icon={faTimes} />
              </div>
              <div
                className={
                  'border-transparent border hover:border-success p-1 rounded-full relative duration-300 hover:scale-125 flex items-center w-6 h-6 justify-center text-success'
                }
                style={{ width: 20 }}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  save()
                  // deleteTask()
                }}
              >
                <FontAwesomeIcon icon={faCheck} />
              </div>
            </>
          )}
          {uncontrolled && isSaveProcess && (
            <>
              <LoadingSpinner size="xs" />
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default EditableText
