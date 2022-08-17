import { useEffect, useRef, useState } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faPlus, faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import { deleteImages, sendImage } from '@helpers/cloudinary'
import cn from 'classnames'
import LoadingSpinner from './LoadingSpinner'
import { motion } from 'framer-motion'
import Label from './Label'

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
}) => {
  const [isAddingImage, setAddingImage] = useState(false)
  const [imageOld, setImageOld] = useState(image ?? noImage)
  const hiddenFileInput = useRef(null)
  const selectImageClick = (event) => {
    hiddenFileInput.current.click()
  }

  const onChangeImage = async (newImage) => {
    if (newImage) {
      setImageOld(image)
      setAddingImage(true)
      if (image) await deleteImages([image])
      sendImage(
        newImage,
        (imageUrl) => {
          onChange(imageUrl)
        },
        directory,
        imageName
      )
    } else {
      if (imageName)
        await deleteImages([(directory ? directory + '/' : '') + imageName])
      onChange(null)
    }
  }

  useEffect(() => setAddingImage(false), [image])

  // if (!image) return null

  return (
    <>
      <Label text={label} className={labelClassName} required={required} />
      <div
        className={cn(
          'relative border rounded-sm h-20 w-20 overflow-hidden group',
          required && !image ? ' border-red-700' : ' border-gray-400'
        )}
      >
        <motion.img
          className="absolute top-0 bottom-0 left-0 right-0 z-10 object-cover w-20 h-20 duration-1000 bg-white"
          src={image ?? noImage}
          alt="item_no_image"
          animate={{ opacity: isAddingImage ? 0 : 1 }}
          initial={{ opacity: 1 }}
        />
        <img
          className="absolute top-0 bottom-0 left-0 right-0 object-cover w-20 h-20 duration-1000"
          src={imageOld}
          alt="item_no_image"
        />
        <LoadingSpinner className="absolute top-0 bottom-0 left-0 right-0 w-20 h-20 bg-opacity-50 border border-gray-300 bg-general" />

        {!isAddingImage && image && (
          <FontAwesomeIcon
            className="absolute z-20 w-5 h-5 text-red-700 duration-200 transform cursor-pointer -top-5 group-hover:top-1 -right-5 group-hover:right-1 hover:scale-125"
            icon={faTrash}
            size="1x"
            onClick={() => {
              onChangeImage(null)
              onDelete && onDelete()
            }}
          />
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
          <FontAwesomeIcon
            className="absolute z-20 w-5 h-5 duration-200 transform cursor-pointer -top-5 -left-5 group-hover:top-1 group-hover:left-1 text-primary hover:scale-125"
            icon={faPencilAlt}
            size="1x"
            onClick={() => {
              // onChange(addImageClick)
              selectImageClick()
            }}
          />
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
        style={{ display: 'none' }}
        accept="image/jpeg,image/png"
      />
    </>
  )
}

export default InputImage
