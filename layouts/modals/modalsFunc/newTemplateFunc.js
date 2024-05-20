import FormWrapper from '@components/FormWrapper'
import Input from '@components/Input'
import { postData } from '@helpers/CRUD'
import useSnackbar from '@helpers/useSnackbar'
import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'
import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'

const newTemplateFunc = (tool, template, onSave) => {
  const NewTemplateFuncModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
  }) => {
    const loggedUserActive = useRecoilValue(loggedUserActiveAtom)
    const [name, setName] = useState('')
    const snackbar = useSnackbar()

    useEffect(() => {
      setOnConfirmFunc(
        name
          ? async () => {
              const response = await postData('/api/templates', {
                tool,
                name,
                template,
                creatorId: loggedUserActive._id,
              })
              if (response) {
                snackbar.success('Шаблон сохранен')
                onSave && onSave(response)
                closeModal()
              } else {
                snackbar.error('Не удалось сохранить шаблон')
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
    title: `Сохранение шаблона`,
    declineButtonName: 'Закрыть',
    closeButtonShow: true,
    Children: NewTemplateFuncModal,
  }
}

export default newTemplateFunc
