'use client'

import React, {
  forwardRef,
  useEffect,
  useLayoutEffect,
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
    // ['club'],
  ],
}

const QuillEditor = forwardRef(
  (
    {
      readOnly,
      defaultValue,
      onTextChange,
      onSelectionChange,
      onChange,
      customButtons,
    },
    ref
  ) => {
    const containerRef = useRef(null)
    const quillRef = useRef(null)
    const lastDefaultValueRef = useRef(defaultValue)
    // const defaultValueRef = useRef(defaultValue)
    const onTextChangeRef = useRef(onTextChange)
    const onSelectionChangeRef = useRef(onSelectionChange)
    const onChangeRef = useRef(onChange)

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
      if (!quillRef.current) {
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

          const toolbar = !customButtons
            ? toolbarOptions
            : {
                handlers: {
                  ...toolbarOptions.handlers,
                  ...customButtons.handlers,
                },
                container: [
                  ...toolbarOptions.container,
                  ...customButtons.container,
                ],
              }

          if (customButtons) {
            const icons = Quill.import('ui/icons')
            const robotIcon = `
              <svg version="1.0"
                aria-hidden="true"
                focusable="false"
                viewBox="0 0 512 512"
                class="w-6 h-6 min-h-6 -mt-1"
                xmlns="http://www.w3.org/2000/svg">

<g class="fill-general hover:fill-success"  transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" stroke="none">
<path d="M2480 4828 c-18 -13 -43 -36 -54 -51 -20 -27 -21 -41 -24 -403 l-3
-374 -159 0 -159 0 -3 214 c-3 199 -4 217 -24 243 -73 98 -195 98 -268 0 -20
-26 -21 -44 -24 -243 l-3 -214 -58 0 c-77 0 -198 -32 -274 -72 -80 -42 -193
-155 -235 -235 -40 -76 -72 -197 -72 -274 l0 -58 -214 -3 c-199 -3 -217 -4
-243 -24 -98 -73 -98 -195 0 -268 26 -20 44 -21 243 -24 l214 -3 0 -159 0
-159 -374 -3 c-362 -3 -376 -4 -403 -24 -48 -35 -73 -82 -73 -134 0 -52 25
-99 73 -134 27 -20 41 -21 403 -24 l374 -3 0 -159 0 -159 -214 -3 c-199 -3
-217 -4 -243 -24 -98 -73 -98 -195 0 -268 26 -20 44 -21 243 -24 l214 -3 0
-58 c0 -77 32 -198 72 -274 42 -80 155 -193 235 -235 76 -40 197 -72 274 -72
l58 0 3 -214 c3 -199 4 -217 24 -243 73 -98 195 -98 268 0 20 26 21 44 24 243
l3 214 159 0 159 0 3 -374 c3 -362 4 -376 24 -403 73 -98 195 -98 268 0 20 27
21 41 24 403 l3 374 159 0 159 0 3 -214 c3 -199 4 -217 24 -243 73 -98 195
-98 268 0 20 26 21 44 24 243 l3 214 58 0 c76 0 197 32 274 72 80 41 192 154
235 235 40 76 72 197 72 274 l0 58 214 3 c238 3 244 5 294 78 45 66 23 159
-51 214 -26 20 -44 21 -243 24 l-214 3 0 159 0 159 374 3 c362 3 376 4 403 24
48 35 73 82 73 134 0 52 -25 99 -73 134 -27 20 -41 21 -403 24 l-374 3 0 159
0 159 214 3 c199 3 217 4 243 24 98 73 98 195 0 268 -26 20 -44 21 -243 24
l-214 3 0 58 c0 77 -32 198 -72 274 -43 81 -155 194 -235 235 -77 40 -198 72
-274 72 l-58 0 -3 214 c-3 199 -4 217 -24 243 -73 98 -195 98 -268 0 -20 -26
-21 -44 -24 -243 l-3 -214 -159 0 -159 0 -3 374 c-3 362 -4 376 -24 403 -35
48 -82 73 -134 73 -32 0 -57 -7 -80 -22z m52 -1707 c105 -41 193 -134 223
-235 22 -73 22 -783 0 -826 -49 -94 -179 -114 -253 -37 -41 42 -52 81 -52 184
l0 83 -160 0 -160 0 0 -100 c0 -137 -28 -185 -121 -210 -77 -21 -166 31 -189
111 -14 48 -13 684 1 751 24 111 90 203 181 253 85 47 136 55 313 51 136 -2
168 -6 217 -25z m657 19 c46 -13 99 -65 111 -110 13 -48 13 -893 0 -942 -14
-49 -76 -104 -129 -113 -53 -9 -126 25 -158 74 l-23 34 0 477 0 477 23 34 c22
33 95 79 127 79 8 0 31 -4 49 -10z"/>
<path d="M2150 2810 c-18 -18 -20 -31 -18 -108 l3 -87 158 -3 157 -3 0 95 c0
125 -2 126 -162 126 -105 0 -120 -2 -138 -20z"/>
</g>
</svg>
            `

            for (const key in customButtons.handlers) {
              icons[key] =
                key === 'ИИ'
                  ? robotIcon
                  : `<div class="text-sm -ml-[9px] -mt-px">${key}</div>`
            }
          }
          const quill = new Quill(
            // '#quill-editor'
            editorContainer,
            {
              theme: 'snow',
              modules: {
                toolbar,
                // 'emoji-toolbar': true,
                // 'emoji-textarea': true,
                // 'emoji-shortname': true,
              },
            }
          )
          quillRef.current = quill
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
            lastDefaultValueRef.current = defaultValue
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

    useEffect(() => {
      const quill = quillRef.current
      if (!quill || defaultValue === undefined) return

      if (lastDefaultValueRef.current === defaultValue) return

      const normalizeHtml = (value) =>
        value && value.trim() ? value.trim() : '<p><br></p>'

      const currentHtml = normalizeHtml(quill.root.innerHTML)
      const preparedDefaultValue = normalizeHtml(defaultValue)

      if (currentHtml === preparedDefaultValue) {
        lastDefaultValueRef.current = defaultValue
        return
      }

      quill.clipboard.dangerouslyPasteHTML(defaultValue)
      lastDefaultValueRef.current = defaultValue
    }, [defaultValue])

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

    return <div className="w-full" id="quill-editor" ref={containerRef}></div>
  }
)

QuillEditor.displayName = 'QuillEditor'

export default QuillEditor
