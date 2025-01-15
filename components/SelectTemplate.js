import cn from 'classnames'
import { m } from 'framer-motion'
import { useEffect, useState } from 'react'
import InputWrapper from './InputWrapper'
import LoadingSpinner from './LoadingSpinner'
import { deleteData, getData } from '@helpers/CRUD'
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import modalsFuncAtom from '@state/atoms/modalsFuncAtom'
import { useAtomValue } from 'jotai'
import { faPencil } from '@fortawesome/free-solid-svg-icons/faPencil'
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash'
import useSnackbar from '@helpers/useSnackbar'
import locationAtom from '@state/atoms/locationAtom'

const SelectTemplate = ({
  selectedTemplate,
  onSelect,
  required = false,
  label = null,
  tool,
  labelClassName,
  className,
  aspect,
  error,
  fullWidth,
  readOnly = false,
  noMargin,
  smallMargin,
  paddingY = true,
  paddingX,
  templateToCreateNew,
  onSave,
}) => {
  const location = useAtomValue(locationAtom)
  const modalsFunc = useAtomValue(modalsFuncAtom)
  const snackbar = useSnackbar()

  const [isLoading, setIsLoading] = useState(true)

  const [templates, setTemplates] = useState([])

  useEffect(() => {
    const loadTemplates = async () => {
      const response = await getData(`/api/${location}/templates`, { tool })
      setTemplates(response)
      setIsLoading(false)
    }
    loadTemplates()
  }, [location])

  if (isLoading) return <LoadingSpinner />

  if (templates?.length === 0 && !templateToCreateNew)
    return <div>Нет сохраненных шаблонов</div>

  return (
    <InputWrapper
      label={label}
      labelClassName={labelClassName}
      value={selectedTemplate}
      className={cn('flex-1', className)}
      required={required}
      error={error}
      fullWidth={fullWidth}
      noBorder={readOnly}
      noMargin={noMargin}
      smallMargin={smallMargin}
      paddingY={paddingY}
      paddingX={paddingX}
    >
      <div className="grid grid-cols-2 phoneH:grid-cols-3 tablet:grid-cols-4 laptop:grid-cols-5 w-full gap-1 p-0.5">
        {templates?.length > 0 &&
          templates.map((template, index) => (
            <m.div
              key={template._id}
              className={cn(
                'flex items-center justify-center flex-col relative overflow-hidden group border-2 cursor-pointer',
                selectedTemplate?._id === template._id
                  ? 'border-general shadow-medium-active'
                  : 'border-gray-300'
              )}
              layout
              transition={{ duration: 0.2, type: 'just' }}
              onClick={(e) => {
                e.stopPropagation()
                if (onSelect) onSelect(template)
              }}
            >
              {/* <Image
                className="object-cover w-20 h-full"
                src={image}
                alt="item_image"
                width="0"
                height="0"
                sizes="100vw"
              /> */}
              <img
                src={template.template.preview}
                alt="item_image"
                className="w-full object-fit"
                style={{ aspectRatio: aspect || 1 }}
              />
              {/* {!readOnly && (
                <div className="absolute top-0 right-0 z-10 flex justify-end p-1 duration-200 transform bg-white rounded-bl-full w-7 h-7 laptop:-top-5 laptop:group-hover:top-0 laptop:-right-5 laptop:group-hover:right-0 hover:scale-125">
                  <FontAwesomeIcon
                    className="h-4 text-red-700"
                    icon={faTrash}
                    onClick={(e) => {
                      setImages(images.filter((image, i) => i !== index))
                    }}
                  />
                </div>
              )} */}
              <div className="text-sm border-t border-gray-300">
                {template.name}
              </div>
              <div className="absolute top-0 right-0 flex justify-end p-1 duration-200 transform bg-white rounded-bl-full cursor-pointer w-7 h-7 laptop:-top-5 laptop:group-hover:top-0 laptop:-right-5 laptop:group-hover:right-0 hover:scale-125">
                <FontAwesomeIcon
                  className="h-4 text-orange-500"
                  icon={faPencil}
                  onClick={() => {
                    modalsFunc.template.rename(
                      template._id,
                      template.name,
                      (renamedTemplate) =>
                        setTemplates((state) =>
                          state.map((template) =>
                            template._id === renamedTemplate._id
                              ? renamedTemplate
                              : template
                          )
                        )
                    )
                  }}
                />
              </div>
              <div className="absolute top-0 left-0 flex p-1 duration-200 transform bg-white rounded-br-full cursor-pointer w-7 h-7 laptop:-top-5 laptop:group-hover:top-0 laptop:-left-5 laptop:group-hover:left-0 hover:scale-125">
                <FontAwesomeIcon
                  className="h-4 text-danger"
                  icon={faTrash}
                  onClick={() =>
                    modalsFunc.add({
                      title: 'Удаление шаблона',
                      text: `Вы действительно хотите удалить шаблон "${template.name}"?`,
                      onConfirm: async () =>
                        await deleteData(
                          `/api/${location}/templates/` + template._id,
                          () => {
                            snackbar.success('Шаблон удален')
                            setTemplates((state) =>
                              state.filter(({ _id }) => template._id !== _id)
                            )
                          },
                          () => snackbar.error('Не удалось удалить шаблон')
                        ),
                    })
                  }
                />
              </div>
            </m.div>
          ))}
        {templateToCreateNew && (
          <div
            onClick={() =>
              modalsFunc.template.add(tool, templateToCreateNew, onSave)
            }
            className="flex items-center justify-center bg-white border-2 border-gray-500 cursor-pointer group rounded-xl"
            style={{ aspectRatio: aspect || 1 }}
          >
            <div className="flex flex-col items-center justify-center duration-200 min-w-12 min-h-12 transparent group-hover:scale-110 ">
              <FontAwesomeIcon
                className="w-12 h-12 text-gray-700 min-w-12 min-h-12"
                icon={faPlus}
              />
              <div>Новый шаблон</div>
            </div>
          </div>
        )}
        {/* {!readOnly &&
          !isAddingImage &&
          (!maxImages || images?.length < maxImages) && (
            <div
              onClick={addImageClick}
              className="flex items-center justify-center w-24 bg-white border-2 border-gray-500 cursor-pointer group rounded-xl"
              style={{ aspectRatio: aspect || 1 }}
            >
              <div className="flex items-center justify-center duration-200 w-14 aspect-1 min-w-12 transparent group-hover:scale-125 ">
                <FontAwesomeIcon className="text-gray-700" icon={faPlus} />
                <input
                  type="file"
                  ref={hiddenFileInput}
                  onChange={(e) => onAddImage(e.target.files[0])}
                  onClick={(e) => {
                    e.target.value = null
                  }}
                  style={{ display: 'none' }}
                  accept="image/jpeg,image/png"
                />
              </div>
            </div>
          )}
        {isAddingImage && (
          <LoadingSpinner
            heightClassName="h-20"
            className="w-20 border border-gray-300 bg-general/20"
          />
        )} */}
      </div>
    </InputWrapper>
  )
}

export default SelectTemplate
