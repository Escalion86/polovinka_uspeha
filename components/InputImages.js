import { useEffect, useRef, useState } from 'react'
import Zoom from 'react-medium-image-zoom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faPlus, faHome } from '@fortawesome/free-solid-svg-icons'
import { sendImage } from '@helpers/cloudinary'
import cn from 'classnames'
import LoadingSpinner from './LoadingSpinner'
import arrayMove from '@helpers/arrayMove'
import { motion } from 'framer-motion'
import InputWrapper from './InputWrapper'
import { modalsFuncAtom } from '@state/atoms'
import { useRecoilValue } from 'recoil'

const InputImages = ({
  images = [],
  onChange = () => {},
  required = false,
  label = null,
  directory = null,
  project,
  maxImages = 10,
  labelClassName,
  className,
  aspect,
  error,
  fullWidth,
}) => {
  const modalsFunc = useRecoilValue(modalsFuncAtom)
  const [isAddingImage, setAddingImage] = useState(false)
  const hiddenFileInput = useRef(null)
  const addImageClick = () => {
    hiddenFileInput.current.click()
  }

  const onAddImage = async (newImage) => {
    if (newImage) {
      var img = document.createElement('img')
      // this.state.backgroundImageFile = e.target.files[0];

      img.onload = async () => {
        // console.log(img.width + ' ' + img.height)
        // console.log('img', img)
        // console.log('newImage', newImage)
        if (img.width < 100 || img.height < 100) modalsFunc.minimalSize()
        else {
          // const newResizedImage = await resizeFile(newImage)
          // setImageOld(image)
          // setAddingImage(true)
          modalsFunc.cropImage(newImage, img, aspect, (newImage) => {
            // setImageOld(image)
            setAddingImage(true)
            sendImage(
              newImage,
              (imagesUrls) => onChange([...images, ...imagesUrls]),
              directory,
              null,
              project
            )
          })
        }
      }

      var reader = new FileReader()
      reader.onloadend = function (ended) {
        img.src = ended.target.result
      }
      reader.readAsDataURL(newImage)
    } else {
      onChange(images)
    }
    // if (newImage) {
    //   setAddingImage(true)
    //   sendImage(
    //     newImage,
    //     (imageUrl) => {
    //       onChange([...images, imageUrl])
    //     },
    //     directory
    //   )
    // } else {
    //   onChange(images)
    // }
  }

  useEffect(() => setAddingImage(false), [images])

  return (
    <InputWrapper
      label={label}
      labelClassName={labelClassName}
      onChange={onChange}
      value={images}
      className={cn('flex-1', className)}
      required={required}
      error={error}
      paddingY
      fullWidth={fullWidth}
      // labelPos="top"
    >
      <div
        className={cn(
          'flex flex-wrap w-full gap-1 p-0.5'

          // error ? 'border border-red-700' : 'border border-gray-400'
        )}
      >
        {images.length > 0 &&
          images.map((image, index) => (
            <motion.div
              key={image}
              className="relative w-20 h-20 overflow-hidden border border-gray-300 group"
              layout
              transition={{ duration: 0.2, type: 'just' }}
            >
              <Zoom zoomMargin={20}>
                <img
                  className="object-cover w-20 h-20"
                  src={image}
                  alt="item_image"
                />
              </Zoom>

              <div className="absolute top-0 right-0 flex justify-end p-1 duration-200 transform bg-white rounded-bl-full cursor-pointer w-7 h-7 laptop:-top-5 laptop:group-hover:top-0 laptop:-right-5 laptop:group-hover:right-0 hover:scale-125">
                <FontAwesomeIcon
                  className="h-4 text-red-700"
                  icon={faTrash}
                  onClick={() => {
                    onChange(images.filter((image, i) => i !== index))
                  }}
                />
              </div>
              <div
                className={cn(
                  'absolute flex p-1 duration-200 transform bg-white rounded-br-full w-7 h-7',
                  index === 0
                    ? 'top-0 left-0'
                    : 'top-0 left-0 laptop:-top-5 laptop:group-hover:top-0 laptop:-left-5 laptop:group-hover:left-0 cursor-pointer hover:scale-125'
                )}
              >
                <FontAwesomeIcon
                  className={cn(
                    'h-4',
                    index === 0 ? 'text-success' : 'text-orange-600'
                  )}
                  icon={faHome}
                  onClick={() => {
                    if (index !== 0) onChange(arrayMove(images, index, 0))
                  }}
                />
              </div>
            </motion.div>
          ))}
        {!isAddingImage && images.length < maxImages && (
          <div
            onClick={addImageClick}
            className="flex items-center justify-center w-20 h-20 bg-white border-2 border-gray-500 cursor-pointer rounded-xl"
          >
            <div className="flex items-center justify-center w-12 h-12 duration-200 min-w-12 min-h-12 transparent hover:scale-125 ">
              <FontAwesomeIcon
                className="text-gray-700"
                icon={faPlus}
                // onClick={() => {
                //   images.splice(index, 1)
                //   onChange(images)
                // }}
              />
              <input
                type="file"
                ref={hiddenFileInput}
                onChange={(e) => onAddImage(e.target.files[0])}
                onClick={(e) => {
                  e.target.value = null
                }}
                style={{ display: 'none' }}
                accept="image/jpeg,image/png"
              />
            </div>
          </div>
        )}
        {isAddingImage && (
          <LoadingSpinner className="w-20 h-20 border border-gray-300 bg-general bg-opacity-20" />
        )}
      </div>
    </InputWrapper>
  )
}

export default InputImages
