import ComboBox from '@components/ComboBox'
import FormWrapper from '@components/FormWrapper'
import InputWrapper from '@components/InputWrapper'
import SelectImage from '@components/SelectImage'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { deleteData, getData } from '@helpers/CRUD'
import useSnackbar from '@helpers/useSnackbar'
import { modalsFuncAtom } from '@state/atoms'
import locationPropsSelector from '@state/selectors/locationPropsSelector'
import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'

const selectImageFunc = (directory, onSelect) => {
  const SelectImageFuncModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
  }) => {
    const modalsFunc = useRecoilValue(modalsFuncAtom)
    const { imageFolder } = useRecoilValue(locationPropsSelector)
    const snackbar = useSnackbar()

    const [selectedImage, setSelectedImage] = useState()
    const [imagesNames, setImagesNames] = useState([])
    console.log('imagesNames', imagesNames)

    useEffect(() => {
      const loadImages = async () => {
        console.log(
          `https://api.escalioncloud.ru/api/files?directory=${imageFolder}/${directory}`
        )
        const response = await getData(
          'https://api.escalioncloud.ru/api/files',
          { directory: `${imageFolder}/${directory}` },
          (response) => setImagesNames(response || [])
        )
        // console.log({ response })
        // setImagesNames(response)
      }
      loadImages()
    }, [])

    // useEffect(() => {
    //   setOnConfirmFunc(
    //     selectedTemplateId
    //       ? () => {
    //           const template = templates.find(
    //             ({ _id }) => _id === selectedTemplateId
    //           )
    //           onSelect(template.template)
    //           closeModal()
    //         }
    //       : undefined
    //   )
    // }, [selectedTemplateId])

    // if (!imagesNames.length)
    //   return <div>К сожалению не найдено сохраненных картинок</div>

    return (
      <SelectImage
        images={imagesNames.map(
          (imageName) =>
            `https://escalioncloud.ru/uploads/${directory}/${imageName}`
        )}
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
