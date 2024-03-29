import cn from 'classnames'
import InputWrapper from './InputWrapper'

const modules = {
  toolbar: {
    handlers: {
      //   // handlers object will be merged with default handlers object
      //   link: function (value) {
      //     if (value) {
      //       var href = prompt('Введите ссылку')
      //       this.quill.format('link', href)
      //     } else {
      //       this.quill.format('link', false)
      //     }
      //   },
      // 'list-logo': function () {
      //   console.log('!', this.quill.getSelection())
      //   // alert('DAGUR')
      //   this.quill.insertText(
      //     this.quill.getSelection().index,
      //     '<img class="logo"><li></li></img>'
      //   )
      // },
    },
    container: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'], // toggled buttons
      [
        'blockquote',
        // 'code-block'
      ],

      // [{ header: 1 }, { header: 2 }], // custom button values

      [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
      [
        { list: 'ordered' },
        { list: 'bullet' },
        // 'list-logo'
      ],
      // [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
      // [{ direction: 'rtl' }], // text direction

      // [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown

      [{ color: [] }, { background: [] }],
      // [{ font: [] }],
      [{ align: ['', 'right', 'center'] }],
      [
        'link',
        // 'image'
      ],
      ['emoji'],
      ['clean'],
    ],
  },
  'emoji-toolbar': true,
  // 'emoji-textarea': true,
  // 'emoji-shortname': true,
}

// const formats = [
//   'header',
//   'bold',
//   'italic',
//   'underline',
//   'strike',
//   'blockquote',
//   'list',
//   'bullet',
//   'indent',
//   'link',
//   'image',
// ]

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
  if (typeof window !== 'object') return null

  const ReactQuill = require('react-quill')

  // import * as Emoji from 'quill-emoji'
  // console.log('ReactQuill.Quill', ReactQuill.Quill)
  if (!ReactQuill.Quill.imports['modules/emoji'])
    ReactQuill.Quill.register('modules/emoji', require('quill-emoji'))

  // ReactQuill.Quill.debug('info')

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
    >
      <ReactQuill
        className="w-full"
        modules={modules}
        // formats={formats}
        theme="snow"
        value={html}
        onChange={onChange}
      />
    </InputWrapper>
  )
}

export default EditableTextarea

// import {
//   EditorState,
//   ContentState,
//   convertToRaw,
//   convertFromHTML,
// } from 'draft-js'

// const formats = [
//   'header',
//   'bold',
//   'italic',
//   'underline',
//   'strike',
//   'blockquote',
//   'list',
//   'bullet',
//   'indent',
//   'link',
//   'image',
// ]

// const EditableTextarea = ({
//   className,
//   html = '',
//   disabled,
//   onChange,
//   onBlur,
//   placeholder,
//   onSave,
//   labelClassName,
//   wrapperClassName,
//   uncontrolled = true,
//   btnSaveName = 'Сохранить',
//   disableUndo = false,
//   label,
//   required,
//   error,
// }) => {
//   const blocksFromHTML = convertFromHTML(html)
//   const state = ContentState.createFromBlockArray(
//     blocksFromHTML.contentBlocks,
//     blocksFromHTML.entityMap
//   )

//   const [editorState, setEditorState] = useState(
//     EditorState.createWithContent(state)
//   )

//   console.log('editorState :>> ', editorState)
//   if (typeof window !== 'object') return null
//   // import { Editor } from 'react-draft-wysiwyg'
//   const { Editor } = require('react-draft-wysiwyg')
//   // const ReactQuill = require('react-quill')

//   // import * as Emoji from 'quill-emoji'
//   // console.log('ReactQuill.Quill', ReactQuill.Quill)
//   // if (!ReactQuill.Quill.imports['modules/emoji'])
//   //   ReactQuill.Quill.register('modules/emoji', require('quill-emoji'))

//   // ReactQuill.Quill.debug('info')

//   return (
//     <InputWrapper
//       label={label}
//       labelClassName={labelClassName}
//       onChange={onChange}
//       // copyPasteButtons={false}
//       value={html}
//       className={cn('', wrapperClassName)}
//       // paddingY={false}
//       required={required}
//       fullWidth={false}
//       paddingY="small"
//       paddingX={false}
//     >
//       {/* <ReactQuill
//         className="w-full"
//         modules={modules}
//         // formats={formats}
//         theme="snow"
//         value={html}
//         onChange={onChange}
//       /> */}
//       <Editor
//         editorState={editorState}
//         toolbarClassName="toolbarClassName"
//         wrapperClassName="wrapperClassName"
//         editorClassName="editorClassName"
//         onEditorStateChange={setEditorState}
//         toolbar={{
//           inline: { inDropdown: true },
//           list: { inDropdown: true },
//           textAlign: { inDropdown: true },
//           link: { inDropdown: true },
//           history: { inDropdown: true },
//           emoji: { inDropdown: false },
//         }}
//       />
//     </InputWrapper>
//   )
// }

// export default EditableTextarea
