import React from 'react'
import dynamic from 'next/dynamic'
const QuillEditor = dynamic(() => import('./QuillEditor'), { ssr: false })
// import QuillEditor from './QuillEditor'
import InputWrapper from './InputWrapper'
// import cn from 'classnames'
import { Suspense } from 'react'

// const Delta = Quill.import('delta')

const EditableTextarea = ({
  className,
  html = '',
  disabled,
  onChange,
  labelClassName,
  label,
  required,
  error,
  customButtons,
}) => {
  // const [range, setRange] = useState()
  // const [lastChange, setLastChange] = useState()
  // const [readOnly, setReadOnly] = useState(false)

  // const prepearedText = DOMPurify.sanitize(html, {
  //   ALLOWED_TAGS: [],
  //   ALLOWED_ATTR: [],
  // })
  // console.log('prepearedText :>> ', prepearedText)
  // const test = replaceVariableInTextTemplate(prepearedText, {
  //   club: true,
  //   male: true,
  // })
  // console.log('text', test)
  // console.log('prepearedText :>> ', prepearedText)
  return (
    <InputWrapper
      label={label}
      labelClassName={labelClassName}
      value={html}
      className={className}
      // paddingY={false}
      required={required}
      fullWidth={false}
      paddingY="small"
      paddingX={false}
      disabled={disabled}
      error={error}
    >
      {/* <Script src="https://cdn.jsdelivr.net/npm/quill@2.0.0-rc.5/dist/quill.js"></Script> */}
      <Suspense>
        <QuillEditor
          readOnly={disabled}
          defaultValue={html}
          // onSelectionChange={setRange}
          // onTextChange={setLastChange}
          onChange={onChange}
          customButtons={customButtons}
        />
      </Suspense>
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
