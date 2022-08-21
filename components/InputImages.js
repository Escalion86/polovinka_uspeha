import { useEffect, useRef, useState } from 'react'
import Zoom from 'react-medium-image-zoom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faPlus } from '@fortawesome/free-solid-svg-icons'
import { sendImage } from '@helpers/cloudinary'
import cn from 'classnames'
import LoadingSpinner from './LoadingSpinner'
import Label from './Label'

const InputImages = ({
  images = [],
  onChange = () => {},
  required = false,
  label = null,
  directory = null,
  maxImages = 10,
  labelClassName,
}) => {
  const [isAddingImage, setAddingImage] = useState(false)
  const hiddenFileInput = useRef(null)
  const addImageClick = (event) => {
    hiddenFileInput.current.click()
  }

  // const handleChange = (e) => {
  //   onAddImage(e.target.files[0])
  // }

  const onAddImage = async (newImage) => {
    if (newImage) {
      // if (image) await deleteImages([image])
      setAddingImage(true)
      sendImage(
        newImage,
        (imageUrl) => {
          onChange([...images, imageUrl])
        },
        directory
      )
    } else {
      onChange(images)
    }
  }

  useEffect(() => setAddingImage(false), [images])

  return (
    <>
      {label && (
        <Label text={label} className={labelClassName} required={required} />
      )}
      <div
        className={cn(
          'flex flex-wrap w-full gap-1 p-0.5 rounded',

          required && !images?.length
            ? 'border border-red-700'
            : 'border border-gray-400'
        )}
      >
        {images.length > 0 &&
          images.map((image, index) => (
            <div
              key={index}
              className="relative w-20 h-20 overflow-hidden border border-gray-300 group"
            >
              <Zoom zoomMargin={20}>
                <img
                  className="object-cover w-20 h-20"
                  src={image}
                  alt="item_image"
                />
              </Zoom>

              <FontAwesomeIcon
                className="absolute w-4 h-4 text-red-700 duration-200 transform cursor-pointer -top-4 group-hover:top-1 -right-4 group-hover:right-1 hover:scale-125"
                icon={faTrash}
                onClick={() => {
                  onChange(images.filter((image, i) => i !== index))
                }}
              />
            </div>
          ))}
        {!isAddingImage && images.length < maxImages && (
          <div
            onClick={addImageClick}
            className="flex items-center justify-center w-20 h-20 bg-white border-2 border-gray-500 cursor-pointer rounded-xl"
          >
            <div className="flex items-center justify-center w-12 h-12 duration-200 transparent hover:scale-125 ">
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
    </>
  )
}

export default InputImages
