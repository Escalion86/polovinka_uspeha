// import IconToggleButton from '@components/IconToggleButtons/IconToggleButton'
import RotateButton from '@components/IconToggleButtons/RotateButton'
// import compareObjects from '@helpers/compareObjects'
// import { Square } from '@mui/icons-material'
import React, { useState, useRef, useEffect, useLayoutEffect } from 'react'
import { useCallback } from 'react'

import ReactCrop from 'react-image-crop'

// function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
//   return centerCrop(
//     makeAspectCrop(
//       {
//         unit: '%',
//         width: 90,
//       },
//       aspect,
//       mediaWidth,
//       mediaHeight
//     ),
//     mediaWidth,
//     mediaHeight
//   )
// }

// export function useDebounceEffect(fn, waitTime, deps) {
//   useEffect(() => {
//     const t = setTimeout(() => {
//       fn.apply(undefined, deps)
//     }, waitTime)

//     return () => {
//       clearTimeout(t)
//     }
//   }, deps)
// }

// const TO_RADIANS = Math.PI / 180

// async function canvasPreview(image, canvas, crop, scale = 1, rotate = 0) {
//   const ctx = canvas.getContext('2d')

//   if (!ctx) {
//     throw new Error('No 2d context')
//   }

//   const scaleX = image.naturalWidth / image.width
//   const scaleY = image.naturalHeight / image.height
//   // devicePixelRatio slightly increases sharpness on retina devices
//   // at the expense of slightly slower render times and needing to
//   // size the image back down if you want to download/upload and be
//   // true to the images natural size.
//   const pixelRatio = window.devicePixelRatio
//   // const pixelRatio = 1

//   canvas.width = Math.floor(crop.width * scaleX * pixelRatio)
//   canvas.height = Math.floor(crop.height * scaleY * pixelRatio)

//   ctx.scale(pixelRatio, pixelRatio)
//   ctx.imageSmoothingQuality = 'high'

//   const cropX = crop.x * scaleX
//   const cropY = crop.y * scaleY

//   const rotateRads = rotate * TO_RADIANS
//   const centerX = image.naturalWidth / 2
//   const centerY = image.naturalHeight / 2

//   ctx.save()

//   // 5) Move the crop origin to the canvas origin (0,0)
//   ctx.translate(-cropX, -cropY)
//   // 4) Move the origin to the center of the original position
//   ctx.translate(centerX, centerY)
//   // 3) Rotate around the origin
//   ctx.rotate(rotateRads)
//   // 2) Scale the image
//   ctx.scale(scale, scale)
//   // 1) Move the center of the image to the origin (0,0)
//   ctx.translate(-centerX, -centerY)
//   ctx.drawImage(
//     image,
//     0,
//     0,
//     image.naturalWidth,
//     image.naturalHeight,
//     0,
//     0,
//     image.naturalWidth,
//     image.naturalHeight
//   )

//   ctx.restore()
// }

// const dataUrlToFile = (url, fileName) => {
//   const [mediaType, data] = url.split(',')

//   const mime = mediaType.match(/:(.*?);/)?.[0]

//   var n = data.length

//   const arr = new Uint8Array(n)

//   while (n--) {
//     arr[n] = data.charCodeAt(n)
//   }

//   return new File([arr], fileName, { type: mime })
// }

// const MAX_SIZE = 2400
const TO_RADIANS = Math.PI / 180

// const cropCorrecting = (crop, aspect) => {
//   if (aspect === 1)
//     return crop.width > crop.height
//       ? { ...crop, width: crop.height }
//       : { ...crop, height: crop.width }

//   return crop
// }

function blobToFile(theBlob, fileName) {
  //A Blob() is almost a File() - it's just missing the two properties below which we will add
  theBlob.lastModifiedDate = new Date()
  theBlob.name = fileName
  return theBlob
}

