import CardButtons from '@components/CardButtons'
import CheckBox from '@components/CheckBox'
import EditableTextarea from '@components/EditableTextarea'
import ErrorsList from '@components/ErrorsList'
import FormWrapper from '@components/FormWrapper'
import Input from '@components/Input'
import InputImage from '@components/InputImage'
import { DEFAULT_ADDITIONAL_BLOCK } from '@helpers/constants'
import useErrors from '@helpers/useErrors'
import additionalBlocksAtom from '@state/atoms/additionalBlocksAtom'
import itemsFuncAtom from '@state/atoms/itemsFuncAtom'
import additionalBlockSelector from '@state/selectors/additionalBlockSelector'
import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'

const additionalBlockFunc = (additionalBlockId, clone = false) => {
  const AdditionalBlockModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
    setTopLeftComponent,
  }) => {
    const additionalBlocks = useRecoilValue(additionalBlocksAtom)

    const additionalBlock = useRecoilValue(
      additionalBlockSelector(additionalBlockId)
    )

    const setAdditionalBlock = useRecoilValue(itemsFuncAtom).additionalBlock.set

    const [title, setTitle] = useState(
      additionalBlock?.title ?? DEFAULT_ADDITIONAL_BLOCK.title
    )
    const [description, setDescription] = useState(
      additionalBlock?.description ?? DEFAULT_ADDITIONAL_BLOCK.description
    )
    const [image, setImage] = useState(
      additionalBlock?.image ?? DEFAULT_ADDITIONAL_BLOCK.image
    )
    const [menuName, setMenuName] = useState(
      additionalBlock?.menuName ?? DEFAULT_ADDITIONAL_BLOCK.menuName
    )
    const [showOnSite, setShowOnSite] = useState(
      additionalBlock?.showOnSite ?? DEFAULT_ADDITIONAL_BLOCK.setShowOnSite
    )
    const [errors, checkErrors, addError, removeError, clearErrors] =
      useErrors()

    const onClickConfirm = async () => {
      if (!checkErrors({ title, description, image })) {
        closeModal()
        setAdditionalBlock(
          {
            _id: additionalBlock?._id,
            title,
            description,
            showOnSite,
            image,
            menuName,
            index: additionalBlock?.index ?? additionalBlocks.length,
          },
          clone
        )
      }
    }

    useEffect(() => {
      const isFormChanged =
        additionalBlock?.title !== title ||
        additionalBlock?.description !== description ||
        additionalBlock?.showOnSite !== showOnSite ||
        additionalBlock?.image !== image ||
        additionalBlock?.menuName !== menuName

      setOnConfirmFunc(isFormChanged ? onClickConfirm : undefined)
      setOnShowOnCloseConfirmDialog(isFormChanged)
      setDisableConfirm(!isFormChanged)
    }, [title, description, showOnSite, image, menuName])

    useEffect(() => {
      if (setTopLeftComponent)
        setTopLeftComponent(() => (
          <CardButtons
            item={additionalBlock}
            typeOfItem="additionalBlock"
            forForm
            showEditButton={false}
            showDeleteButton={false}
          />
        ))
    }, [setTopLeftComponent])

    return (
      <FormWrapper>
        <InputImage
          label="Картинка"
          directory="additionalBlocks"
          image={image}
          onChange={(value) => {
            removeError('image')
            setImage(value)
          }}
          required
          error={errors.image}
        />
        <Input
          label="Название"
          type="text"
          value={title}
          onChange={(value) => {
            removeError('title')
            setTitle(value)
          }}
          error={errors.title}
          required
        />
        <EditableTextarea
          label="Описание"
          html={description}
          uncontrolled={false}
          onChange={(value) => {
            removeError('description')
            setDescription(value)
          }}
          error={errors.description}
          required
        />
        <Input
          label="Название в меню"
          type="text"
          value={menuName}
          onChange={(value) => {
            removeError('menuName')
            setMenuName(value)
          }}
          // labelClassName="w-40"
          error={errors.menuName}
        />
        <CheckBox
          checked={showOnSite}
          labelPos="left"
          // labelClassName="w-40"
          onClick={() => setShowOnSite((checked) => !checked)}
          label="Показывать на сайте"
        />
        <ErrorsList errors={errors} />
      </FormWrapper>
    )
  }

  return {
    title: `${
      additionalBlockId && !clone ? 'Редактирование' : 'Создание'
    } блока`,
    confirmButtonName: additionalBlockId && !clone ? 'Применить' : 'Создать',
    Children: AdditionalBlockModal,
  }
}

export default additionalBlockFunc
