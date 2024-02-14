import Button from '@components/Button'
import IconButtonMenu from '@components/ButtonMenu'
import CheckBox from '@components/CheckBox'
import ColorPicker from '@components/ColorPicker'
import Divider from '@components/Divider'
import FormWrapper from '@components/FormWrapper'
import Input from '@components/Input'
import InputWrapper from '@components/InputWrapper'
import {
  SvgBackgroundComponent,
  SvgBackgroundInput,
} from '@components/SvgBackground'
import {
  faArrowDown,
  faArrowUp,
  faAsterisk,
  faEye,
  faEyeSlash,
  faPlus,
  faTrash,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import arrayMove from '@helpers/arrayMove'
import { DEFAULT_IMAGE_CONSTRUCTOR_ITEM } from '@helpers/constants'
import getNoun from '@helpers/getNoun'
import cn from 'classnames'
import { useState } from 'react'
import { uid } from 'uid'

const typesNames = {
  text: 'Текст',
  date: 'Дата',
}

const ObjectItem = ({
  item,
  onChange,
  title,
  index,
  onDelete,
  children,
  onClickUp,
  onClickDown,
}) => (
  <FormWrapper>
    {index >= 0 && <Divider thin />}
    <div className="flex items-center px-1 gap-x-2">
      {/* <div className="ml-2 font-bold text-right min-w-10 w-[10%] text-text leading-[0.875rem]">{`№${
        index + 1
      }.`}</div> */}
      <span className="flex-1 italic font-bold text-gray-600">{title}</span>
      {onClickUp && (
        <div className="flex items-center justify-center p-0.5 duration-200 transform cursor-pointer w-7 h-7 hover:scale-110">
          <FontAwesomeIcon
            className="w-5 h-5 text-disabled"
            icon={faArrowUp}
            size="1x"
            onClick={() => onClickUp(index)}
          />
        </div>
      )}
      {onClickDown && (
        <div className="flex items-center justify-center p-0.5 duration-200 transform cursor-pointer w-7 h-7 hover:scale-110">
          <FontAwesomeIcon
            className="w-5 h-5 text-disabled"
            icon={faArrowDown}
            size="1x"
            onClick={() => onClickDown(index)}
          />
        </div>
      )}
      <div className="flex items-center justify-center p-0.5 duration-200 transform cursor-pointer w-7 h-7 hover:scale-110">
        <FontAwesomeIcon
          className="w-5 h-5 text-purple-500"
          icon={item.show ? faEye : faEyeSlash}
          size="1x"
          onClick={() => onChange({ key: item.key, show: !item.show })}
        />
      </div>
      <div className="ml-3 flex items-center justify-center p-0.5 duration-200 transform cursor-pointer w-7 h-7 hover:scale-110">
        <FontAwesomeIcon
          className="w-5 h-5 text-danger"
          icon={faTrash}
          size="1x"
          onClick={() => onDelete(item.key)}
        />
      </div>
    </div>
    {/* <Input
      label="Заголовок (вопрос)"
      value={item.label}
      onChange={(newValue) => onChange({ key: item.key, label: newValue })}
      className="mt-2 mb-1"
      noMargin
    /> */}
    <div className="px-1">{children}</div>
  </FormWrapper>
)

const ListConstructor = ({ list = [], onChange }) => {
  const [listState, setListState] = useState(
    list.map((item) => ({ key: uid(24), value: item }))
  )

  return (
    <>
      <div className="flex flex-col w-full gap-y-1">
        {listState.map(({ key, value }, index) => (
          <div key={key} className="flex items-center gap-x-1">
            <div className="w-6 text-right">{`${index + 1}.`}</div>
            <input
              value={value}
              onChange={(e) => {
                const newList = listState.map((item) =>
                  item.key === key ? { ...item, value: e.target.value } : item
                )
                onChange(newList.map(({ value }) => value))
                setListState(newList)
              }}
              className="flex-1 px-1 border border-gray-400 rounded"
            />
            <div className="flex items-center justify-center p-0.5 duration-200 transform cursor-pointer w-6 h-6 hover:scale-110">
              <FontAwesomeIcon
                className="w-4 h-4 text-danger"
                icon={faTrash}
                size="1x"
                onClick={() => {
                  const newList = listState.filter((item) => item.key !== key)
                  onChange(newList.map(({ value }) => value))
                  setListState(newList)
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="w-full">
        <Button
          name="Добавить пункт списка"
          thin
          onClick={() => {
            const newList = [...listState]
            newList.push({ key: uid(24), value: '' })
            onChange(newList.map(({ value }) => value))
            setListState(newList)
          }}
          icon={faPlus}
        />
      </div>
    </>
  )
}

const ToolsImageConstructorContent = () => {
  const [templateName, setTemplateName] = useState('')
  const [size, setSize] = useState({ w: 480, h: 480 })
  const [data, setData] = useState([])
  const [backgroundProps, setBackgroundProps] = useState()
  console.log('data :>> ', data)

  const setDataStateByIndex = (index) => (key, value) =>
    setData((state) => {
      const newState = [...state]
      newState[index] = {
        ...newState[index],
        params: { ...newState[index].params, [key]: value },
      }
      return newState
    })

  const addItem = (type) => {
    var params = {}
    var defaultValue = null
    if (type === 'customList') {
      params = { minItems: 1, maxItems: 10, withNumbering: false }
      defaultValue = []
    }
    if (type === 'checkList' || type === 'images') {
      defaultValue = []
    }
    setData((state) => [
      ...state,
      {
        ...DEFAULT_IMAGE_CONSTRUCTOR_ITEM,
        type,
        key: uid(24),
        defaultValue,
        params,
      },
    ])
  }

  const deleteItem = (key) => {
    setData((state) => state.filter((item) => item.key !== key))
  }

  const onChange = (obj) => {
    setData((state) =>
      state.map((item) => (item.key === obj.key ? { ...item, ...obj } : item))
    )
  }

  const onClickUp = (index) => {
    setData((state) => arrayMove(state, index, index - 1))
  }

  const onClickDown = (index) => {
    setData((state) => arrayMove(state, index, index + 1))
  }

  return (
    <div className="flex flex-col">
      <FormWrapper className="flex flex-col gap-y-1">
        <div className="px-1">
          <Input
            label="Название шаблона"
            value={templateName}
            onChange={setTemplateName}
            smallMargin
          />
          <div className="flex gap-x-1">
            <Input
              label="Ширина картинки"
              type="number"
              className="w-[128px]"
              inputClassName="w-[64px]"
              value={size.w}
              onChange={(w) => setSize((state) => ({ ...state, w }))}
              min={0}
              max={2000}
              smallMargin
            />
            <Input
              label="Высота картинки"
              type="number"
              className="w-[128px]"
              inputClassName="w-[64px]"
              value={size.h}
              onChange={(h) => setSize((state) => ({ ...state, h }))}
              min={0}
              max={2000}
              smallMargin
            />
            {/* <ColorPicker label="Цвет фона" value={color} onChange={setColor} /> */}
            <SvgBackgroundInput
              // value={backgroundProps}
              onChange={setBackgroundProps}
              imageAspect={size.y > 0 ? size.x / size.y : 1}
            />
          </div>
        </div>
        <div className="flex items-center justify-center flex-1 text-lg font-bold">
          Объекты
        </div>
        {data && data.length > 0 ? (
          <>
            {data.map((item, index) => {
              const setDataState = setDataStateByIndex(index)
              return (
                <ObjectItem
                  key={item.key}
                  item={item}
                  // label={item.label}
                  onChange={onChange}
                  title={typesNames[item.type]}
                  index={index}
                  onDelete={deleteItem}
                  onClickUp={index > 0 && onClickUp}
                  onClickDown={index < data.length - 1 && onClickDown}
                >
                  {item.type === 'text' && (
                    <FormWrapper>
                      <Input
                        label="Текст"
                        type="text"
                        value={item.params?.text ?? ''}
                        onChange={(value) => setDataState('text', value)}
                        fullWidth
                        smallMargin
                      />
                      <div className="flex gap-x-1">
                        <ColorPicker
                          label="Цвет текста"
                          value={item.params?.color}
                          onChange={(value) => setDataState('color', value)}
                          smallMargin
                        />
                        <Input
                          label="Позиция по X"
                          type="number"
                          className="w-[128px]"
                          inputClassName="w-[64px]"
                          value={item.params?.posX ?? 0}
                          onChange={(value) => setDataState('posX', value)}
                          min={0}
                          max={1000}
                          // noMargin
                        />
                        <Input
                          label="Позиция по Y"
                          type="number"
                          className="w-[128px]"
                          inputClassName="w-[64px]"
                          value={item.params?.posY ?? 0}
                          onChange={(value) => setDataState('posY', value)}
                          min={0}
                          max={1000}
                          // noMargin
                        />
                      </div>
                    </FormWrapper>
                  )}
                </ObjectItem>
              )
            })}
            <Divider thin />
          </>
        ) : (
          <div className="flex justify-center w-full">
            {'Нет объектов. Нажмите "+" для создания'}
          </div>
        )}
        <div className="flex justify-center">
          <IconButtonMenu
            // dense
            name="Добавить объект"
            icon={faPlus}
            items={[
              { name: 'Текст', value: 'text' },
              { name: 'Дата', value: 'date' },
            ]}
            onChange={addItem}
          />
        </div>
      </FormWrapper>
      <div className="flex py-2 overflow-x-auto gap-x-1 max-h-[calc(100vh-160px)] overflow-y-auto">
        <svg
          width={size.w}
          height={size.h}
          viewBox={`0 0 ${size.w} ${size.h}`}
          id={'input'}
          className="min-w-[270px]"
        >
          <SvgBackgroundComponent {...backgroundProps} />
          {/* <Frame fill={frameColor} /> */}
          {/* {customMode || (dayStart && monthStart) ? (
            <>
              <text
                // key={textLine + lineNum}
                x={startX}
                y={dateStartY}
                fontSize={dateFontSize}
                fill={dateColor}
                // fontWeight="bold"
                textAnchor="middle"
                fontFamily="AdleryProSwash"
              >
                {customMode
                  ? customDate1
                  : `${dayStart} ${monthStart}${
                      dayStart === dayEnd && monthStart === monthEnd ? '' : ' -'
                    }`}
              </text>
              {(!customMode || customDate2) && (
                <text
                  // key={textLine + lineNum}
                  x={startX}
                  y={dateStartY + dateFontSize}
                  fontSize={dateFontSize}
                  fill={dateColor}
                  // fontWeight="bold"
                  textAnchor="middle"
                  fontFamily="AdleryProSwash"
                >
                  {customMode
                    ? customDate2
                    : dayStart === dayEnd && monthStart === monthEnd
                    ? `(${weekStart})`
                    : `${dayEnd} ${monthEnd}`}
                </text>
              )}
            </>
          ) : null} */}
          {/* {(customMode || eventId) &&
            textArray.map((textLine, lineNum) => {
              // ++addedLines
              return (
                <text
                  key={textLine + lineNum}
                  x={startX}
                  y={
                    startY +
                    lineNum * fontSize -
                    ((textArray.length - 1) * fontSize) / 2
                  }
                  fontSize={fontSize}
                  fill={anonsColor}
                  // fontWeight="bold"
                  textAnchor="middle"
                  fontFamily="AdleryProBlockletter" //"Enchants"
                >
                  {textLine}
                </text>    */}
        </svg>
        <img
          id="output"
          alt=""
          width="270"
          height="480"
          className="max-w-[270px] max-h-[270px] hidden"
        />
      </div>
    </div>
  )
}

export default ToolsImageConstructorContent
