import React, { useEffect, useRef, useState } from 'react'

import {
  faAlignCenter,
  faAlignJustify,
  faAlignLeft,
  faAlignRight,
  faBan,
  faBold,
  faCheck,
  faEraser,
  faFont,
  faGlobe,
  faHeading,
  faItalic,
  faNetworkWired,
  faPencilAlt,
  faRedo,
  faStrikethrough,
  faSubscript,
  faSuperscript,
  faUnderline,
  faUndo,
  faWindowMinimize,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import cn from 'classnames'
import ContentEditable from 'react-contenteditable'
import { Divider, LoadingSpinner } from '.'
import Button from './Button'
import InputWrapper from './InputWrapper'
import sanitize from '@helpers/sanitize'

const TextareaButton = ({
  icon,
  cmd,
  arg,
  iconClassName,
  disabled = false,
  onMouseDown,
}) => (
  <button
    className={
      'flex items-center justify-center w-6 h-6 p-1 text-black duration-200 border border-gray-400 rounded max-h-8 max-w-8 hover:text-general'
    }
    onMouseDown={(evt) => {
      evt.preventDefault() // Avoids loosing focus from the editable area
      if (onMouseDown) onMouseDown(evt)
      else document.execCommand(cmd, false, arg) // Send the command to the browser
    }}
  >
    <FontAwesomeIcon icon={icon} className={iconClassName ?? 'w-5 h-5'} />
  </button>
)

const GroupButtons = ({ name, children }) => (
  <div className="flex flex-col p-1 border border-gray-300 rounded gap-y-1">
    <div className="flex justify-center text-sm">{name}</div>
    <div className="flex gap-x-1">{children}</div>
  </div>
)

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
  uncontrolled = true,
  btnSaveName = 'Сохранить',
  disableUndo = false,
  label,
  required,
  error,
}) => {
  const [textHtml, setTextHtml] = useState(html)
  const [isSaveProcess, setIsSaveProcess] = useState(false)
  // const [inputRef, setInputFocus] = useFocus()
  // const inputRef = useRef(null)

  // if (inputRef?.current) {
  //   console.log('inputRef', inputRef.current)
  // }

  // console.log('html', uncontrolled ? textHtml : html)

  // const [editorState, setEditorState] = useState(() =>
  //   EditorState.createEmpty()
  // )

  const saveTask = async () => {
    if (onSave) {
      uncontrolled && setIsSaveProcess(true)
      await onSave(textHtml)
    }
  }

  useEffect(() => {
    if (uncontrolled && isSaveProcess && html === textHtml)
      setIsSaveProcess(false)
    if (html !== textHtml) setTextHtml(html)
  }, [html])

  // return (
  //   <div>
  //     <Editor editorState={editorState} onChange={setEditorState} />
  //   </div>
  // )

  return (
    <>
      {/* {label && <div className="text-right">{label}</div>} */}
      <InputWrapper
        label={label}
        labelClassName={labelClassName}
        onChange={onChange}
        copyPasteButtons={false}
        value={html}
        className={wrapperClassName}
        required={required}
      >
        <div
          className={cn(
            'w-full bg-white border rounded',
            error ? 'border-red-500' : 'border-gray-400'
          )}
        >
          <div className="flex flex-wrap gap-1 p-1">
            <GroupButtons name="Стиль">
              <TextareaButton cmd="italic" icon={faItalic} />
              <TextareaButton cmd="bold" icon={faBold} />
              <TextareaButton cmd="underline" icon={faUnderline} />
              <TextareaButton cmd="strikeThrough" icon={faStrikethrough} />
              <TextareaButton cmd="subscript" icon={faSubscript} />
              <TextareaButton cmd="superscript" icon={faSuperscript} />
              <TextareaButton cmd="removeFormat" icon={faEraser} />
            </GroupButtons>
            <GroupButtons name="Размер">
              <TextareaButton
                cmd="fontSize"
                icon={faFont}
                arg="2"
                iconClassName="w-2 h-2"
              />
              <TextareaButton
                cmd="fontSize"
                icon={faFont}
                arg="3"
                iconClassName="w-2.5 h-2.5"
              />
              <TextareaButton
                cmd="fontSize"
                icon={faFont}
                arg="4"
                iconClassName="w-3 h-3"
              />
              <TextareaButton
                cmd="fontSize"
                icon={faFont}
                arg="5"
                iconClassName="w-3.5 h-3.5"
              />
              <TextareaButton
                cmd="fontSize"
                icon={faFont}
                arg="6"
                iconClassName="w-4 h-4"
              />
              <TextareaButton
                cmd="fontSize"
                icon={faFont}
                arg="7"
                iconClassName="w-5 h-5"
              />
            </GroupButtons>
            <GroupButtons name="Выравнивание">
              <TextareaButton cmd="justifyLeft" icon={faAlignLeft} />
              <TextareaButton cmd="justifyCenter" icon={faAlignCenter} />
              <TextareaButton cmd="justifyRight" icon={faAlignRight} />
              <TextareaButton cmd="justifyFull" icon={faAlignJustify} />
            </GroupButtons>
            {/* <GroupButtons name="Тест">
              // <TextareaButton
              //   cmd="createLink"
              //   arg="https://github.com/lovasoa/react-contenteditable"
              //   icon={faNetworkWired}
              // /> 
              <CreateLinkButton
              // setInputFocus={setInputFocus}
              />
            </GroupButtons>*/}
            {/* <EditButton
          cmd="createLink"
          arg="https://github.com/lovasoa/react-contenteditable"
          name="hyperlink"
        /> */}
            {/* <GroupButtons name="Тест">
              <TextareaButton
                cmd="hiliteColor"
                icon={faAlignLeft}
                arg="#123456"
              />
              <TextareaButton
                cmd="foreColor"
                icon={faAlignLeft}
                arg="#EE0000"
              />
              <TextareaButton
                cmd="insertHorizontalRule"
                icon={faWindowMinimize}
              />

              <TextareaButton cmd="undo" icon={faUndo} />
              <TextareaButton cmd="redo" icon={faRedo} />
              <TextareaButton cmd="redo" icon={faRedo} /> */}
            {/* <TextareaButton cmd="justifyCenter" icon={faAlignCenter} />
              <TextareaButton cmd="justifyRight" icon={faAlignRight} />
              <TextareaButton cmd="justifyFull" icon={faAlignJustify} /> */}
            {/* </GroupButtons> */}
            {/* <GroupButtons name="Список">
          <Button cmd="superscript" icon={faAlignLeft} />
        </GroupButtons> */}
          </div>
          <Divider thin light />
          <ContentEditable
            // innerRef={inputRef}
            className={cn(
              'textarea px-1 outline-none list-disc my-1',
              className
            )}
            html={uncontrolled ? textHtml : html}
            disabled={disabled}
            onChange={(e) => {
              const sanitizedValue = sanitize(e.target.value)
              if (uncontrolled) setTextHtml(sanitizedValue)
              else onChange && onChange(sanitizedValue)
            }}
            onBlur={onBlur}
            placeholder={placeholder}
          />

          {uncontrolled && (
            <>
              <Divider thin light />
              <div className="flex justify-between py-1">
                {(!uncontrolled || !isSaveProcess) && (
                  <>
                    {!disableUndo && (
                      <Button
                        onClick={() => setTextHtml(html)}
                        classBgColor="bg-gray-700"
                        name="Отменить изменения"
                        disabled={html === textHtml}
                      />
                    )}
                    {onSave && (
                      <div className="flex justify-end flex-1">
                        <Button
                          onClick={saveTask}
                          classBgColor="bg-blue-700"
                          name={btnSaveName}
                          disabled={html === textHtml}
                        />
                      </div>
                    )}
                  </>
                )}
                {uncontrolled && isSaveProcess && (
                  <div className="flex items-center gap-2">
                    <span>Сохранение...</span>
                    <LoadingSpinner size="xs" />
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </InputWrapper>
    </>
  )
}

export default EditableTextarea
