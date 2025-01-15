import FormWrapper from '@components/FormWrapper'
import Input from '@components/Input'
import SelectTemplate from '@components/SelectTemplate'
import { postData, putData } from '@helpers/CRUD'
import useSnackbar from '@helpers/useSnackbar'
import modalsFuncAtom from '@state/atoms/modalsFuncAtom'
import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'
import { useEffect, useState } from 'react'
import { useAtomValue } from 'jotai'
import locationAtom from '@state/atoms/locationAtom'

const saveTemplateFunc = (tool, template, onSave, aspect) => {
  const SaveTemplateFuncModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
  }) => {
    const location = useAtomValue(locationAtom)
    const modalsFunc = useAtomValue(modalsFuncAtom)
    const loggedUserActive = useAtomValue(loggedUserActiveAtom)
    const [selectedTemplate, setSelectedTemplate] = useState()
    const snackbar = useSnackbar()

    // useEffect(() => {
    //   setOnConfirmFunc(
    //     template
    //       ? () => {
    //           onSave && onSave(template)
    //           closeModal()
    //         }
    //       : undefined
    //   )
    // }, [template])
    useEffect(() => {
      setOnConfirmFunc(
        selectedTemplate
          ? modalsFunc.add({
              title: 'Замена шаблона',
              text: 'Вы уверены что хотите заменить шаблон?',
              onConfirm: async () => {
                const response = await putData(
                  `/api/${location}/templates/${selectedTemplate._id}`,
                  {
                    tool,
                    name: selectedTemplate.name,
                    template,
                    creatorId: loggedUserActive._id,
                  }
                )
                if (response) {
                  snackbar.success('Шаблон сохранен')
                  onSave && onSave(response)
                  closeModal()
                } else {
                  snackbar.error('Не удалось сохранить шаблон')
                }
              },
            })
          : undefined
      )
    }, [selectedTemplate])

    return (
      <SelectTemplate
        tool={tool}
        selectedTemplate={selectedTemplate}
        onSelect={setSelectedTemplate}
        aspect={aspect}
        templateToCreateNew={template}
        onSave={(data) => {
          onSave && onSave(data)
          closeModal()
        }}
        onRename={(data) => {
          setSelectedTemplate(data)
        }}
      />
      // <FormWrapper flex className="flex-col">
      //   <Input label="Название шаблона" value={name} onChange={setName} />
      // </FormWrapper>
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
