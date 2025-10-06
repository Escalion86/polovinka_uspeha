import FormWrapper from '@components/FormWrapper'
import Input from '@components/Input'
import InputImage from '@components/InputImage'
import Textarea from '@components/Textarea'
import { useEffect, useState } from 'react'

const achievementFunc = (achievement, onSubmit) => {
  const isEdit = Boolean(achievement?._id)

  const AchievementModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
  }) => {
    const initialName = achievement?.name ?? ''
    const initialDescription = achievement?.description ?? ''
    const initialImage = achievement?.image ?? null

    const [name, setName] = useState(initialName)
    const [description, setDescription] = useState(initialDescription)
    const [image, setImage] = useState(initialImage)
    const [nameError, setNameError] = useState('')

    useEffect(() => setNameError(''), [name])

    const hasChanges =
      name !== initialName ||
      description !== initialDescription ||
      (image ?? null) !== (initialImage ?? null)

    useEffect(() => {
      const hasName = Boolean(name.trim())
      setDisableConfirm(!hasName || (isEdit && !hasChanges))
      setOnShowOnCloseConfirmDialog(
        isEdit ? hasChanges : Boolean(name || description || image)
      )
      setOnConfirmFunc(() => {
        if (!name.trim()) {
          setNameError('Укажите название достижения')
          return
        }

        if (isEdit && !hasChanges) return

        closeModal()
        onSubmit({
          name: name.trim(),
          description: description.trim(),
          image: image ?? '',
        })
      })
    }, [
      name,
      description,
      image,
      hasChanges,
      isEdit,
      setDisableConfirm,
      setOnConfirmFunc,
      setOnShowOnCloseConfirmDialog,
    ])

    useEffect(() => {
      setOnDeclineFunc(closeModal)
    }, [closeModal, setOnDeclineFunc])

    return (
      <FormWrapper className="flex flex-col gap-y-3">
        <Input
          label="Название"
          value={name}
          onChange={setName}
          required
          error={nameError}
        />
        <Textarea
          label="Описание"
          value={description}
          onChange={setDescription}
          rows={4}
        />
        <InputImage
          label="Изображение"
          directory="achievements"
          image={image}
          onChange={setImage}
        />
      </FormWrapper>
    )
  }

  return {
    title: `${isEdit ? 'Редактирование' : 'Создание'} достижения`,
    confirmButtonName: isEdit ? 'Сохранить' : 'Создать',
    Children: AchievementModal,
  }
}

export default achievementFunc
