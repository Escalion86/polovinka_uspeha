import { faDownload } from '@fortawesome/free-solid-svg-icons/faDownload'
import SelectImage from '@components/SelectImage'
import { useCallback, useEffect, useState } from 'react'

const selectImageFunc = (directory, aspect, onSelect, options = {}) => {
  const SelectImageFuncModal = ({
    closeModal,
    setOnConfirmFunc,
    setBottomLeftButtonProps,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
  }) => {
    // const modalsFunc = useAtomValue(modalsFuncAtom)
    // const { imageFolder } = useAtomValue(locationPropsSelector)
    // const snackbar = useSnackbar()

    const [selectedImage, setSelectedImage] = useState()

    const getFileNameFromUrl = (url) => {
      try {
        const parsed = new URL(url)
        const rawName = parsed.pathname.split('/').pop() || 'image'
        const decodedName = decodeURIComponent(rawName)
        return decodedName || 'image'
      } catch {
        return 'image'
      }
    }

    const downloadSelectedImage = useCallback(async () => {
      if (!selectedImage) return

      const fileName = getFileNameFromUrl(selectedImage)
      try {
        const proxyUrl = `/api/image-proxy?url=${encodeURIComponent(selectedImage)}`
        const response = await fetch(proxyUrl, { cache: 'no-store' })
        if (!response.ok) throw new Error('Download failed')

        const blob = await response.blob()
        const objectUrl = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = objectUrl
        link.download = fileName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(objectUrl)
      } catch {
        const fallbackLink = document.createElement('a')
        fallbackLink.href = selectedImage
        fallbackLink.target = '_blank'
        fallbackLink.rel = 'noopener noreferrer'
        fallbackLink.download = fileName
        document.body.appendChild(fallbackLink)
        fallbackLink.click()
        document.body.removeChild(fallbackLink)
      }
    }, [selectedImage])
    // const [imagesNames, setImagesNames] = useState([])
    // console.log('imagesNames', imagesNames)

    // useEffect(() => {
    //   const loadImages = async () => {
    //     // console.log(
    //     //   `https://cloud.escalion.ru/api/files?directory=${imageFolder}/${directory}`
    //     // )
    //     // const response = await getData(
    //     //   'https://cloud.escalion.ru/api/files',
    //     //   { directory: `${imageFolder}/${directory}` },
    //     //   (response) => setImagesNames(response || [])
    //     // )

    //     const response = await getData(
    //       'https://cloud.escalion.ru/api/files',
    //       { directory: `${imageFolder}/${directory}/preview` },
    //       (response) => setImagesNames(response || []),
    //       (error) => console.log('error :>> ', error),
    //       true
    //     )

    //     console.log({ response })
    //     // setImagesNames(response)
    //   }
    //   loadImages()
    // }, [])

    useEffect(() => {
      setOnConfirmFunc(
        selectedImage
          ? () => {
              onSelect && onSelect(selectedImage)
              closeModal()
            }
          : undefined
      )
    }, [closeModal, onSelect, selectedImage, setOnConfirmFunc])

    useEffect(() => {
      if (!setBottomLeftButtonProps) return
      setBottomLeftButtonProps(
        selectedImage
          ? {
              name: 'Скачать',
              icon: faDownload,
              onClick: downloadSelectedImage,
            }
          : undefined
      )
      return () => setBottomLeftButtonProps(undefined)
    }, [downloadSelectedImage, selectedImage, setBottomLeftButtonProps])

    // if (!imagesNames.length)
    //   return <div>К сожалению не найдено сохраненных картинок</div>

    return (
      <SelectImage
        selectedImage={selectedImage}
        onSelect={setSelectedImage}
        directory={directory}
        aspect={aspect}
        allowFolders={Boolean(options?.allowFolders)}
        disableUploadInRoot={Boolean(options?.disableUploadInRoot)}
        hiddenFolderNames={Array.isArray(options?.hiddenFolderNames) ? options.hiddenFolderNames : []}
        // images={imagesNames.map(
        //   (imageName) =>
        //     `https://cloud.escalion.ru/uploads/${imageFolder}/${directory}/preview/${imageName}`
        // )}
      />
    )
  }

  return {
    title: `Выбор картинки`,
    declineButtonName: 'Закрыть',
    closeButtonShow: true,
    Children: SelectImageFuncModal,
  }
}

export default selectImageFunc
