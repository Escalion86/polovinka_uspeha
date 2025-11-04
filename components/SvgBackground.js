// import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import modalsFuncAtom from '@state/modalsFuncAtom'
import { useState } from 'react'
import { useAtomValue } from 'jotai'
// import Button from './Button'
import ColorPicker from './ColorPicker'
import ComboBox from './ComboBox'
// import Input from './Input'
import InputWrapper from './InputWrapper'
import { useEffect } from 'react'
// import InputImage from './InputImage'
// import locationPropsSelector from '@state/selectors/locationPropsSelector'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash'
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus'

import cn from 'classnames'
import InputNumber from './InputNumber'

// function urlToBase64(url) {
//   return fetch(url)
//     .then((response) => response.blob())
//     .then(
//       (blob) =>
//         new Promise((resolve, reject) => {
//           const reader = new FileReader()
//           reader.onloadend = () => resolve(reader.result)
//           reader.onerror = reject
//           reader.readAsDataURL(blob)
//         })
//     )
//     .then((dataUrl) => dataUrl.split(',')[1])
// }

function urlToBase64(url, callback) {
  var img = new Image()
  img.crossOrigin = 'Anonymous' // Allow cross-origin images
  img.onload = function () {
    var canvas = document.createElement('canvas')
    var ctx = canvas.getContext('2d')
    canvas.width = img.width
    canvas.height = img.height
    ctx.drawImage(img, 0, 0)
    var dataURL = canvas.toDataURL('image/png')
    callback(dataURL)
  }
  img.src = url
}

export const SvgBackgroundComponent = ({
  backgroundType = 'color',
  backgroundColor = '#7a5151',
  angle = 45,
  gradient1Color = '#504436',
  gradient2Color = '#7a6a53',
  src = '',
}) => {
  const [srcBase64, setBase64] = useState(src)
  var anglePI = angle * (Math.PI / 180)

  // const onLoad = (e) => {
  //   if (src && !srcBase64) {
  //     console.log('! :>> ')
  //     function getBase64Image(img) {
  //       var canvas = document.createElement('canvas')
  //       canvas.width = img.width
  //       canvas.height = img.height
  //       var ctx = canvas.getContext('2d')
  //       ctx.drawImage(img, 0, 0)
  //       var dataURL = canvas.toDataURL('image/png')
  //       return dataURL.replace(/^data:image\/?[A-z]*;base64,/)
  //     }

  //     var base64 = getBase64Image(document.getElementById('preview'))
  //     setBase64(base64)
  //   }
  // }

  // useEffect(() => {
  //   if (src) {
  //     function getBase64Image(img) {
  //       var canvas = document.createElement('canvas')
  //       canvas.width = img.width
  //       canvas.height = img.height
  //       var ctx = canvas.getContext('2d')
  //       ctx.drawImage(img, 0, 0)
  //       var dataURL = canvas.toDataURL('image/png')
  //       return dataURL.replace(/^data:image\/?[A-z]*;base64,/)
  //     }
  //     var img = document.createElement('img')
  //     var base64 = getBase64Image(img)
  //     setBase64(base64)
  //   }
  // }, [src])

  useEffect(() => {
    if (src) {
      // urlToBase64(src)
      //   .then((base64) => setBase64(base64))
      //   .catch((error) => console.error(error))
      urlToBase64(src, function (base64) {
        // console.log(base64);
        setBase64(base64)
      })
    }
  }, [src])

  return (
    <>
      <defs>
        <linearGradient
          id="Gradient2"
          x1={Math.round(50 + Math.sin(anglePI) * 50) + '%'}
          y1={Math.round(50 + Math.cos(anglePI) * 50) + '%'}
          x2={Math.round(50 + Math.sin(anglePI + Math.PI) * 50) + '%'}
          y2={Math.round(50 + Math.cos(anglePI + Math.PI) * 50) + '%'}
        >
          <stop offset="0%" stopColor={gradient1Color} />
          <stop offset="100%" stopColor={gradient2Color} />
        </linearGradient>
      </defs>
      {(backgroundType === 'gradient' || backgroundType === 'color') && (
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill={
            backgroundType === 'color' ? backgroundColor : 'url(#Gradient2)'
          }
        />
      )}
      {backgroundType === 'image' && (
        <image
          id={'preview'}
          href={src ? srcBase64 : undefined}
          height="100%"
          width="100%"
          // onLoad={onLoad}
        />
      )}
    </>
  )
}

