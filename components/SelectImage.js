import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus'
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { sendImage } from '@helpers/cloudinary'
import { modalsFuncAtom } from '@state/atoms'
import cn from 'classnames'
import { m } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useRecoilValue } from 'recoil'
import InputWrapper from './InputWrapper'
import LoadingSpinner from './LoadingSpinner'
import locationPropsSelector from '@state/selectors/locationPropsSelector'
import Image from 'next/image'

const SelectImage = ({
  images = [],
  onChange = () => {},
  required = false,
  label = null,
  directory,
  maxImages = 10,
  labelClassName,
  className,
  aspect,
  error,
  fullWidth,
  readOnly = false,
  noMargin,
  smallMargin,
  paddingY = true,
  paddingX,
}) => {
  const modalsFunc = useRecoilValue(modalsFuncAtom)
  const { imageFolder } = useRecoilValue(locationPropsSelector)
  const [isAddingImage, setAddingImage] = useState(false)
  const hiddenFileInput = useRef(null)
  const addImageClick = () => {
    hiddenFileInput.current.click()
  }

  const onAddImage = async (newImage) => {
    if (newImage) {
      var img = document.createElement('img')

      img.onload = async () => {
        if (img.width < 100 || img.height < 100) modalsFunc.minimalSize()
        else {
          modalsFunc.cropImage(newImage, img, aspect, (newImage) => {
            setAddingImage(true)
            sendImage(
              newImage,
              (imagesUrls) => onChange([...images, ...imagesUrls]),
              directory,
              null,
              imageFolder
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
  }

  useEffect(() => setAddingImage(false), [images])

  useEffect(() => {}, [])

  return (
    <InputWrapper
      label={label}
      labelClassName={labelClassName}
      onChange={onChange}
      value={images}
      className={cn('flex-1', className)}
      required={required}
      error={error}
      fullWidth={fullWidth}
      noBorder={readOnly}
      noMargin={noMargin}
      smallMargin={smallMargin}
      paddingY={paddingY}
      paddingX={paddingX}
    >
      <div className="flex flex-wrap w-full gap-1 p-0.5">
        {images.length > 0 &&
          images.map((image, index) => (
            <m.div
              key={image}
              className="relative w-20 h-20 overflow-hidden border border-gray-300 group"
              layout
              transition={{ duration: 0.2, type: 'just' }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                className="object-cover w-20 h-20"
                src={image}
                alt="item_image"
                width="0"
                height="0"
                sizes="100vw"
              />

              {!readOnly && (
                <div className="absolute top-0 right-0 flex justify-end p-1 duration-200 transform bg-white rounded-bl-full cursor-pointer w-7 h-7 laptop:-top-5 laptop:group-hover:top-0 laptop:-right-5 laptop:group-hover:right-0 hover:scale-125">
                  <FontAwesomeIcon
                    className="h-4 text-red-700"
                    icon={faTrash}
                    onClick={() => {
                      onChange(images.filter((image, i) => i !== index))
                    }}
                  />
                </div>
              )}
            </m.div>
          ))}
        {!readOnly &&
          !isAddingImage &&
          (!maxImages || images.length < maxImages) && (
            <div
              onClick={addImageClick}
              className="flex items-center justify-center w-20 h-20 bg-white border-2 border-gray-500 cursor-pointer group rounded-xl"
            >
              <div className="flex items-center justify-center w-12 h-12 duration-200 min-w-12 min-h-12 transparent group-hover:scale-125 ">
                <FontAwesomeIcon className="text-gray-700" icon={faPlus} />
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
          <LoadingSpinner
            heightClassName="h-20"
            className="w-20 border border-gray-300 bg-general bg-opacity-20"
          />
        )}
      </div>
    </InputWrapper>
  )
}

export default SelectImage
