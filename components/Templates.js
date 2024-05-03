import { useRecoilValue } from 'recoil'

const { modalsFuncAtom } = require('@state/atoms')
const { default: Button } = require('./Button')
const { default: InputWrapper } = require('./InputWrapper')

const Templates = ({ tool, onSelect, template, templateFunc }) => {
  const modalsFunc = useRecoilValue(modalsFuncAtom)

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
        onClick={() => modalsFunc.template.select(tool, onSelect)}
      />
      <Button
        name="Сохранить шаблон"
        onClick={async () =>
          modalsFunc.template.save(
            tool,
            templateFunc ? await templateFunc() : template
          )
        }
      />
    </InputWrapper>
  )
}

export default Templates
