import FormWrapper from '@components/FormWrapper'
import Input from '@components/Input'
import { putData } from '@helpers/CRUD'
import useSnackbar from '@helpers/useSnackbar'
// import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'
import { useEffect, useState } from 'react'
import { useAtomValue } from 'jotai'
import locationAtom from '@state/atoms/locationAtom'

const renameTemplateFunc = (templateId, oldName = '', onSuccess) => {
  const RenameTemplateFuncModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
  }) => {
    const location = useAtomValue(locationAtom)
    const [name, setName] = useState(oldName)
    const snackbar = useSnackbar()

    useEffect(() => {
      setOnConfirmFunc(
        oldName !== name
          ? async () => {
              const response = await putData(
                `/api/${location}/templates/${templateId}`,
                {
                  name,
                }
              )
              if (response) {
                snackbar.success('Имя шаблона изменено')
                onSuccess && onSuccess(response)
                closeModal()
              } else {
                snackbar.error('Не удалось изменить название шаблона')
              }
            }
          : undefined
      )
    }, [name])

    return (
      <FormWrapper flex className="flex-col">
        <Input label="Название шаблона" value={name} onChange={setName} />
      </FormWrapper>
    )
  }

  return {
    title: `Изменение названия шаблона`,
    declineButtonName: 'Закрыть',
    closeButtonShow: true,
    Children: RenameTemplateFuncModal,
  }
}

export default renameTemplateFunc
