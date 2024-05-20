import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus'
// import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash'
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
// import Image from 'next/image'
import { getData } from '@helpers/CRUD'

const SelectImage = ({
  selectedImage,
  onSelect,
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
  const [isLoading, setIsLoading] = useState(true)

  const [images, setImages] = useState([])

  console.log('aspect :>> ', aspect)

  useEffect(() => {
    const loadImages = async () =>
      await getData(
        'https://api.escalioncloud.ru/api/files',
        { directory: `${imageFolder}/${directory}`, noFolders: true },
        (response) => {
          setImages(
            response.map(
              (imageName) =>
                `https://escalioncloud.ru/uploads/${imageFolder}/${directory}/${imageName}`
            ) || []
          )
          setIsLoading(false)
        },
        (error) => console.log('error :>> ', error),
        true
      )
    loadImages()
  }, [])

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
              (imagesUrls) => setImages([...images, ...imagesUrls]),
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

  if (isLoading) return <LoadingSpinner />

  return (
    <InputWrapper
      label={label}
      labelClassName={labelClassName}
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
      <div className="grid grid-cols-2 phoneH:grid-cols-3 tablet:grid-cols-4 laptop:grid-cols-5 w-full gap-1 p-0.5">
        {images?.length > 0 &&
          images.map((image, index) => (
            <m.div
              key={image}
              className={cn(
                'relative overflow-hidden group border-2 cursor-pointer',
                selectedImage === image
                  ? 'border-general shadow-medium-active'
                  : 'border-gray-300 hover:shadow-active'
              )}
              style={{ aspectRatio: aspect || 1 }}
              layout
              transition={{ duration: 0.2, type: 'just' }}
              onClick={(e) => {
                e.stopPropagation()
                if (onSelect) onSelect(image)
              }}
            >
              {/* <Image
                className="object-cover w-20 h-full"
                src={image}
                alt="item_image"
                width="0"
                height="0"
                sizes="100vw"
              /> */}
              <img
                src={image}
                alt="item_image"
                className="w-full h-full object-fit"
              />
              {/* {!readOnly && (
                <div className="absolute top-0 right-0 z-10 flex justify-end p-1 duration-200 transform bg-white rounded-bl-full w-7 h-7 laptop:-top-5 laptop:group-hover:top-0 laptop:-right-5 laptop:group-hover:right-0 hover:scale-125">
                  <FontAwesomeIcon
                    className="h-4 text-red-700"
                    icon={faTrash}
                    onClick={(e) => {
                      setImages(images.filter((image, i) => i !== index))
                    }}
                  />
                </div>
              )} */}
            </m.div>
          ))}
        {!readOnly &&
          !isAddingImage &&
          (!maxImages || images?.length < maxImages) && (
            <div
              onClick={addImageClick}
              className="flex items-center justify-center bg-white border-2 border-gray-500 cursor-pointer group rounded-xl hover:shadow-active"
              style={{ aspectRatio: aspect || 1 }}
            >
              <div className="flex flex-col items-center justify-center duration-200 transparent group-hover:scale-110">
                <FontAwesomeIcon
                  className="w-12 h-12 text-gray-700 min-w-12 min-h-12"
                  icon={faPlus}
                />
                <div className="text-center">Загрузить новую картинку</div>
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
