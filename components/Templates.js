import { useState } from 'react'
import { useAtomValue } from 'jotai'
import modalsFuncAtom from '@state/atoms/modalsFuncAtom'
import InputWrapper from './InputWrapper'
import Button from './Button'

const Templates = ({
  tool,
  onSelect,
  onSave,
  template,
  aspect,
  templateFunc,
}) => {
  const modalsFunc = useAtomValue(modalsFuncAtom)
  const [loadingTemplate, setLoadingTemplate] = useState(false)

  return (
    <InputWrapper
      label="Шаблоны"
      paddingX="small"
      paddingY
      centerLabel
      wrapperClassName="gap-x-2"
      fitWidth
    >
      <Button
        name="Загрузить шаблон"
        onClick={() => modalsFunc.template.select(tool, aspect, onSelect)}
      />
      <Button
        name="Сохранить шаблон"
        onClick={async () => {
          if (templateFunc) {
            setLoadingTemplate(true)
            modalsFunc.template.save(tool, await templateFunc(), onSave, aspect)
            setLoadingTemplate(false)
          } else {
            modalsFunc.template.save(tool, template, onSave, aspect)
          }
        }}
        loading={loadingTemplate}
      />
    </InputWrapper>
  )
}

export default Templates
