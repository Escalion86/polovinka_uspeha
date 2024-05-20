// import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus'
// import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { sendImage } from '@helpers/cloudinary'
// import { modalsFuncAtom } from '@state/atoms'
import cn from 'classnames'
import { m } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
// import { useRecoilValue } from 'recoil'
import InputWrapper from './InputWrapper'
import LoadingSpinner from './LoadingSpinner'
// import locationPropsSelector from '@state/selectors/locationPropsSelector'
// import Image from 'next/image'
import { getData } from '@helpers/CRUD'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolder } from '@fortawesome/free-regular-svg-icons/faFolder'
import Zoom from 'react-medium-image-zoom'

function isFileFunc(pathname) {
  return pathname.split('/').pop().indexOf('.') > -1
}

const getFileName = (url) => url.substring(url.lastIndexOf('/') + 1) //url.match(/([^\/]+)(?=\.\w+$)/)

const SelectFile = ({
  selectedFile,
  onSelectFile,
  onSelectDir,
  setFilesCount,
  required = false,
  label = null,
  directory,
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
  // const modalsFunc = useRecoilValue(modalsFuncAtom)
  // const { imageFolder } = useRecoilValue(locationPropsSelector)
  const [isLoading, setIsLoading] = useState(true)

  const [files, setFiles] = useState([])

  useEffect(() => {
    const loadImages = async () =>
      await getData(
        'https://api.escalioncloud.ru/api/files',
        { directory },
        (response) => {
          setFiles(
            response.map(
              (fileName) =>
                `https://escalioncloud.ru/uploads/${directory ? directory + '/' : ''}${fileName}`
            ) || []
          )
          setFilesCount(response.length)
          setIsLoading(false)
        },
        (error) => console.log('error :>> ', error),
        true
      )
    loadImages()
  }, [directory])

  if (isLoading) return <LoadingSpinner />

  return (
    // <InputWrapper
    //   label={label}
    //   labelClassName={labelClassName}
    //   value={files}
    //   className={cn('flex-1', className)}
    //   required={required}
    //   error={error}
    //   fullWidth={fullWidth}
    //   noBorder={readOnly}
    //   noMargin={noMargin}
    //   smallMargin={smallMargin}
    //   paddingY={paddingY}
    //   paddingX={paddingX}
    // >
    <div className="grid grid-cols-2 phoneH:grid-cols-3 tablet:grid-cols-4 laptop:grid-cols-5 w-full gap-1 p-0.5">
      {files?.length > 0 &&
        files.map((file, index) => {
          const isFile = isFileFunc(file)
          const fileName = getFileName(file)
          return (
            <m.div
              key={file}
              className={cn(
                'relative overflow-hidden group border-2 cursor-pointer',
                selectedFile === file
                  ? 'border-general shadow-medium-active'
                  : 'border-gray-300 hover:shadow-active'
              )}
              // style={{ aspectRatio: aspect || 1 }}
              layout
              transition={{ duration: 0.2, type: 'just' }}
              onClick={(e) => {
                e.stopPropagation()
                if (isFile) {
                  if (onSelectFile)
                    onSelectFile(
                      `${directory ? directory + '/' : ''}${fileName}`
                    )
                } else {
                  if (onSelectDir)
                    onSelectDir(
                      `${directory ? directory + '/' : ''}${fileName}`
                    )
                }
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
              <div className="flex flex-col items-center justify-center w-full h-full">
                <div className="flex items-center justify-center flex-1">
                  {isFile ? (
                    <Zoom zoomMargin={20}>
                      <img
                        src={file}
                        alt="item_image"
                        className="object-contain w-full h-full aspect-1"
                      />
                    </Zoom>
                  ) : (
                    <FontAwesomeIcon
                      className="w-20 h-20 text-general min-w-20 min-h-20"
                      icon={faFolder}
                    />
                  )}
                </div>
                <div className="flex items-center justify-center w-full h-10 text-sm text-center border-t min-h-10 tablet:text-base">
                  {fileName}
                </div>
              </div>
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
          )
        })}
    </div>
    // </InputWrapper>
  )
}

export default SelectFile
