import React, { useRef } from 'react'
import QuillEditor from './QuillEditor'
import InputWrapper from './InputWrapper'
import cn from 'classnames'
import { useState } from 'react'
import { useEffect } from 'react'

// const Delta = Quill.import('delta')

const EditableTextarea = ({
  className,
  html = '',
  disabled,
  onChange,
  onBlur,
  placeholder,
  onSave,
  labelClassName,
  wrapperClassName,
  btnSaveName = 'Сохранить',
  disableUndo = false,
  label,
  required,
  error,
}) => {
  const [Q, setQ] = useState()
  // const [range, setRange] = useState()
  // const [lastChange, setLastChange] = useState()
  // const [readOnly, setReadOnly] = useState(false)

  // Use a ref to access the quill instance directly
  const quillRef = useRef()

  useEffect(() => {
    setQ(QuillEditor)
  }, [])

  return (
    <InputWrapper
      label={label}
      labelClassName={labelClassName}
      onChange={onChange}
      // copyPasteButtons={false}
      value={html}
      className={cn('', wrapperClassName)}
      // paddingY={false}
      required={required}
      fullWidth={false}
      paddingY="small"
      paddingX={false}
      disabled={disabled}
    >
      {Q && (
        <Q
          ref={quillRef}
          readOnly={disabled}
          defaultValue={html}
          // onSelectionChange={setRange}
          // onTextChange={setLastChange}
          onChange={onChange}
        />
      )}
      {/* <div class="controls">
        <label>
          Read Only:{' '}
          <input
            type="checkbox"
            value={readOnly}
            onChange={(e) => setReadOnly(e.target.checked)}
          />
        </label>
        <button
          className="controls-right"
          type="button"
          onClick={() => {
            alert(quillRef.current?.getLength())
          }}
        >
          Get Content Length
        </button>
      </div>
      <div className="state">
        <div className="state-title">Current Range:</div>
        {range ? JSON.stringify(range) : 'Empty'}
      </div>
      <div className="state">
        <div className="state-title">Last Change:</div>
        {lastChange ? JSON.stringify(lastChange.ops) : 'Empty'}
      </div> */}
    </InputWrapper>
  )
}

export default EditableTextarea
