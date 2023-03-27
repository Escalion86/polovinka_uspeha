import { useEffect, useRef, useState } from 'react'
import Zoom from 'react-medium-image-zoom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faPlus, faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import { deleteImages, sendImage } from '@helpers/cloudinary'
import cn from 'classnames'
import LoadingSpinner from './LoadingSpinner'
import { motion } from 'framer-motion'
import Label from './Label'
import { modalsFuncAtom } from '@state/atoms'
import { useRecoilValue } from 'recoil'
import InputWrapper from './InputWrapper'

const InputImage = ({
  label = 'Картинка',
  image = null,
  noImage = '/img/no_image.png',
  onChange = () => {},
  required = false,
  noEditButton = false,
  directory = null,
  imageName = null,
  onDelete = null,
  labelClassName,
  className,
  aspect,
  error,
}) => {
  const modalsFunc = useRecoilValue(modalsFuncAtom)
  const [isAddingImage, setAddingImage] = useState(false)
  const [imageOld, setImageOld] = useState(image ?? noImage)
  const hiddenFileInput = useRef(null)
  const selectImageClick = (event) => {
    hiddenFileInput.current.click()
  }

  // function onSelectFile(file) {
  //   if (file) {
  //     const reader = new FileReader()
  //     reader.addEventListener('load', () =>
  //       setImgSrc(reader.result.toString() || '')
  //     )
  //     reader.readAsDataURL(e.target.files[0])
  //   }
  // }

  const onChangeImage = async (newImage) => {
    if (newImage) {
      var img = document.createElement('img')

      img.onload = async () => {
        // console.log(img.width + ' ' + img.height)
        if (img.width < 100 || img.height < 100) modalsFunc.minimalSize()
        else {
          // setImageOld(image)
          // setAddingImage(true)
          modalsFunc.cropImage(newImage, img, aspect, (newImage) => {
            setImageOld(image)
            setAddingImage(true)
            sendImage(
              newImage,
              (imagesUrls) => {
                onChange(imagesUrls[0])
              },
              directory,
              imageName
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
      if (imageName)
        await deleteImages([(directory ? directory + '/' : '') + imageName])
      onChange(null)
    }

    // if (newImage) {
    //   setImageOld(image)
    //   setAddingImage(true)
    //   if (image) await deleteImages([image])
    //   sendImage(
    //     newImage,
    //     (imageUrl) => {
    //       onChange(imageUrl)
    //     },
    //     directory,
    //     imageName
    //   )
    // } else {
    //   if (imageName)
    //     await deleteImages([(directory ? directory + '/' : '') + imageName])
    //   onChange(null)
    // }
  }

  useEffect(() => setAddingImage(false), [image])

  // if (!image) return null

  return (
    <InputWrapper
      label={label}
      labelClassName={labelClassName}
      onChange={onChange}
      value={image}
      className={cn('flex-1', className)}
      required={required}
      error={error}
      // paddingY
      // labelPos="top"
    >
      <div
        className={cn(
          'relative border rounded-sm h-20 w-20 overflow-hidden group',
          error ? ' border-red-700' : ' border-gray-400'
        )}
      >
        <motion.div
          className="absolute top-0 bottom-0 left-0 right-0 z-10 w-20 h-20 duration-1000 bg-white"
          animate={{ opacity: isAddingImage ? 0 : 1 }}
          initial={{ opacity: 1 }}
        >
          <Zoom zoomMargin={20}>
            <img
              className="object-cover w-20 h-20"
              src={image ?? noImage}
              alt="item_image"
            />
          </Zoom>
        </motion.div>
        <img
          className="absolute top-0 bottom-0 left-0 right-0 object-cover w-20 h-20 duration-1000"
          src={imageOld}
          alt="item_no_image"
        />
        <LoadingSpinner className="absolute top-0 bottom-0 left-0 right-0 w-20 h-20 bg-opacity-50 border border-gray-300 bg-general" />
        {/* <div className="absolute flex justify-end p-1 duration-200 transform bg-white rounded-bl-full cursor-pointer w-7 h-7 -top-5 group-hover:top-0 -right-5 group-hover:right-0 hover:scale-125">
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
            'absolute flex p-1 duration-200 transform bg-white rounded-br-full cursor-pointer w-7 h-7 hover:scale-125',
            index === 0
              ? 'top-0 left-0'
              : '-top-5 group-hover:top-0 -left-5 group-hover:left-0'
          )}
        >
          <FontAwesomeIcon
            className="h-4 text-orange-600"
            icon={faHome}
            onClick={() => {
              if (index !== 0) onChange(arrayMove(images, index, 0))
            }}
          />
        </div> */}

        {!isAddingImage && image && (
          <div className="absolute top-0 right-0 z-20 flex justify-end p-1 duration-200 transform bg-white rounded-bl-full cursor-pointer w-7 h-7 laptop:-top-5 laptop:group-hover:top-0 laptop:-right-5 laptop:group-hover:right-0 hover:scale-125">
            <FontAwesomeIcon
              className="h-4 text-red-700"
              icon={faTrash}
              size="1x"
              onClick={() => {
                onChangeImage(null)
                onDelete && onDelete()
              }}
            />
          </div>
        )}
        {!image && (
          <FontAwesomeIcon
            className="absolute z-20 w-6 h-6 duration-200 transform -translate-x-1/2 -translate-y-1/2 opacity-0 cursor-pointer text-primary tran top-1/2 left-1/2 group-hover:opacity-80 group-hover:scale-125"
            icon={faPencilAlt}
            size="2x"
            onClick={() => selectImageClick()}
          />
        )}
        {!isAddingImage && !noEditButton && image && (
          <div className="absolute top-0 left-0 z-20 flex p-1 duration-200 transform bg-white rounded-br-full cursor-pointer w-7 h-7 hover:scale-125 laptop:-top-5 laptop:group-hover:top-0 laptop:-left-5 laptop:group-hover:left-0">
            <FontAwesomeIcon
              className="h-4 text-orange-600"
              icon={faPencilAlt}
              size="1x"
              onClick={() => {
                // onChange(addImageClick)
                selectImageClick()
              }}
            />
          </div>
        )}
        {/* <motion.div
          animate={{ opacity: isAddingImage ? 1 : 0 }}
          initial={{ opacity: 0 }}
        >
          <LoadingSpinner className="absolute top-0 bottom-0 left-0 right-0 z-10 w-20 h-20 border border-gray-300 bg-general bg-opacity-30" />
        </motion.div> */}
      </div>
      <input
        type="file"
        ref={hiddenFileInput}
        onChange={(e) => {
          if (e.target.files[0]) onChangeImage(e.target.files[0])
        }}
        value={''}
        style={{ display: 'none' }}
        accept="image/jpeg,image/png"
      />
    </InputWrapper>
  )
}

export default InputImage
