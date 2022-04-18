import { useRef } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faPlus, faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import { deleteImages, sendImage } from '@helpers/cloudinary'
import cn from 'classnames'

const InputImage = ({
  label = 'Картинка',
  image = null,
  noImage = '/img/no_image.png',
  onChange = () => {},
  required = false,
  readOnly = false,
  noEditButton = false,
  directory = null,
  imageName = null,
  onDelete = null,
}) => {
  const hiddenFileInput = useRef(null)
  const selectImageClick = (event) => {
    hiddenFileInput.current.click()
  }

  const onChangeImage = async (newImage) => {
    if (newImage) {
      if (image) await deleteImages([image])
      sendImage(
        newImage,
        (imageUrl) => onChange(imageUrl),
        directory,
        imageName
      )
    } else {
      if (imageName)
        await deleteImages([(directory ? directory + '/' : '') + imageName])
      onChange(null)
    }
  }
  if (readOnly && !image) return null

  return (
    <div>
      {label && (
        <label
          className={cn({
            'border-b-1 border-primary max-w-min whitespace-nowrap': readOnly,
          })}
        >
          {label}
          {readOnly ? ':' : required && <span className="text-red-700">*</span>}
        </label>
      )}
      {!image && readOnly ? (
        <div className="ml-2">-</div>
      ) : (
        <div
          className={cn(
            'relative border rounded-sm h-20 w-20 overflow-hidden group',
            { 'border-gray-400 hover:border-primary': readOnly },
            {
              [required && !image ? ' border-red-700' : ' border-gray-400']:
                !readOnly,
            }
          )}
        >
          <img
            className="object-cover w-20 h-20"
            src={image || noImage}
            alt="item_no_image"
          />
          {!readOnly && image && (
            <FontAwesomeIcon
              className="absolute w-5 h-5 text-red-700 duration-200 transform cursor-pointer -top-5 group-hover:top-1 -right-5 group-hover:right-1 hover:scale-125"
              icon={faTrash}
              size="1x"
              onClick={() => {
                onChangeImage(null)
                onDelete && onDelete()
              }}
            />
          )}
          {!readOnly && !image && (
            <FontAwesomeIcon
              className="absolute w-6 h-6 duration-200 transform -translate-x-1/2 -translate-y-1/2 opacity-0 cursor-pointer text-primary tran top-1/2 left-1/2 group-hover:opacity-80 group-hover:scale-125"
              icon={faPencilAlt}
              size="2x"
              onClick={() => selectImageClick()}
            />
          )}
          {!readOnly && !noEditButton && image && (
            <FontAwesomeIcon
              className="absolute w-5 h-5 duration-200 transform cursor-pointer -top-5 -left-5 group-hover:top-1 group-hover:left-1 text-primary hover:scale-125"
              icon={faPencilAlt}
              size="1x"
              onClick={() => {
                // onChange(addImageClick)
                selectImageClick()
              }}
            />
          )}
        </div>
      )}
      <input
        type="file"
        ref={hiddenFileInput}
        onChange={(e) => onChangeImage(e.target.files[0])}
        style={{ display: 'none' }}
        accept="image/jpeg,image/png"
      />
    </div>
  )
}

export default InputImage
