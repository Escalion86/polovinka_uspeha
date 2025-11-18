import FormWrapper from '@components/FormWrapper'
import Input from '@components/Input'
import { useEffect, useState } from 'react'

const aiPromptSaveFunc = ({ initialTitle = '', onSubmit }) => {
  const AiPromptSaveModal = ({
    closeModal,
    setOnConfirmFunc,
    setDisableConfirm,
    setConfirmButtonName,
    setDeclineButtonShow,
  }) => {
    const [title, setTitle] = useState(initialTitle)
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
      setConfirmButtonName?.('Сохранить')
      setDeclineButtonShow?.(true)
    }, [setConfirmButtonName, setDeclineButtonShow])

    useEffect(() => {
      setDisableConfirm?.(!title.trim() || isSubmitting)
    }, [isSubmitting, setDisableConfirm, title])

    useEffect(() => {
      if (!onSubmit) return

      setOnConfirmFunc?.(() => () =>
        onSubmit(title, closeModal, setIsSubmitting)
      )
    }, [closeModal, onSubmit, setOnConfirmFunc, title])

    return (
      <FormWrapper flex className="flex-col space-y-2">
        <Input
          label="Название промпта"
          value={title}
          onChange={setTitle}
          autoFocus
        />
      </FormWrapper>
    )
  }

  return {
    title: 'Сохранение промпта',
    closeButtonShow: true,
    Children: AiPromptSaveModal,
  }
}

export default aiPromptSaveFunc
