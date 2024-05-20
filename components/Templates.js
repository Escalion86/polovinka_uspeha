import { useState } from 'react'
import { useRecoilValue } from 'recoil'

const { modalsFuncAtom } = require('@state/atoms')
const { default: Button } = require('./Button')
const { default: InputWrapper } = require('./InputWrapper')

const Templates = ({ tool, onSelect, template, aspect, templateFunc }) => {
  const modalsFunc = useRecoilValue(modalsFuncAtom)
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
            modalsFunc.template.save(tool, await templateFunc())
            setLoadingTemplate(false)
          } else {
            modalsFunc.template.save(tool, template)
          }
        }}
        loading={loadingTemplate}
      />
    </InputWrapper>
  )
}

export default Templates
