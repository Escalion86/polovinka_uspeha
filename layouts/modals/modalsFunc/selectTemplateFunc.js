import ComboBox from '@components/ComboBox'
import FormWrapper from '@components/FormWrapper'
import InputWrapper from '@components/InputWrapper'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { deleteData, getData } from '@helpers/CRUD'
import useSnackbar from '@helpers/useSnackbar'
import { modalsFuncAtom } from '@state/atoms'
import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'

const selectTemplateFunc = (tool, onSelect) => {
  const SelectTemplateFuncModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
  }) => {
    const modalsFunc = useRecoilValue(modalsFuncAtom)
    const snackbar = useSnackbar()

    const [templates, setTemplates] = useState([])
    const [selectedTemplateId, setSelectedTemplateId] = useState()

    const template = templates.find(({ _id }) => _id === selectedTemplateId)

    const deleteTemplate = async () => {
      const template = templates.find(({ _id }) => _id === selectedTemplateId)
      modalsFunc.confirm({
        title: `Подтверждение удаления шаблона "${template.name}"`,
        text: 'Удаление шаблона будет необратимо! Вы уверены?',
        onConfirm: async () => {
          const response = await deleteData(
            '/api/templates/' + selectedTemplateId
          )

          setTemplates((state) =>
            state.filter(({ _id }) => _id !== selectedTemplateId)
          )
          setSelectedTemplateId()
          snackbar.success('Шаблон удален')
        },
      })
    }

    useEffect(() => {
      const loadTemplates = async () => {
        const response = await getData('/api/templates', { tool })
        setTemplates(response)
      }
      loadTemplates()
    }, [])

    useEffect(() => {
      setOnConfirmFunc(
        selectedTemplateId
          ? () => {
              const template = templates.find(
                ({ _id }) => _id === selectedTemplateId
              )
              onSelect(template.template)
              closeModal()
            }
          : undefined
      )
    }, [selectedTemplateId])

    if (!templates.length)
      return <div>К сожалению не найдено сохраненных шаблонов</div>

    return (
      <>
        <FormWrapper flex className="flex gap-x-2">
          <ComboBox
            label="Шаблон"
            className="max-w-[180px]"
            items={templates.map((template) => ({
              value: template._id,
              name: template.name,
            }))}
            value={selectedTemplateId}
            onChange={setSelectedTemplateId}
            placeholder="Шаблон не выбран"
          />
          {selectedTemplateId && (
            <div
              className="flex items-center self-stretch justify-center p-1 mt-2 text-red-600 duration-300 cursor-pointer hover:scale-110"
              onClick={deleteTemplate}
            >
              <FontAwesomeIcon className="h-5" icon={faTrash} />
            </div>
          )}
        </FormWrapper>
        {template?.template?.preview && (
          <InputWrapper
            label="Предпросмотр"
            paddingX="small"
            paddingY
            // centerLabel
            fitWidth
          >
            <img
              src={template?.template?.preview}
              className="object-fit max-w-[240px] max-h-[240px]"
            />
          </InputWrapper>
        )}
      </>
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
