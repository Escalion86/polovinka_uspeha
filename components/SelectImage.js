import { faArrowLeft } from '@fortawesome/free-solid-svg-icons/faArrowLeft'
import { faFolder } from '@fortawesome/free-solid-svg-icons/faFolder'
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus'
// import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { sendImage } from '@helpers/cloudinary'
import modalsFuncAtom from '@state/modalsFuncAtom'
import cn from 'classnames'
import { m } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useAtomValue } from 'jotai'
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
  maxImages,
  labelClassName,
  className,
  aspect,
  error,
  fullWidth,
  readOnly = false,
  allowFolders = false,
  disableUploadInRoot = false,
  hiddenFolderNames = [],
  noMargin,
  smallMargin,
  paddingY = true,
  paddingX,
}) => {
  const normalizeUploadsUrl = (url) => {
    if (typeof url !== 'string' || !url.includes('/uploads/')) return url
    try {
      const parsed = new URL(url)
      const segments = parsed.pathname.split('/').map((segment) => {
        try {
          return decodeURIComponent(segment)
        } catch {
          return segment
        }
      })
      parsed.pathname = segments.join('/')
      return parsed.toString()
    } catch {
      return url
    }
  }

  const modalsFunc = useAtomValue(modalsFuncAtom)
  const { imageFolder } = useAtomValue(locationPropsSelector)
  const [isAddingImage, setAddingImage] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [currentDirectory, setCurrentDirectory] = useState(directory || '')
  const [folders, setFolders] = useState([])

  const [images, setImages] = useState([])
  const hiddenFolderSet = useMemo(
    () =>
      new Set(
        (Array.isArray(hiddenFolderNames) ? hiddenFolderNames : [])
          .map((name) => String(name || '').trim().toLowerCase())
          .filter(Boolean)
      ),
    [hiddenFolderNames]
  )

  useEffect(() => {
    setCurrentDirectory(directory || '')
  }, [directory])

  const joinPath = (...parts) =>
    parts
      .filter(Boolean)
      .flatMap((part) => String(part).split('/').filter(Boolean))
      .join('/')

  const buildUploadsUrl = useCallback(
    (dirPath, fileNameOrPath) => {
      if (typeof fileNameOrPath === 'string' && fileNameOrPath.startsWith('http')) {
        return normalizeUploadsUrl(fileNameOrPath)
      }
      const cleanImageFolder = String(imageFolder || '').trim().replace(/^\/+|\/+$/g, '')
      const cleanDirPath = String(dirPath || '').trim().replace(/^\/+|\/+$/g, '')
      const cleanPath = String(fileNameOrPath || '')
        .trim()
        .replace(/^\/+|\/+$/g, '')

      const pathParts = cleanPath.split('/').filter(Boolean)
      const startsWithImageFolder =
        cleanImageFolder && pathParts[0] === cleanImageFolder

      const safePath = (
        startsWithImageFolder
          ? pathParts
          : [cleanImageFolder, cleanDirPath, cleanPath]
              .filter(Boolean)
              .flatMap((part) => String(part).split('/').filter(Boolean))
      )
        .map((part) => encodeURIComponent(part))
        .join('/')

      return normalizeUploadsUrl(`https://cloud.escalion.ru/uploads/${safePath}`)
    },
    [imageFolder]
  )

  const loadImages = useCallback(async () => {
    setIsLoading(true)
    await getData(
      '/api/escalioncloud/files',
      allowFolders
        ? { directory: joinPath(imageFolder, currentDirectory) }
        : { directory: joinPath(imageFolder, currentDirectory), noFolders: true },
      (response) => {
        const list = Array.isArray(response) ? response : []

        if (!allowFolders) {
          setImages(
            list
              .map((item) => (typeof item === 'string' ? item : item?.name))
              .filter(Boolean)
              .map((fileName) => buildUploadsUrl(currentDirectory, fileName))
          )
          setFolders([])
          setIsLoading(false)
          return
        }

        const folderNames = []
        const fileNames = []

        list.forEach((entry) => {
          const rawName = typeof entry === 'string' ? entry : entry?.name || entry?.path
          if (!rawName) return
          const entryName = String(rawName).replace(/^\/+|\/+$/g, '')
          if (!entryName) return
          const hasIsFileFlag =
            typeof entry === 'object' && entry !== null && typeof entry?.isFile === 'boolean'
          const inferredFolder =
            (hasIsFileFlag
              ? !entry.isFile
              : typeof entry === 'object' &&
                (entry?.isFolder ||
                  entry?.isDir ||
                  entry?.directory ||
                  entry?.type === 'folder' ||
                  entry?.kind === 'folder')) ||
            String(rawName).endsWith('/')

          if (inferredFolder) {
            folderNames.push(entryName.split('/').pop())
          } else {
            fileNames.push(entryName)
          }
        })

        setFolders(
          Array.from(
            new Set(
              folderNames
                .filter(Boolean)
                .filter(
                  (folderName) =>
                    !hiddenFolderSet.has(String(folderName).toLowerCase())
                )
            )
          ).sort((a, b) => a.localeCompare(b, 'ru'))
        )
        setImages(
          fileNames
            .filter(Boolean)
            .map((fileName) => buildUploadsUrl(currentDirectory, fileName))
        )
        setIsLoading(false)
      },
      (error) => {
        console.log('error :>> ', error)
        setIsLoading(false)
      }
    )
  }, [
    allowFolders,
    buildUploadsUrl,
    currentDirectory,
    hiddenFolderSet,
    imageFolder,
  ])

  useEffect(() => {
    loadImages()
  }, [loadImages])

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
              () => loadImages(),
              currentDirectory,
              null,
              imageFolder,
              (errorMessage) => {
                setAddingImage(false)
                modalsFunc.error({
                  title: 'Ошибка загрузки',
                  text:
                    errorMessage ||
                    'Не удалось загрузить изображение. Попробуйте еще раз.',
                })
              }
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

  const canGoBack = allowFolders && currentDirectory !== (directory || '')
  const normalizedRootDirectory = String(directory || '').replace(/^\/+|\/+$/g, '')
  const normalizedCurrentDirectory = String(currentDirectory || '').replace(
    /^\/+|\/+$/g,
    ''
  )
  const isAtRootDirectory =
    !allowFolders || normalizedCurrentDirectory === normalizedRootDirectory
  const isUploadDisabledInCurrentDirectory =
    disableUploadInRoot && isAtRootDirectory
  const displayedDirectory = (() => {
    if (!allowFolders) return currentDirectory || directory || ''
    if (!normalizedCurrentDirectory || normalizedCurrentDirectory === normalizedRootDirectory)
      return '/'
    if (
      normalizedRootDirectory &&
      normalizedCurrentDirectory.startsWith(`${normalizedRootDirectory}/`)
    ) {
      return `/${normalizedCurrentDirectory.slice(normalizedRootDirectory.length + 1)}`
    }
    return `/${normalizedCurrentDirectory}`
  })()
  const onClickBack = () => {
    const rootPath = normalizedRootDirectory
    const currentPath = normalizedCurrentDirectory
    if (!currentPath || currentPath === rootPath) return

    const currentParts = currentPath.split('/').filter(Boolean)
    const rootParts = rootPath.split('/').filter(Boolean)
    if (currentParts.length <= rootParts.length) {
      setCurrentDirectory(rootPath)
      return
    }
    setCurrentDirectory(currentParts.slice(0, -1).join('/'))
  }

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
      <div className="flex flex-col w-full">
        {allowFolders && (
          <div className="flex items-center w-full gap-2 px-1 pb-1">
            <button
              type="button"
              aria-label="Назад"
              disabled={!canGoBack}
              onClick={onClickBack}
              className={cn(
                'flex items-center justify-center w-7 h-7 rounded-full border transition-colors',
                canGoBack
                  ? 'border-gray-300 text-gray-600 hover:bg-gray-100'
                  : 'border-gray-200 text-gray-300 cursor-not-allowed'
              )}
            >
              <FontAwesomeIcon icon={faArrowLeft} className="w-3.5 h-3.5" />
            </button>
            <div className="text-xs text-gray-600 break-all">{displayedDirectory}</div>
          </div>
        )}
        <div className="grid grid-cols-2 phoneH:grid-cols-3 tablet:grid-cols-4 laptop:grid-cols-5 w-full gap-1 p-0.5">
        {allowFolders &&
          folders.map((folderName) => (
            <m.div
              key={`folder_${currentDirectory}_${folderName}`}
              className="relative overflow-hidden group border-2 cursor-pointer border-gray-300 hover:shadow-active bg-gradient-to-b from-white to-gray-50 rounded-md"
              style={{ aspectRatio: aspect || 1 }}
              layout
              transition={{ duration: 0.2, type: 'just' }}
              onClick={(e) => {
                e.stopPropagation()
                const nextDirectory = joinPath(currentDirectory, folderName)
                setCurrentDirectory(nextDirectory)
              }}
            >
              <div className="flex flex-col items-center justify-center w-full h-full p-2">
                <FontAwesomeIcon
                  className="w-14 h-14 text-yellow-500 drop-shadow-sm"
                  icon={faFolder}
                />
                <div className="mt-2 text-xs font-semibold text-center text-gray-700 break-all max-w-full px-1">
                  {folderName}
                </div>
              </div>
            </m.div>
          ))}
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
          !isUploadDisabledInCurrentDirectory &&
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
            className="w-20 border border-gray-300 bg-general/20"
          />
        )}
        </div>
      </div>
    </InputWrapper>
  )
}

export default SelectImage
