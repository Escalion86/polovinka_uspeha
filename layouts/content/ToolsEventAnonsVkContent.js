'use client'

import Button from '@components/Button'
import ColorPicker from '@components/ColorPicker'
import Input from '@components/Input'
import InputWrapper from '@components/InputWrapper'
import {
  SvgBackgroundComponent,
  SvgBackgroundInput,
} from '@components/SvgBackground'
import Templates from '@components/Templates'
import base64ToBlob from '@helpers/base64ToBlob'
import { sendImage } from '@helpers/cloudinary'
import dateToDateTimeStr from '@helpers/dateToDateTimeStr'
import getDaysBetween from '@helpers/getDaysBetween'
import textArrayFunc from '@helpers/textArrayFunc'
import { modalsFuncAtom } from '@state/atoms'
import eventsAtom from '@state/atoms/eventsAtom'
import locationPropsSelector from '@state/selectors/locationPropsSelector'
import { useMemo, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { saveSvgAsPng, svgAsPngUri } from 'save-svg-as-png'

const getPreview = async () => {
  const input = document.querySelector('#input')
  const response = await svgAsPngUri(input, {
    scale: 240 / 2028,
  })
  return response
}

const save = async (name) => {
  const input = document.querySelector('#input')
  saveSvgAsPng(input, name)
}

const ToolsEventAnonsVkContent = () => {
  const modalsFunc = useRecoilValue(modalsFuncAtom)
  const events = useRecoilValue(eventsAtom)
  const { imageFolder } = useRecoilValue(locationPropsSelector)

  const [rerenderState, setRerenderState] = useState(false)
  const rerender = () => setRerenderState((state) => !state)

  const [date1, setDate1] = useState('')
  const [date2, setDate2] = useState('')
  const [time, setTime] = useState('')
  const [text, setText] = useState('')

  const [startX, setStartX] = useState(1014)
  const [startY, setStartY] = useState(800)
  const [dateStartY, setDateStartY] = useState(500)
  const [dateColor, setDateColor] = useState('#C7A082')
  const [timeStartY, setTimeStartY] = useState(1120)
  const [timeColor, setTimeColor] = useState('#C7A082')
  const [lineStartY, setLineStartY] = useState(1010)
  const [lineColor, setLineColor] = useState('#C7A082')
  const [anonsColor, setAnonsColor] = useState('#000000')
  const [backgroundProps, setBackgroundProps] = useState()
  const [fontSize, setFontSize] = useState(112)
  const [dateFontSize, setDateFontSize] = useState(100)
  const [timeFontSize, setTimeFontSize] = useState(100)

  var textArray = useMemo(
    () => textArrayFunc(text, fontSize, 2000),
    [text, fontSize]
  )

  const aspect = 2028 / 1536

  return (
    <div className="h-full max-h-full px-1 py-1 overflow-y-auto">
      <div className="flex flex-wrap gap-x-1">
        <Button
          name="Заполнить из мероприятия"
          onClick={() =>
            modalsFunc.selectEvents(
              [],
              {},
              (data) => {
                const event = data
                  ? events.find(({ _id }) => _id === data[0])
                  : undefined

                const [
                  dayStart,
                  monthStart,
                  weekStart,
                  yearStart,
                  hourStart,
                  minuteStart,
                ] = dateToDateTimeStr(
                  event?.dateStart,
                  true,
                  true,
                  false,
                  true,
                  false
                )
                const [dayEnd, monthEnd, weekEnd, yearEnd, hourEnd, minuteEnd] =
                  dateToDateTimeStr(
                    event?.dateEnd,
                    true,
                    true,
                    false,
                    true,
                    false
                  )

                setText(String(event?.title))
                setDate1(
                  `${dayStart}${monthStart === monthEnd && dayStart !== dayEnd ? '' : ` ${monthStart}`}${
                    dayStart === dayEnd && monthStart === monthEnd
                      ? ` (${weekStart})`
                      : ` - ${dayEnd} ${monthEnd} (${weekStart} - ${weekEnd})`
                  }`
                )
                setDate2('')
                setTime(
                  dayStart === dayEnd && monthStart === monthEnd
                    ? `${hourStart}:${minuteStart} - ${hourEnd}:${minuteEnd}`
                    : `${getDaysBetween(event?.dateEnd, event?.dateStart, true, false, true, 1)}`
                )
              },
              null,
              null,
              1,
              false
            )
          }
        />
        <div className="flex flex-wrap w-full gap-x-1 gap-y-1.5">
          <Input
            label="Дата 1 строка"
            type="text"
            className="w-44"
            value={date1}
            onChange={setDate1}
          />
          <Input
            label="Дата 2 строка"
            type="text"
            className="w-44"
            value={date2}
            onChange={setDate2}
          />
          <Input
            label="Строка внизу"
            type="text"
            className="w-44"
            value={time}
            onChange={setTime}
          />
          <Input
            label="Текст"
            type="text"
            className="w-60"
            value={text}
            onChange={setText}
            fullWidth
            noMargin
          />
        </div>
        {/* ) : ( */}
        {/* <SelectEvent
          label="Мероприятие"
          selectedId={eventId}
          onChange={setEventId}
          className="w-full"
        /> */}
        {/* )} */}
      </div>
      <Templates
        aspect={aspect}
        tool="anonsvk"
        onSelect={({ template }) => {
          if (template) {
            setStartX(template.startX)
            setStartY(template.startY)
            setDateStartY(template.dateStartY)
            setDateColor(template.dateColor)
            setTimeStartY(template.timeStartY)
            setTimeColor(template.timeColor)
            setLineStartY(template.lineStartY)
            setLineColor(template.lineColor)
            setAnonsColor(template.anonsColor)
            setBackgroundProps(template.backgroundProps)
            setFontSize(template.fontSize)
            setDateFontSize(template.dateFontSize)
            setTimeFontSize(template.timeFontSize)
            rerender()
          }
        }}
        templateFunc={async () => {
          const base64String = await getPreview()
          const blob = base64String
            ? base64ToBlob(base64String.split(',')[1], 'image/png')
            : undefined

          const preview = await sendImage(
            blob,
            undefined,
            'templates/anonsvk/preview',
            null,
            imageFolder
          )
          return {
            startX,
            startY,
            dateStartY,
            dateColor,
            timeStartY,
            timeColor,
            lineStartY,
            lineColor,
            anonsColor,
            backgroundProps,
            fontSize,
            dateFontSize,
            timeFontSize,
            preview,
          }
        }}
        // template={{
        //   startX,
        //   startY,
        //   dateStartY,
        //   dateColor,
        //   timeStartY,
        //   timeColor,
        //   lineStartY,
        //   lineColor,
        //   anonsColor,
        //   backgroundProps,
        //   fontSize,
        //   dateFontSize,
        //   timeFontSize,
        // }}
      />
      <div className="flex flex-wrap items-end gap-x-1">
        <SvgBackgroundInput
          value={backgroundProps}
          onChange={setBackgroundProps}
          imageAspect={aspect}
          rerender={rerenderState}
          imagesFolder="templates/anonsvk"
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
          onClick={() => save('Анонс' + (text ? ' ' + text : ''))}
        />
        <div>Картинка 2028х1536</div>
      </div>
      {/* <div className="flex py-2 overflow-x-auto gap-x-1 max-h-[calc(100vh-160px)] overflow-y-auto">
        <div className="border-2 border-gray-600"> */}
      <div className="flex py-2 overflow-x-auto gap-x-1">
        <div className="border-2 border-gray-600 min-w-[278px] w-full max-w-[511px] aspect-[511/388]">
          <svg
            width="507"
            height="384"
            viewBox="0 0 2028 1536"
            id="input"
            className="w-full aspect-[507/384] h-full"
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
            <text
              x={startX}
              y={dateStartY - (date2 ? 50 : 0)}
              fontSize={dateFontSize}
              fill={dateColor}
              textAnchor="middle"
              fontFamily="Lora"
              className="font-bold uppercase"
              // className="font-bold uppercase font-lora"
            >
              {date1}
            </text>
            <text
              x={startX}
              y={timeStartY}
              fontSize={timeFontSize}
              fill={timeColor}
              textAnchor="middle"
              fontFamily="Lora"
              className="font-bold uppercase"
              // className="font-bold uppercase font-lora"
            >
              {time}
            </text>
            {date2 && (
              <text
                x={startX}
                y={dateStartY + 50}
                fontSize={dateFontSize}
                fill={dateColor}
                textAnchor="middle"
                fontFamily="Lora"
                className="font-bold uppercase"
                // className="font-bold uppercase font-lora"
              >
                {date2}
              </text>
            )}
            {textArray.map((textLine, lineNum) => {
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
                  fontFamily="Lora"
                  className="font-bold uppercase"
                  // className="font-bold uppercase font-lora"
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
          height="270"
          className="max-w-[270px] max-h-[270px] hidden"
        />
      </div>
    </div>
  )
}

export default ToolsEventAnonsVkContent
