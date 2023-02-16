import React from 'react'

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
  const Emoji = require('quill-emoji')
  // import * as Emoji from 'quill-emoji'
  ReactQuill.Quill.register('modules/emoji', Emoji)

  return (
    <ReactQuill
      modules={modules}
      // formats={formats}
      theme="snow"
      value={uncontrolled ? textHtml : html}
      onChange={
        onChange
        //   (value) => {
        //   const sanitizedValue = sanitize(value)
        //   if (uncontrolled) setTextHtml(sanitizedValue)
        //   else onChange && onChange(sanitizedValue)
        // }
      }
    />
  )
}

export default EditableTextarea
