import cn from 'classnames'
import { m } from 'framer-motion'
import { useEffect, useState } from 'react'
import InputWrapper from './InputWrapper'
import LoadingSpinner from './LoadingSpinner'
import { getData } from '@helpers/CRUD'

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
}) => {
  const [isLoading, setIsLoading] = useState(true)

  const [templates, setTemplates] = useState([])

  useEffect(() => {
    const loadTemplates = async () => {
      const response = await getData('/api/templates', { tool })
      setTemplates(response)
      setIsLoading(false)
    }
    loadTemplates()
  }, [])

  if (isLoading) return <LoadingSpinner />

  if (templates?.length === 0) return <div>Нет сохраненных шаблонов</div>

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
      <div className="flex flex-wrap w-full gap-1 p-0.5">
        {templates?.length > 0 &&
          templates.map((template, index) => (
            <m.div
              key={template._id}
              className={cn(
                'flex items-center justify-center flex-col relative w-40 overflow-hidden group border-2 cursor-pointer',
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
                className="w-40 h-full object-fit max-w-40"
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
            </m.div>
          ))}
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
            className="w-20 border border-gray-300 bg-general bg-opacity-20"
          />
        )} */}
      </div>
    </InputWrapper>
  )
}

export default SelectTemplate
