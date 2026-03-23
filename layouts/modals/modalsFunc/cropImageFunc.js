import RotateButton from '@components/IconToggleButtons/RotateButton'
import { useRef } from 'react'
import { useEffect, useState } from 'react'
import ReactCrop, {
  centerCrop,
  convertToPixelCrop,
  makeAspectCrop,
} from 'react-image-crop'

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
const MAX_UPLOAD_BYTES = 900 * 1024
const MAX_OUTPUT_SIDE = 1600
const JPEG_QUALITIES = [0.85, 0.75, 0.65, 0.55]
const MIME_PNG = 'image/png'
const MIME_JPEG = 'image/jpeg'

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

const canvasToBlob = (canvas, mimeType, quality) =>
  new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), mimeType, quality)
  })

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
    const [imgSrc, setImgSrc] = useState('')
    const [firstInit, setFirstInit] = useState(true)
    const ref = useRef()
    const [crop, setCrop] = useState()
    const [completedCrop, setCompletedCrop] = useState(null)
    const [scale, setScale] = useState(1)
    const [rotate, setRotate] = useState(0)

    const getCroppedImg = (
      image,
      completedCrop = completedCrop,
      crop = crop,
      scale = 1,
      rotate = 0
    ) => {
      // if (!isCropClicked) onConfirm(imgElement)
      const sourceMime = String(src?.type || '').toLowerCase()
      const keepAlpha = sourceMime === MIME_PNG
      const outputMime = keepAlpha ? MIME_PNG : MIME_JPEG

      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        throw new Error('No 2d context')
      }

      const scaleX = image.naturalWidth / image.width
      const scaleY = image.naturalHeight / image.height
      const rawOutputWidth = Math.max(
        1,
        Math.floor(completedCrop.width * scaleX)
      )
      const rawOutputHeight = Math.max(
        1,
        Math.floor(completedCrop.height * scaleY)
      )
      const outputScale =
        Math.max(rawOutputWidth, rawOutputHeight) > MAX_OUTPUT_SIDE
          ? MAX_OUTPUT_SIDE / Math.max(rawOutputWidth, rawOutputHeight)
          : 1
      // const aspectFact = imgElement.width / imgElement.height

      canvas.width = Math.max(1, Math.floor(rawOutputWidth * outputScale))
      canvas.height = Math.max(1, Math.floor(rawOutputHeight * outputScale))

      ctx.scale(outputScale, outputScale)
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
        ;(async () => {
          let selectedBlob = null
          if (outputMime === MIME_PNG) {
            selectedBlob = await canvasToBlob(canvas, outputMime)
          } else {
            for (const quality of JPEG_QUALITIES) {
              const blob = await canvasToBlob(canvas, outputMime, quality)
              if (!blob) continue
              selectedBlob = blob
              if (blob.size <= MAX_UPLOAD_BYTES) break
            }
          }

          if (!selectedBlob) {
            onConfirm(null)
            return
          }

          onConfirm(blobToFile(selectedBlob, src.name))
        })()
      } else {
        onConfirm(canvas.toDataURL(outputMime))
      }
    }

    useEffect(() => {
      if (!imgSrc) {
        // setCrop(undefined) // Makes crop preview update between images.
        const reader = new FileReader()
        reader.addEventListener('load', (e) => {
          // const imageElement = new Image()
          const imageUrl = reader.result?.toString() || ''
          // imageElement.src = imageUrl

          // imageElement.addEventListener('load', (e) => {
          //   // if (error) setError("");
          //   const { naturalWidth, naturalHeight } = e.currentTarget
          //   console.log('naturalWidth :>> ', naturalWidth)
          //   console.log('naturalHeight :>> ', naturalHeight)
          //   // if (naturalWidth < MIN_DIMENSION || naturalHeight < MIN_DIMENSION) {
          //   //   setError("Image must be at least 150 x 150 pixels.");
          //   //   return setImgSrc("");
          //   // }
          // })
          setImgSrc(imageUrl)
        })
        reader.readAsDataURL(src)
      }
    }, [imgSrc])

    useEffect(() => {
      setOnConfirmFunc(() => {
        getCroppedImg(ref.current, completedCrop, crop, scale, rotate)
        closeModal()
      })
      // setDisableConfirm(completedCrop.width < 100 || completedCrop.height < 100)
    }, [completedCrop])

    const onImageLoad = (e) => {
      const { width, height } = e.currentTarget
      const newCrop = aspectRatio
        ? makeAspectCrop(
            {
              unit: '%',
              width,
              height,
            },
            aspectRatio,
            width,
            height
          )
        : {
            unit: '%',
            width: 100,
            height: 100,
            x: 0,
            y: 0,
          }
      const pixelCrop = convertToPixelCrop(newCrop, width, height)
      setCompletedCrop(pixelCrop)
      setCrop(newCrop)
    }

    if (!Boolean(imgSrc)) return null

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
        </div>
        <ReactCrop
          // innerRef={inputRef}
          crop={crop}
          onChange={(_, percentCrop) => setCrop(percentCrop)}
          onComplete={(c) => {
            if (firstInit) return setFirstInit(false)
            setCompletedCrop(c)
          }}
          aspect={aspectRatio}
          minHeight={100}
          minWidth={100}
        >
          <img
            ref={ref}
            alt="Crop me"
            src={imgSrc}
            style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
            className="max-h-[70vh]"
            onLoad={onImageLoad}
          />
        </ReactCrop>
      </div>
    )
  }

  return {
    title: `Обрезка картинки`,
    declineButtonName: 'Закрыть',
    Children: CropImageModal,
  }
}

export default cropImageFunc
