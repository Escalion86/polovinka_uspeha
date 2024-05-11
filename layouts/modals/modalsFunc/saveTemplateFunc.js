import FormWrapper from '@components/FormWrapper'
import Input from '@components/Input'
import { postData } from '@helpers/CRUD'
import useSnackbar from '@helpers/useSnackbar'
import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'
import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'

const saveTemplateFunc = (tool, template, onConfirm) => {
  const SaveTemplateFuncModal = ({
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
                creatorId: loggedUser._id,
              })
              if (response) {
                snackbar.success('Шаблон сохранен')
                onConfirm && onConfirm(response)
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
    Children: SaveTemplateFuncModal,
  }
}

export default saveTemplateFunc
