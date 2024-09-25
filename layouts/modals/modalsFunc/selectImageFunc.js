import SelectImage from '@components/SelectImage'
import { useEffect, useState } from 'react'

const selectImageFunc = (directory, aspect, onSelect) => {
  const SelectImageFuncModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
  }) => {
    // const modalsFunc = useRecoilValue(modalsFuncAtom)
    // const { imageFolder } = useRecoilValue(locationPropsSelector)
    // const snackbar = useSnackbar()

    const [selectedImage, setSelectedImage] = useState()
    // const [imagesNames, setImagesNames] = useState([])
    // console.log('imagesNames', imagesNames)

    // useEffect(() => {
    //   const loadImages = async () => {
    //     // console.log(
    //     //   `https://api.escalioncloud.ru/api/files?directory=${imageFolder}/${directory}`
    //     // )
    //     // const response = await getData(
    //     //   'https://api.escalioncloud.ru/api/files',
    //     //   { directory: `${imageFolder}/${directory}` },
    //     //   (response) => setImagesNames(response || [])
    //     // )

    //     const response = await getData(
    //       'https://api.escalioncloud.ru/api/files',
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
    }, [selectedImage])

    // if (!imagesNames.length)
    //   return <div>К сожалению не найдено сохраненных картинок</div>

    return (
      <SelectImage
        selectedImage={selectedImage}
        onSelect={setSelectedImage}
        directory={directory}
        aspect={aspect}
        // images={imagesNames.map(
        //   (imageName) =>
        //     `https://escalioncloud.ru/uploads/${imageFolder}/${directory}/preview/${imageName}`
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
