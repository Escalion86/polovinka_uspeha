import Button from '@components/Button'
import ColorPicker from '@components/ColorPicker'
import ComboBox from '@components/ComboBox'
import Input from '@components/Input'
import InputSvgFrame from '@components/InputSvgFrame'
import InputWrapper from '@components/InputWrapper'
import { SelectEvent } from '@components/SelectItem'
import {
  SvgBackgroundComponent,
  SvgBackgroundInput,
} from '@components/SvgBackground'
import frames from '@components/frames/frames'
import dateToDateTimeStr from '@helpers/dateToDateTimeStr'
import eventsAtom from '@state/atoms/eventsAtom'
import { useState } from 'react'
import { useRecoilValue } from 'recoil'
import { saveSvgAsPng } from 'save-svg-as-png'

const save = async (name) => {
  const input = document.querySelector('#input')
  saveSvgAsPng(input, name)
}

const ToolsEventAnonsContent = () => {
  const events = useRecoilValue(eventsAtom)
  const [customMode, setCustomMode] = useState(false)
  const [customDate1, setCustomDate1] = useState('')
  const [customDate2, setCustomDate2] = useState('')
  const [customText, setCustomText] = useState('')

  const [eventId, setEventId] = useState(null)
  const [frameId, setFrameId] = useState(null)
  const [frameColor, setFrameColor] = useState('#ffffff')

  const [startX, setStartX] = useState(540)
  const [startY, setStartY] = useState(800)
  const [dateStartY, setDateStartY] = useState(300)
  const [dateColor, setDateColor] = useState('#ffffff')
  const [anonsColor, setAnonsColor] = useState('#ffffff')
  const [backgroundProps, setBackgroundProps] = useState()

  const [fontSize, setFontSize] = useState(130)
  const [dateFontSize, setDateFontSize] = useState(120)

  var Frame = () => null
  if (frameId) {
    const frame = frames.find(({ id }) => id === frameId)
    if (frame) Frame = frame.Frame
  }

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
    if (chars + wordLength > 1900 / fontSize) {
      ++line
      chars = 0
    }
    chars += wordLength
    textArray[line] = textArray[line] ? textArray[line] + ' ' + word : word
  })

  const [dayStart, monthStart, weekStart] = dateToDateTimeStr(
    event?.dateStart,
    true,
    true,
    false,
    true,
    true
  )
  const [dayEnd, monthEnd] = dateToDateTimeStr(
    event?.dateEnd,
    true,
    true,
    false,
    true,
    true
  )

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
              label="Дата 1 строка"
              type="text"
              className="w-44"
              // inputClassName="w-16"
              value={customDate1}
              onChange={setCustomDate1}
              // noMargin
            />
            <Input
              label="Дата 2 строка"
              type="text"
              className="w-44"
              // inputClassName="w-16"
              value={customDate2}
              onChange={setCustomDate2}
              // noMargin
            />
            <Input
              label="Текст"
              type="text"
              className="w-60"
              // inputClassName="w-16"
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
            // required
            // showEventUsersButton
            // showPaymentsButton
            // showEditButton
            // clearButton={!isEventClosed && !fixedEventId}
            // readOnly={isEventClosed}
            // readOnly={fixedEventId}
          />
        )}
        <div className="flex items-start gap-2">
          <InputSvgFrame frameId={frameId} onChange={setFrameId} />
          {frameId && (
            <ColorPicker
              label="Цвет рамки"
              value={frameColor}
              onChange={setFrameColor}
            />
          )}
        </div>
      </div>
      <div className="flex flex-wrap items-end gap-x-1">
        <SvgBackgroundInput
          // value={backgroundProps}
          onChange={setBackgroundProps}
          imageAspect={1}
        />
        {/* <Input
          label="Позиция по X текста"
          type="number"
          className="w-[128px]"
          inputClassName="w-[64px]"
          value={startX}
          onChange={(value) => setStartX(parseInt(value))}
          min={0}
          max={1000}
          // noMargin
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
              // noMargin
            />
            <Input
              label="Позиция по Y"
              type="number"
              className="w-[128px]"
              inputClassName="w-[64px]"
              value={dateStartY}
              onChange={(value) => setDateStartY(parseInt(value))}
              min={0}
              max={1000}
            />
            <ColorPicker
              label="Цвет"
              value={dateColor}
              onChange={setDateColor}
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
              // noMargin
            />
            <Input
              label="Позиция по Y"
              type="number"
              className="w-[128px]"
              inputClassName="w-[64px]"
              value={startY}
              onChange={(value) => setStartY(parseInt(value))}
              min={0}
              max={1000}
            />
            <ColorPicker
              label="Цвет"
              value={anonsColor}
              onChange={setAnonsColor}
            />
          </div>
        </InputWrapper>
      </div>
      {/* <div style={{ height: 1920, width: 1080 }}>
        <img src={src} height={1920} width={1080} />
      </div> */}
      <div className="flex items-center gap-x-2">
        <Button
          name="Сохранить"
          onClick={() =>
            save('Анонс' + (event?.title ? ' ' + event?.title : ''))
          }
        />
        <div>Картинка 1080х1080</div>
      </div>
      {/* <image id="preview1" height="1920" width="1080" /> */}
      <div className="flex py-2 overflow-x-auto gap-x-1 max-h-[calc(100vh-160px)] overflow-y-auto">
        <svg
          // key={month + year + index}
          width="480"
          height="480"
          viewBox="0 0 1080 1080"
          id="input"
          className="min-w-[270px]"
        >
          <SvgBackgroundComponent {...backgroundProps} />
          <Frame fill={frameColor} />
          {customMode || (dayStart && monthStart) ? (
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
          ) : null}
          {(customMode || eventId) &&
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
                  {/* {event.title} */}
                  {/* Катание на лимузине по елкам */}
                  {textLine}
                </text>
                // <text
                //   key={textLine + lineNum}
                //   x={startX + 90 + startXadd + 50}
                //   y={
                //     startY +
                //     338 +
                //     titleGap +
                //     startYadd +
                //     10 +
                //     index * gap +
                //     (index + 1) * dateTextGap +
                //     index * dateFontSize +
                //     // 20 +
                //     addedLines * fontSize
                //     // lineNum * lineHeight
                //   }
                //   fontSize={fontSize}
                //   fill={textColor}
                //   width={800}
                //   className="max-w-[800px]"
                // >
                //   {textLine}
                // </text>
              )
            })}
          {/* <SvgFrame1 width="1080" height="1080" /> */}
          {/* <svg
            version="1.0"
            xmlns="http://www.w3.org/2000/svg"
            width="1080"
            height="1080"
            viewBox="0 0 1280.000000 1280.000000"
            preserveAspectRatio="xMidYMid meet"
          >
            <g
              transform="translate(0.000000,1280.000000) scale(0.100000,-0.100000)"
              fill="#ffffff"
              stroke="none"
            >
              <path
                d="M1315 11443 c-269 -38 -511 -226 -622 -483 -69 -161 -64 189 -61
-4185 3 -3755 4 -3953 21 -4010 87 -294 306 -507 591 -575 79 -19 134 -20
1994 -20 l1912 0 36 33 c64 58 55 152 -19 197 -31 20 -65 20 -1907 20 -2078 0
-1948 -4 -2083 67 -130 68 -228 189 -274 338 -17 58 -18 203 -18 3985 l0 3925
24 73 c60 184 214 327 401 373 46 12 866 14 5095 14 l5040 0 75 -23 c41 -13
100 -39 131 -58 116 -70 217 -208 250 -344 12 -46 14 -696 14 -3965 0 -3705
-1 -3913 -18 -3974 -54 -197 -219 -355 -414 -396 -58 -12 -356 -15 -1951 -15
-1624 0 -1887 -2 -1911 -14 -78 -41 -88 -153 -20 -210 l31 -26 1921 0 c1885 0
1924 1 2005 20 277 66 503 285 584 566 l23 79 0 3980 0 3980 -32 95 c-87 255
-268 436 -523 523 l-95 32 -5085 1 c-2797 1 -5098 -1 -5115 -3z"
              />
              <path
                d="M5909 2812 c-275 -91 -360 -415 -180 -684 68 -101 167 -198 361 -353
171 -137 260 -220 290 -268 l17 -28 38 49 c44 58 98 107 295 264 322 257 432
418 432 633 0 143 -49 245 -157 327 -110 83 -297 104 -416 45 -67 -32 -133
-97 -166 -160 l-24 -49 -25 50 c-30 61 -109 136 -172 165 -66 30 -215 34 -293
9z"
              />
            </g>
          </svg> */}
        </svg>
        <img
          id="output"
          alt=""
          width="480"
          height="480"
          className="max-w-[270px] max-h-[270px] hidden"
        />
      </div>
    </div>
  )
}

export default ToolsEventAnonsContent