export const SvgBackgroundInput = ({
  value,
  onChange,
  imageAspect,
  rerender,
  imagesFolder,
}) => {
  const modalsFunc = useAtomValue(modalsFuncAtom)
  // const { imageFolder } = useAtomValue(locationPropsSelector)

  // const hiddenFileInput = useRef(null)
  // const addImageClick = () => {
  //   hiddenFileInput.current.click()
  // }

  const [backgroundType, setBackgroundType] = useState(
    value?.backgroundType ?? 'color'
  )
  const [backgroundColor, setBackgroundColor] = useState(
    value?.backgroundColor ?? '#7a5151'
  )
  const [gradient1Color, setGradient1Color] = useState(
    value?.gradient1Color ?? '#7a6a53'
  )
  const [gradient2Color, setGradient2Color] = useState(
    value?.gradient2Color ?? '#504436'
  )
  const [angle, setAngle] = useState(value?.angle ?? 45)
  const [src, setSrc] = useState(value?.src ?? '')

  const set = (value) => {
    onChange({
      backgroundType,
      backgroundColor,
      gradient1Color,
      gradient2Color,
      angle,
      src,
      ...value,
    })
  }

  useEffect(() => {
    setBackgroundType(value?.backgroundType ?? 'color')
    setBackgroundColor(value?.backgroundColor ?? '#7a5151')
    setGradient1Color(value?.gradient1Color ?? '#7a6a53')
    setGradient2Color(value?.gradient2Color ?? '#504436')
    setAngle(value?.angle ?? 45)
    setSrc(value?.src ?? '')
  }, [rerender])

  return (
    <InputWrapper
      label="Фон"
      paddingX="small"
      paddingY={false}
      centerLabel
      fitWidth
    >
      <div className="flex flex-wrap items-center flex-1 gap-x-2">
        <ComboBox
          label="Тип фона"
          // className="w-[108px]"
          style={{ width: '108px' }}
          items={[
            { value: 'color', name: 'Цвет' },
            { value: 'gradient', name: 'Градиент' },
            { value: 'image', name: 'Картинка' },
          ]}
          value={backgroundType}
          onChange={(value) => {
            setBackgroundType(value)
            set({ backgroundType: value })
          }}
          paddingY="small"
          fullWidth={false}
        />
        {backgroundType === 'gradient' && (
          <div className="flex gap-x-2">
            <ColorPicker
              label="Цвет №1"
              value={gradient1Color}
              onChange={(value) => {
                setGradient1Color(value)
                set({ gradient1Color: value })
              }}
            />
            <ColorPicker
              label="Цвет №2"
              value={gradient2Color}
              onChange={(value) => {
                setGradient2Color(value)
                set({ gradient2Color: value })
              }}
            />
            <InputNumber
              label="Угол"
              // type="number"
              // className="w-[70px]"
              inputClassName="w-9"
              value={angle}
              onChange={(value) => {
                setAngle(parseInt(value))
                set({ angle: parseInt(value) })
              }}
              min={0}
              max={359}
            />
          </div>
        )}
        {backgroundType === 'color' && (
          <ColorPicker
            label="Цвет"
            value={backgroundColor}
            onChange={(value) => {
              setBackgroundColor(value)
              set({ backgroundColor: value })
            }}
          />
        )}
        {backgroundType === 'image' && (
          // <div className="flex items-center gap-x-1">
          // {/* <div>Фон:</div> */}
          // {/* <Button
          //   name={src ? 'Изменить фон' : 'Загрузить фон'}
          //   thin
          //   onClick={addImageClick}
          // /> */}
          // <InputImage
          //   image={src}
          //   onChange={(newImage) => {
          //     setSrc(newImage)
          //     set({ src: newImage })
          //   }}
          //   noBorder
          //   noMargin
          //   aspect={imageAspect}
          //   directory={imagesFolder}
          // />
          <div
            onClick={() => {
              modalsFunc.selectImage(imagesFolder, imageAspect, (newImage) => {
                setSrc(newImage)
                set({ src: newImage })
              })
            }}
            className={cn('w-fit my-1 bg-white cursor-pointer group')}
            // style={{ aspectRatio: imageAspect || 1 }}
          >
            {src ? (
              <div className="relative overflow-hidden border-2 border-gray-500 w-fit">
                <img
                  src={src}
                  className="w-24 object-fit"
                  style={{ aspectRatio: imageAspect || 1 }}
                />
                <div className="absolute top-0 right-0 z-10 flex justify-end p-1 duration-200 transform bg-white rounded-bl-full w-7 h-7 laptop:-top-5 laptop:group-hover:top-0 laptop:-right-5 laptop:group-hover:right-0 hover:scale-125">
                  <FontAwesomeIcon
                    className="h-4 text-red-700"
                    icon={faTrash}
                    onClick={(e) => {
                      e.stopPropagation()
                      setSrc('')
                      set({ src: '' })
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="relative border-2 border-gray-500 rounded-xl w-fit">
                <div
                  className="relative flex items-center justify-center w-24 overflow-hidden"
                  style={{ aspectRatio: imageAspect || 1 }}
                >
                  <div className="flex items-center justify-center duration-200 w-14 aspect-1 min-w-14 transparent group-hover:scale-125 ">
                    <FontAwesomeIcon className="text-gray-700" icon={faPlus} />
                  </div>
                </div>
              </div>
            )}
          </div>
          //   {/* <input
          //     ref={hiddenFileInput}
          //     className="hidden"
          //     type="file"
          //     onChange={(e) => {
          //       modalsFunc.cropImage(
          //         e.target.files[0],
          //         null,
          //         imageAspect,
          //         (newImage) => {
          //           setSrc(newImage)
          //           set({ src: newImage })
          //         },
          //         false
          //       )
          //     }}
          //   /> */}
          // //   {src && (
          // //     <FontAwesomeIcon
          // //       className="w-6 h-6 duration-200 transform cursor-pointer text-danger hover:scale-110"
          // //       icon={faTimes}
          // //       onClick={() => {
          // //         setSrc('')
          // //         set({ src: '' })
          // //       }}
          // //     />
          // //   )}
          // // </div>
        )}
      </div>
    </InputWrapper>
  )
}
