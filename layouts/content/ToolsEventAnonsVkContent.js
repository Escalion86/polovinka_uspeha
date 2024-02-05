import Button from '@components/Button'
import ColorPicker from '@components/ColorPicker'
import ComboBox from '@components/ComboBox'
import Input from '@components/Input'
import InputWrapper from '@components/InputWrapper'
import { SelectEvent } from '@components/SelectItem'
import {
  SvgBackgroundComponent,
  SvgBackgroundInput,
} from '@components/SvgBackground'
import dateToDateTimeStr from '@helpers/dateToDateTimeStr'
import eventsAtom from '@state/atoms/eventsAtom'
import { useState } from 'react'
import { useRecoilValue } from 'recoil'
import { saveSvgAsPng } from 'save-svg-as-png'

const save = async (name) => {
  const input = document.querySelector('#input')
  saveSvgAsPng(input, name)
}

const ToolsEventAnonsVkContent = () => {
  const events = useRecoilValue(eventsAtom)
  const [customMode, setCustomMode] = useState(false)
  const [customDate, setCustomDate] = useState('')
  const [customTime, setCustomTime] = useState('')
  const [customText, setCustomText] = useState('')

  const [eventId, setEventId] = useState(null)

  const [startX, setStartX] = useState(1014)
  const [startY, setStartY] = useState(780)
  const [dateStartY, setDateStartY] = useState(500)
  const [dateColor, setDateColor] = useState('#C7A082')
  const [timeStartY, setTimeStartY] = useState(1110)
  const [timeColor, setTimeColor] = useState('#C7A082')
  const [lineStartY, setLineStartY] = useState(1000)
  const [lineColor, setLineColor] = useState('#C7A082')
  const [anonsColor, setAnonsColor] = useState('#000000')
  const [backgroundProps, setBackgroundProps] = useState()

  const [fontSize, setFontSize] = useState(112)
  const [dateFontSize, setDateFontSize] = useState(100)
  const [timeFontSize, setTimeFontSize] = useState(100)

  const event = eventId ? events.find(({ _id }) => _id === eventId) : undefined

  const textSplit = customMode
    ? customText.split(' ')
    : event
    ? String(event?.title).split(' ')
    : []

  var chars = 0
  var line = 0
  var textArray = []

  textSplit.forEach((word) => {
    const wordLength = word.length
    if (chars + wordLength > 2000 / fontSize) {
      ++line
      chars = 0
    }
    chars += wordLength
    textArray[line] = textArray[line] ? textArray[line] + ' ' + word : word
  })

  const [dayStart, monthStart, weekStart, yearStart, hourStart, minuteStart] =
    dateToDateTimeStr(event?.dateStart, true, true, false, true, true)
  const [dayEnd, monthEnd, weekEnd, yearEnd, hourEnd, minuteEnd] =
    dateToDateTimeStr(event?.dateEnd, true, true, false, true, true)

  return (
    <div className="h-full max-h-full px-1 overflow-y-auto">
      <ComboBox
        label="Режим"
        className="max-w-[180px]"
        items={[
          { value: 'true', name: 'Ручной ввод' },
          { value: 'false', name: 'Выбор мероприятия' },
        ]}
        value={customMode ? 'true' : 'false'}
        onChange={(value) => setCustomMode(value === 'true')}
      />
      <div className="flex flex-wrap gap-x-1">
        {customMode ? (
          <div className="flex flex-wrap w-full gap-1">
            <Input
              label="Дата"
              type="text"
              className="w-44"
              value={customDate}
              onChange={setCustomDate}
            />
            <Input
              label="Время"
              type="text"
              className="w-44"
              value={customTime}
              onChange={setCustomTime}
            />
            <Input
              label="Текст"
              type="text"
              className="w-60"
              value={customText}
              onChange={setCustomText}
              fullWidth
              noMargin
            />
          </div>
        ) : (
          <SelectEvent
            label="Мероприятие"
            selectedId={eventId}
            onChange={setEventId}
            className="w-full"
          />
        )}
      </div>
      <div className="flex flex-wrap items-end gap-x-1">
        <SvgBackgroundInput
          // value={backgroundProps}
          onChange={setBackgroundProps}
          // imageAspect={2028 / 1536}
        />
        {/* <Input
          label="Позиция по X текста"
          type="number"
          className="w-[128px]"
          inputClassName="w-[64px]"
          value={startX}
          onChange={(value) => setStartX(parseInt(value))}
          min={0}
          max={2000}
        /> */}
        <InputWrapper
          label="Дата"
          paddingX="small"
          paddingY={false}
          centerLabel
        >
          <div className="flex flex-wrap items-center flex-1 gap-x-2">
            <Input
              label="Размер шрифта"
              type="number"
              className="w-[128px]"
              inputClassName="w-[64px]"
              value={dateFontSize}
              onChange={(value) => setDateFontSize(parseInt(value))}
              min={20}
              max={200}
            />
            <Input
              label="Позиция по Y"
              type="number"
              className="w-[128px]"
              inputClassName="w-[64px]"
              value={dateStartY}
              onChange={(value) => setDateStartY(parseInt(value))}
              min={0}
              max={2000}
            />
            <ColorPicker
              label="Цвет"
              value={dateColor}
              onChange={setDateColor}
            />
          </div>
        </InputWrapper>
        <InputWrapper
          label="Время"
          paddingX="small"
          paddingY={false}
          centerLabel
        >
          <div className="flex flex-wrap items-center flex-1 gap-x-2">
            <Input
              label="Размер шрифта"
              type="number"
              className="w-[128px]"
              inputClassName="w-[64px]"
              value={timeFontSize}
              onChange={(value) => setTimeFontSize(parseInt(value))}
              min={20}
              max={200}
            />
            <Input
              label="Позиция по Y"
              type="number"
              className="w-[128px]"
              inputClassName="w-[64px]"
              value={timeStartY}
              onChange={(value) => setTimeStartY(parseInt(value))}
              min={0}
              max={2000}
            />
            <ColorPicker
              label="Цвет"
              value={timeColor}
              onChange={setTimeColor}
            />
          </div>
        </InputWrapper>
        <InputWrapper
          label="Линия"
          paddingX="small"
          paddingY={false}
          centerLabel
        >
          <div className="flex flex-wrap items-center flex-1 gap-x-2">
            <Input
              label="Позиция по Y"
              type="number"
              className="w-[128px]"
              inputClassName="w-[64px]"
              value={lineStartY}
              onChange={(value) => setLineStartY(parseInt(value))}
              min={0}
              max={2000}
            />
            <ColorPicker
              label="Цвет"
              value={lineColor}
              onChange={setLineColor}
            />
          </div>
        </InputWrapper>
        <InputWrapper
          label="Название"
          paddingX="small"
          paddingY={false}
          centerLabel
        >
          <div className="flex flex-wrap items-center flex-1 gap-x-2">
            <Input
              label="Размер шрифта"
              type="number"
              className="w-[128px]"
              inputClassName="w-[64px]"
              value={fontSize}
              onChange={(value) => setFontSize(parseInt(value))}
              min={20}
              max={200}
            />
            <Input
              label="Позиция по Y"
              type="number"
              className="w-[128px]"
              inputClassName="w-[64px]"
              value={startY}
              onChange={(value) => setStartY(parseInt(value))}
              min={0}
              max={2000}
            />
            <ColorPicker
              label="Цвет"
              value={anonsColor}
              onChange={setAnonsColor}
            />
          </div>
        </InputWrapper>
      </div>
      <div className="flex items-center gap-x-2">
        <Button
          name="Сохранить"
          onClick={() =>
            save('Анонс' + (event?.title ? ' ' + event?.title : ''))
          }
        />
        <div>Картинка 2028х1536</div>
      </div>
      <div className="flex py-2 overflow-x-auto gap-x-1 max-h-[calc(100vh-160px)] overflow-y-auto">
        <div className="border-2 border-gray-600">
          <svg
            width="512"
            height="384"
            viewBox="0 0 2028 1536"
            id="input"
            className="min-w-[270px]"
          >
            {/* <image
              // id="preview"
              href="/img/anons/background_vk.png"
              height="100%"
              width="100%"
            /> */}
            <SvgBackgroundComponent {...backgroundProps} />
            <rect
              x="214"
              y="268"
              width="1600"
              height="1000"
              rx="120"
              fill="white"
            />
            <line
              x1="380"
              y1={lineStartY}
              x2="1648"
              y2={lineStartY}
              stroke={lineColor}
              strokeWidth={4}
            />
            {/* <SvgBackgroundComponent {...backgroundProps} /> */}
            {customMode || (dayStart && monthStart) ? (
              <>
                <text
                  x={startX}
                  y={dateStartY}
                  fontSize={dateFontSize}
                  fill={dateColor}
                  textAnchor="middle"
                  fontFamily="Lora"
                  className="font-bold uppercase"
                >
                  {customMode
                    ? customDate
                    : `${dayStart} ${monthStart} (${weekStart})`}
                </text>
                <text
                  x={startX}
                  y={timeStartY}
                  fontSize={timeFontSize}
                  fill={timeColor}
                  textAnchor="middle"
                  fontFamily="Lora"
                  className="font-bold uppercase"
                >
                  {customMode
                    ? customTime
                    : `${hourStart}:${minuteStart} - ${hourEnd}:${minuteEnd}`}
                </text>
              </>
            ) : null}
            {(customMode || eventId) &&
              textArray.map((textLine, lineNum) => {
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
                    textAnchor="middle"
                    fontFamily="Lora" //"Enchants"
                    className="font-bold uppercase"
                  >
                    {textLine}
                  </text>
                )
              })}
          </svg>
        </div>
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

export default ToolsEventAnonsVkContent