const cropImageFunc = (
  src = '',
  imgElement,
  aspectRatio,
  onConfirm,
  toBlob = true
) => {
  const CropImageModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
  }) => {
    // console.log('src', src)
    const [imgSrc, setImgSrc] = useState('')
    const [isCropClicked, setIsCropClicked] = useState(false)
    // const inputRef = useRef(null)
    const [ref, setRef] = useState(null)
    const [crop, setCrop] = useState({
      unit: '%',
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    })
    const [completedCrop, setCompletedCrop] = useState(null)
    const [scale, setScale] = useState(1)
    const [rotate, setRotate] = useState(0)
    // const [aspect, setAspect] = useState(aspectRatio)
    // console.log('aspect :>> ', aspect)

    const onRefChange = useCallback((node) => {
      if (node === null) {
        // DOM node referenced by ref has been unmounted
      } else {
        // DOM node referenced by ref has changed and exists
        // imgRef(node)
        setRef(node)

        // node.height = 600 => 100
        // node.width = node.width * (100 / node.height)

        // if (aspectRatio) {
        //   setCrop({
        //     unit: '%',
        //     x: 0,
        //     y: 0,
        //     width: aspectRatio < 1 && node.width > node.height
        //     ? aspectRatio * node.height
        //     : node.width - 1,
        //     height: 100,
        //   })
        // }
        setCompletedCrop({
          unit: 'px',
          x: 0,
          y: 0,
          width: node.width - 1,
          height: node.height - 1,
        })
      }
    }, [])

    useEffect(() => ref?.current?.click(), [ref?.current])
    // console.log('crop', crop)
    // console.log('completedCrop', completedCrop)
    // const [ready, setReady] = useState()

    // if (imgSrc)
    //   imgSrc.onload = function () {
    //     alert(this.width + 'x' + this.height)
    //   }

    // useLayoutEffect(() => {
    //   // console.log('completedCrop', completedCrop)
    //   if (imgRef?.current)
    //     setCompletedCrop({
    //       ...completedCrop,
    //       width: imgRef.current.width,
    //       height: imgRef.current.height,
    //     })
    //   // console.log('imgRef.current.width', imgRef.current?.width)
    //   // console.log('crop', crop)
    // }, [imgRef?.current])

    // console.log('crop', crop)
    // console.log('completedCrop', completedCrop)

    // const getCroppedImg = (
    //   image = ref,
    //   completedCrop = completedCrop,
    //   crop = crop,
    //   scale = 1,
    //   rotate = 0
    // ) => {
    //   // console.log('image', image)
    //   // console.log('crop', crop)

    //   // console.log('image.width', imgElement.width)
    //   // console.log('image.height', imgElement.height)

    //   // if (!crop || compareObjects(crop, DEFAULT_CROP)) return onConfirm(src)

    //   const canvas = document.createElement('canvas')
    //   const scaleX = image.naturalWidth / image.width
    //   const scaleY = image.naturalHeight / image.height

    //   // canvas.width = crop.width
    //   // canvas.height = crop.height

    //   const aspectFact = imgElement.width / imgElement.height
    //   // const maxProportion =
    //   //   imgElement.width > 1200 || imgElement.height > 1200
    //   //     ? Math.max(imgElement.width, imgElement.height) / 1200
    //   //     : 1

    //   canvas.width =
    //     (imgElement.width > MAX_SIZE || imgElement.height > MAX_SIZE
    //       ? imgElement.width > imgElement.height
    //         ? MAX_SIZE
    //         : MAX_SIZE * aspectFact
    //       : imgElement.width) *
    //     (crop.width / 100)
    //   canvas.height =
    //     (imgElement.width > MAX_SIZE || imgElement.height > MAX_SIZE
    //       ? imgElement.width < imgElement.height
    //         ? MAX_SIZE
    //         : MAX_SIZE / aspectFact
    //       : imgElement.height) *
    //     (crop.height / 100)

    //   // console.log('canvas.width', canvas.width)
    //   // console.log('canvas.height', canvas.height)
    //   const ctx = canvas.getContext('2d')

    //   const cropX = completedCrop.x * scaleX
    //   const cropY = completedCrop.y * scaleY

    //   const rotateRads = rotate * TO_RADIANS
    //   const centerX = image.naturalWidth / 2
    //   const centerY = image.naturalHeight / 2

    //   // ctx.translate(-cropX, -cropY)
    //   ctx.translate(centerX, centerY)
    //   ctx.rotate(rotateRads)
    //   ctx.translate(-centerX, -centerY)

    //   ctx.drawImage(
    //     image,
    //     0,
    //     0,
    //     image.naturalWidth,
    //     image.naturalHeight,
    //     0,
    //     0,
    //     canvas.width,
    //     canvas.height
    //   )
    //   // ctx.drawImage(
    //   //   imgElement,
    //   //   0,
    //   //   0,
    //   //   // completedCrop.x * scaleX,
    //   //   // completedCrop.y * scaleY,
    //   //   completedCrop.width * scaleX,
    //   //   completedCrop.height * scaleY,
    //   //   0,
    //   //   0,
    //   //   canvas.width,
    //   //   canvas.height
    //   // )

    //   // canvas.width = crop.width / maxProportion
    //   // canvas.height = crop.height / maxProportion

    //   // const reader = new FileReader()

    //   function blobToFile(theBlob, fileName) {
    //     //A Blob() is almost a File() - it's just missing the two properties below which we will add
    //     theBlob.lastModifiedDate = new Date()
    //     theBlob.name = fileName
    //     return theBlob
    //   }
    //   canvas.toBlob(
    //     (blob) => {
    //       onConfirm(blobToFile(blob, src.name))
    //     },
    //     'image/jpeg',
    //     0.9
    //   )
    // }

    const getCroppedImg = (
      image = ref,
      completedCrop = completedCrop,
      crop = crop,
      scale = 1,
      rotate = 0
    ) => {
      if (!isCropClicked) onConfirm(imgElement)

      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        throw new Error('No 2d context')
      }

      const scaleX = image.naturalWidth / image.width
      const scaleY = image.naturalHeight / image.height
      // devicePixelRatio slightly increases sharpness on retina devices
      // at the expense of slightly slower render times and needing to
      // size the image back down if you want to download/upload and be
      // true to the images natural size.
      const pixelRatio = window.devicePixelRatio
      // const pixelRatio = 1
      // const aspectFact = imgElement.width / imgElement.height

      // const width =
      //   (imgElement.width > MAX_SIZE || imgElement.height > MAX_SIZE
      //     ? imgElement.width > imgElement.height
      //       ? MAX_SIZE
      //       : Math.floor(MAX_SIZE * aspectFact)
      //     : imgElement.width) *
      //   (crop.width / 100)
      // const height =
      //   (imgElement.width > MAX_SIZE || imgElement.height > MAX_SIZE
      //     ? imgElement.width < imgElement.height
      //       ? MAX_SIZE
      //       : Math.floor(MAX_SIZE / aspectFact)
      //     : imgElement.height) *
      //   (crop.height / 100)

      canvas.width = Math.floor(completedCrop.width * scaleX * pixelRatio)
      canvas.height = Math.floor(completedCrop.height * scaleY * pixelRatio)
      // canvas.width = width
      // canvas.height = height
      // console.log('canvas.width', canvas.width)
      // console.log('canvas.height', canvas.height)

      ctx.scale(pixelRatio, pixelRatio)
      ctx.imageSmoothingQuality = 'high'

      const cropX = completedCrop.x * scaleX
      const cropY = completedCrop.y * scaleY

      const rotateRads = rotate * TO_RADIANS
      const centerX = image.naturalWidth / 2
      const centerY = image.naturalHeight / 2

      // ctx.save()

      // 5) Move the crop origin to the canvas origin (0,0)
      ctx.translate(-cropX, -cropY)
      // 4) Move the origin to the center of the original position
      ctx.translate(centerX, centerY)
      // 3) Rotate around the origin
      ctx.rotate(rotateRads)
      // 2) Scale the image
      ctx.scale(scale, scale)
      // 1) Move the center of the image to the origin (0,0)
      ctx.translate(-centerX, -centerY)
      ctx.drawImage(
        image,
        0,
        0,
        image.naturalWidth,
        image.naturalHeight,
        0,
        0,
        // width,
        // height
        image.naturalWidth,
        image.naturalHeight
      )

      // console.log('width', width)
      // console.log('height', height)
      // canvas.width = width
      // canvas.height = height

      // console.log('image.naturalWidth', image.naturalWidth)
      // console.log('image.naturalHeight', image.naturalHeight)

      // ctx.restore()

      if (toBlob) {
        canvas.toBlob(
          (blob) => {
            onConfirm(blobToFile(blob, src.name))
          },
          'image/jpeg',
          0.9
        )
      } else {
        onConfirm(canvas.toDataURL('image/jpeg'))
      }
    }

    useEffect(() => {
      if (!imgSrc) {
        // setCrop(undefined) // Makes crop preview update between images.
        const reader = new FileReader()
        reader.addEventListener('load', () =>
          setImgSrc(reader.result.toString() || '')
        )
        reader.readAsDataURL(src)
      }
    }, [imgSrc])

    useEffect(() => {
      setOnConfirmFunc(() => {
        getCroppedImg(ref, completedCrop, crop, scale, rotate)
        closeModal()
      })
      // setDisableConfirm(completedCrop.width < 100 || completedCrop.height < 100)
    }, [completedCrop])

    // function onImageLoad(e) {
    //   if (aspect) {
    //     const { width, height } = e.currentTarget
    //     setCrop(centerAspectCrop(width, height, aspect))
    //   }
    // }

    // useDebounceEffect(
    //   async () => {
    //     if (
    //       completedCrop?.width &&
    //       completedCrop?.height &&
    //       imgRef.current &&
    //       previewCanvasRef.current
    //     ) {
    //       // We use canvasPreview as it's much faster than imgPreview.
    //       canvasPreview(
    //         imgRef.current,
    //         previewCanvasRef.current,
    //         completedCrop,
    //         scale,
    //         rotate
    //       )
    //     }
    //   },
    //   100,
    //   [completedCrop, scale, rotate]
    // )

    // function handleToggleAspectClick() {
    //   if (aspect) {
    //     setAspect(undefined)
    //   } else if (imgRef.current) {
    //     const { width, height } = imgRef.current
    //     setAspect(16 / 9)
    //     setCrop(centerAspectCrop(width, height, 16 / 9))
    //   }
    // }

    return (
      <div className="App">
        <div className="flex py-1 mb-1 gap-x-2">
          <RotateButton
            direction="left"
            onClick={() =>
              setRotate((state) => (state === 0 ? 270 : state - 90))
            }
          />
          <RotateButton
            direction="right"
            onClick={() =>
              setRotate((state) => (state === 270 ? 0 : state + 90))
            }
          />
          {/* <IconToggleButton
            selected={aspect}
            onClick={() =>
              setAspect((state) => {
                if (state) return undefined
                else {
                  setCrop(cropCorrecting(crop, 1))
                  setCompletedCrop(cropCorrecting(completedCrop, 1))
                  return 1
                }
              })
            }
          >
            <Square />
          </IconToggleButton> */}
          {/* <label htmlFor="rotate-input">Rotate: </label>
          <input
            id="rotate-input"
            type="number"
            value={rotate}
            disabled={!imgSrc}
            onChange={(e) =>
              setRotate(Math.min(180, Math.max(-180, Number(e.target.value))))
            }
          /> */}
        </div>
        {/* <div className="Crop-Controls">
          <input type="file" accept="image/*" onChange={onSelectFile} />
          <div>
            <label htmlFor="scale-input">Scale: </label>
            <input
              id="scale-input"
              type="number"
              step="0.1"
              value={scale}
              disabled={!imgSrc}
              onChange={(e) => setScale(Number(e.target.value))}
            />
          </div>
          <div>
            <label htmlFor="rotate-input">Rotate: </label>
            <input
              id="rotate-input"
              type="number"
              value={rotate}
              disabled={!imgSrc}
              onChange={(e) =>
                setRotate(Math.min(180, Math.max(-180, Number(e.target.value))))
              }
            />
          </div>
          <div>
            <button onClick={handleToggleAspectClick}>
              Toggle aspect {aspect ? 'off' : 'on'}
            </button>
          </div>
        </div> */}
        {Boolean(imgSrc) && (
          <div
            onClick={() => {
              if (!isCropClicked) setIsCropClicked(true)
            }}
          >
            <ReactCrop
              // innerRef={inputRef}
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspectRatio}
              minHeight={100}
              minWidth={100}
            >
              <img
                ref={onRefChange}
                alt="Crop me"
                src={imgSrc}
                style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
                // onLoad={onImageLoad}
                className="max-h-[70vh]"
              />
            </ReactCrop>
          </div>
        )}
        {/* <div>
          {Boolean(completedCrop) && (
            <canvas
              ref={previewCanvasRef}
              style={{
                border: '1px solid black',
                objectFit: 'contain',
                width: completedCrop.width,
                height: completedCrop.height,
              }}
            />
          )}
        </div> */}
        {/* <div onClick={() => getCroppedImg()}>Отправить</div> */}
      </div>
    )
  }

  return {
    title: `Обрезка картинки`,
    declineButtonName: 'Закрыть',
    Children: CropImageModal,
    // onConfirm: () => getCroppedImg(),
    // showDecline: true,
    // showConfirm: false,
  }
}

export default cropImageFunc
