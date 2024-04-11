'use client'

import React, {
  forwardRef,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
// import dynamic from 'next/dynamic'
// import Script from 'next/script'
import Quill from 'quill'
// const Quill = dynamic(() => import('quill'), { ssr: false }).default
// import * as Emoji from 'quill-emoji'
// Editor is an uncontrolled React component
// import Quill from 'quill/core'
// const Quill = dynamic(() => import('quill'), { ssr: false }).default
// const Emoji = dynamic(() => import('quill-emoji'), { ssr: false })
// import Quill from 'quill'

// import * as Emoji from 'quill-emoji'

// Quill.register('modules/emoji', require('quill-emoji'))

const toolbarOptions = {
  // container: [['bold', 'italic', 'underline', 'strike'], ['emoji']],
  // handlers: { emoji: function () {} },

  handlers: {
    link: function (value) {
      if (value) {
        const href = prompt('Введите адрес ссылки')
        if (href) {
          this.quill.format('link', href)
          this.quill.format('color', false)
        }
      } else {
        this.quill.format('link', false)
        // this.quill.format('color', false)
        // this.quill.format('underline', false)
      }
    },
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
    emoji: function () {},
    // polovinkauspeha: () => {
    //   //whatever action you want to perform here
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
    // ['emoji'],
    // ['polovinkauspeha'],
    ['clean'],
  ],
}

const QuillEditor = forwardRef(
  (
    { readOnly, defaultValue, onTextChange, onSelectionChange, onChange },
    ref
  ) => {
    const containerRef = useRef(null)
    // const defaultValueRef = useRef(defaultValue)
    const onTextChangeRef = useRef(onTextChange)
    const onSelectionChangeRef = useRef(onSelectionChange)
    const onChangeRef = useRef(onChange)

    var quill
    // const [loading, setLoading] = useState(false)
    // const [ReactQuill, setReactQuill] = useState(null)

    // const Quill = useMemo(
    //   () =>
    //     dynamic(() => import('quill'), {
    //       loading: () => {
    //         useEffect(() => {
    //           setLoading(true)
    //           return () => setLoading(false)
    //         }, [])
    //         return <p>loading...</p>
    //       },
    //       ssr: false,
    //     }),
    //   []
    // )

    // console.log('Quill :>> ', Quill)
    // const Quill = require('quill').default
    // const Quill = import('quill').default

    // if (!Quill.imports['modules/emoji'])
    // useEffect(() => {
    // Quill.register('modules/emoji', require('quill-emoji'))
    // }, [])

    // if (!Quill.Quill.imports['modules/emoji'])
    //   Quill.Quill.register('modules/emoji', require('quill-emoji'))

    useLayoutEffect(() => {
      onTextChangeRef.current = onTextChange
      onSelectionChangeRef.current = onSelectionChange
      onChangeRef.current = onChange
    })

    // useEffect(() => {
    //   ref?.current?.enable(!readOnly)
    // }, [ref, readOnly])

    // useEffect(() => {
    //   if (typeof window !== 'undefined') {
    //     import('quill').then((QuillModule) => {
    //       setReactQuill(() => QuillModule.default)
    //     })

    //   }
    // }, [])

    useEffect(() => {
      // if (!loading) {
      // const quilLoader = async () => {
      // const Quill = await import('quill')
      // console.log('Quill :>> ', Quill)
      if (!quill) {
        const init = async () => {
          const container = containerRef.current
          const editorContainer = container.appendChild(
            container.ownerDocument.createElement('div')
          )

          // const quillEmoji = new QuillEmoji()
          // Quill.register('modules/emoji-shortname', QuillEmoji.ShortNameEmoji)
          // console.log(QuillEmoji)
          // Quill.import(QuillEmoji)

          // class CustomModule extends Module {}

          // Quill.register('modules/emoji', 'quill-emoji')
          // const Emoji = await import('quill-emoji')
          // Quill.register('modules/emoji', Emoji)

          // if (!Quill.imports['modules/emoji'])

          // Quill.register({ 'modules/emoji-toolbar': Emoji })

          quill = new Quill(
            // '#quill-editor'
            editorContainer,
            {
              theme: 'snow',
              modules: {
                toolbar: toolbarOptions,
                // 'emoji-toolbar': true,
                // 'emoji-textarea': true,
                // 'emoji-shortname': true,
              },
            }
          )
          // console.log('quill :>> ', quill)
          // Quill.register({ 'modules/emoji': require('quill-emoji') })

          // ref.current = quill

          // console.log('quill :>> ', quill)
          // quill.set

          if (
            defaultValue
            //defaultValueRef.current
          ) {
            //   // quill.setContents(defaultValueRef.current)
            //   // console.log(quill)
            //   // quill.pasteHTML(defaultValue)
            quill.clipboard.dangerouslyPasteHTML(defaultValue)
          }

          quill.on(Quill.events.TEXT_CHANGE, (...args) => {
            onTextChangeRef.current?.(...args)
            onChangeRef.current?.(quill.root.innerHTML)
          })

          quill.on(Quill.events.SELECTION_CHANGE, (...args) => {
            onSelectionChangeRef.current?.(...args)
          })

          return () => {
            // ref.current = null
            // container.innerHTML = ''
          }
          // }
          // const res = quilLoader()
          // return res
          // }
        }
        init()
      }
    }, [ref])

    // if (typeof window !== 'undefined' && ReactQuill) {
    //   const quill = ReactQuill // Save a reference to ReactQuill
    //   console.log(quill)
    //   // return (
    //   //   <quill
    //   //     // ref={quillRef}
    //   //     // value={form.watch(name)}
    //   //     theme="snow"
    //   //     // modules={module}
    //   //     // onChange={handleChange}
    //   //     placeholder="Write something awesome..."
    //   //   />
    //   // )
    // }

    // return <DynamicTextEditor />

    return <div id="quill-editor" ref={containerRef}></div>
  }
)

QuillEditor.displayName = 'QuillEditor'

export default QuillEditor
