import SelectTemplate from '@components/SelectTemplate'
import { useEffect, useState } from 'react'

const selectTemplateFunc = (tool, aspect, onSelect) => {
  const SelectTemplateFuncModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
  }) => {
    const [template, setTemplate] = useState()

    useEffect(() => {
      setOnConfirmFunc(
        template
          ? () => {
              onSelect && onSelect(template)
              closeModal()
            }
          : undefined
      )
    }, [template])

    return (
      <SelectTemplate
        tool={tool}
        selectedTemplate={template}
        onSelect={setTemplate}
        aspect={aspect}
      />
    )
  }

  return {
    title: `Выбор шаблона`,
    declineButtonName: 'Закрыть',
    closeButtonShow: true,
    Children: SelectTemplateFuncModal,
  }
}

export default selectTemplateFunc
