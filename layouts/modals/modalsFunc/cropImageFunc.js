import compareObjects from '@helpers/compareObjects'
import React, { useState, useRef, useEffect } from 'react'

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

const DEFAULT_CROP = {
  unit: '%',
  x: 0,
  y: 0,
  width: 100,
  height: 100,
}

const cropImageFunc = (src = '', aspectRatio, onConfirm) => {
  const CropImageModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
  }) => {
    const [imgSrc, setImgSrc] = useState('')
    const imgRef = useRef(null)
    const [crop, setCrop] = useState(DEFAULT_CROP)
    const [completedCrop, setCompletedCrop] = useState(DEFAULT_CROP)
    const [scale, setScale] = useState(1)
    const [rotate, setRotate] = useState(0)
    const [aspect, setAspect] = useState(aspectRatio)
    // const [ready, setReady] = useState()

    // console.log('completedCrop', completedCrop)
    // console.log('imgRef.current.width', imgRef.current?.width)
    // console.log('crop', crop)

    // useEffect(()=> setCompletedCrop,[])

    const getCroppedImg = (image = imgRef.current, crop = completedCrop) => {
      if (!crop || compareObjects(crop, DEFAULT_CROP)) return onConfirm(src)

      const canvas = document.createElement('canvas')
      const scaleX = image.naturalWidth / image.width
      const scaleY = image.naturalHeight / image.height
      canvas.width = crop.width
      canvas.height = crop.height
      const ctx = canvas.getContext('2d')

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      )

      // const reader = new FileReader()
      canvas.toBlob((blob) => {
        const file = new File([blob], 'mycanvas.png')
        onConfirm(file)
      })
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
        getCroppedImg(imgRef.current, completedCrop)
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
          <div>
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspect}
              minHeight={100}
              minWidth={100}
            >
              <img
                ref={imgRef}
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
