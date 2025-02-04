'use client'

import Button from '@components/Button'
import ColorPicker from '@components/ColorPicker'
// import ComboBox from '@components/ComboBox'
import Input from '@components/Input'
import InputSvgFrame from '@components/InputSvgFrame'
import InputWrapper from '@components/InputWrapper'
// import { SelectEvent } from '@components/SelectItem'
import {
  SvgBackgroundComponent,
  SvgBackgroundInput,
} from '@components/SvgBackground'
import Templates from '@components/Templates'
import frames from '@components/frames/frames'
import base64ToBlob from '@helpers/base64ToBlob'
import { sendImage } from '@helpers/cloudinary'
import dateToDateTimeStr from '@helpers/dateToDateTimeStr'
import textArrayFunc from '@helpers/textArrayFunc'
import modalsFuncAtom from '@state/modalsFuncAtom'
import eventsAtom from '@state/atoms/eventsAtom'
import locationPropsSelector from '@state/selectors/locationPropsSelector'
import { useMemo, useState } from 'react'
import { useAtomValue } from 'jotai'
import { saveSvgAsPng, svgAsPngUri } from 'save-svg-as-png'
import InputNumber from '@components/InputNumber'
import ReactImageGallery from 'react-image-gallery'

const getPreview = async () => {
  const input = document.querySelector('#input')
  const response = await svgAsPngUri(input, {
    scale: 240 / 1080,
    canvg: true,
  })
  return response
}

const save = async (name) => {
  const input = document.querySelector('#input')
  saveSvgAsPng(input, name)
}

const ToolsEventAnonsInstagramContent = () => {
  const modalsFunc = useAtomValue(modalsFuncAtom)
  const events = useAtomValue(eventsAtom)
  const { imageFolder } = useAtomValue(locationPropsSelector)

  const [rerenderState, setRerenderState] = useState(false)
  const rerender = () => setRerenderState((state) => !state)

  const [date1, setDate1] = useState('')
  const [date2, setDate2] = useState('')
  const [text, setText] = useState('')

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

  var textArray = useMemo(
    () => textArrayFunc(text, fontSize, 1900),
    [text, fontSize]
  )

  const aspect = 1

  const Image = () => (
    <div className="flex items-center justify-center w-full h-full max-h-screen max-w-screen">
      <div className="flex items-center justify-center h-full max-w-full max-h-full aspect-1">
        <svg
          // key={month + year + index}
          // width="480"
          // height="480"
          viewBox="0 0 1080 1080"
          id="input"
          // className="w-full aspect-1"
          style={{ aspectRatio: '1/1', width: '100%' }}
        >
          <SvgBackgroundComponent {...backgroundProps} />
          <Frame fill={frameColor} />
          <text
            // key={textLine + lineNum}
            x={startX}
            y={dateStartY}
            fontSize={dateFontSize}
            fill={dateColor}
            // fontWeight="bold"
            textAnchor="middle"
            fontFamily="AdleryProSwash"
            // className="font-adleryProSwash"
          >
            {date1}
          </text>
          {date2 && (
            <text
              // key={textLine + lineNum}
              x={startX}
              y={dateStartY + dateFontSize}
              fontSize={dateFontSize}
              fill={dateColor}
              // fontWeight="bold"
              textAnchor="middle"
              fontFamily="AdleryProSwash"
              // className="font-adleryProSwash"
            >
              {date2}
            </text>
          )}
          {textArray.map((textLine, lineNum) => {
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
                // className="font-adlery"
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
      </div>
    </div>
  )

  return (
    <div className="h-full max-h-full px-1 py-1 overflow-y-auto">
      {/* <ComboBox
        label="Режим"
        className="max-w-[180px]"
        items={[
          { value: 'true', name: 'Ручной ввод' },
          { value: 'false', name: 'Выбор мероприятия' },
        ]}
        value={customMode ? 'true' : 'false'}
        onChange={(value) => setCustomMode(value === 'true')}
      /> */}
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

              setText(String(event?.title))
              setDate1(
                `${dayStart} ${monthStart}${
                  dayStart === dayEnd && monthStart === monthEnd ? '' : ' -'
                }`
              )
              setDate2(
                dayStart === dayEnd && monthStart === monthEnd
                  ? `(${weekStart})`
                  : `${dayEnd} ${monthEnd}`
              )
              // setTime(
              //   dayStart === dayEnd && monthStart === monthEnd
              //     ? `${hourStart}:${minuteStart} - ${hourEnd}:${minuteEnd}`
              //     : `${getDaysBetween(event?.dateEnd, event?.dateStart, true, false, true, 1)}`
              // )
            },
            null,
            null,
            1,
            false
          )
        }
      />
      <div className="flex flex-wrap gap-x-1">
        <div className="flex flex-wrap w-full gap-x-1 gap-y-1.5">
          <Input
            label="Дата 1 строка"
            type="text"
            className="w-44"
            // inputClassName="w-16"
            value={date1}
            onChange={setDate1}
            // noMargin
          />
          <Input
            label="Дата 2 строка"
            type="text"
            className="w-44"
            // inputClassName="w-16"
            value={date2}
            onChange={setDate2}
            // noMargin
          />
          <Input
            label="Текст"
            type="text"
            className="w-60"
            // inputClassName="w-16"
            value={text}
            onChange={setText}
            fullWidth
            noMargin
          />
        </div>
        <Templates
          aspect={aspect}
          tool="anonsinstagram"
          onSelect={({ template }) => {
            if (template) {
              setFrameId(template.frameId)
              setFrameColor(template.frameColor)
              setStartX(template.startX)
              setStartY(template.startY)
              setDateStartY(template.dateStartY)
              setDateColor(template.dateColor)
              setAnonsColor(template.anonsColor)
              setBackgroundProps(template.backgroundProps)
              setFontSize(template.fontSize)
              setDateFontSize(template.dateFontSize)
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
              'templates/anonsinstagram/preview',
              null,
              imageFolder
            )
            return {
              frameId,
              frameColor,
              startX,
              startY,
              dateStartY,
              dateColor,
              anonsColor,
              backgroundProps,
              fontSize,
              dateFontSize,
              preview,
            }
          }}
          // template={{
          //   frameId,
          //   frameColor,
          //   startX,
          //   startY,
          //   dateStartY,
          //   dateColor,
          //   anonsColor,
          //   backgroundProps,
          //   fontSize,
          //   dateFontSize,
          // }}
        />
      </div>
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
      <div className="flex flex-wrap items-end gap-x-1">
        <SvgBackgroundInput
          value={backgroundProps}
          onChange={setBackgroundProps}
          imageAspect={aspect}
          rerender={rerenderState}
          imagesFolder="templates/anonsinstagram"
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
            <InputNumber
              label="Размер шрифта"
              // type="number"
              className="w-[128px]"
              inputClassName="w-[64px]"
              value={dateFontSize}
              onChange={(value) => setDateFontSize(value)}
              min={20}
              max={200}
              // noMargin
            />
            <InputNumber
              label="Позиция по Y"
              // type="number"
              className="w-[128px]"
              inputClassName="w-[64px]"
              value={dateStartY}
              onChange={(value) => setDateStartY(value)}
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
            <InputNumber
              label="Размер шрифта"
              // type="number"
              className="w-[128px]"
              inputClassName="w-[64px]"
              value={fontSize}
              onChange={setFontSize}
              min={20}
              max={200}
              // noMargin
            />
            <InputNumber
              label="Позиция по Y"
              // type="number"
              className="w-[128px]"
              inputClassName="w-[64px]"
              value={startY}
              onChange={setStartY}
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
          onClick={() => save('Анонс' + (text ? ' ' + text : ''))}
        />
        <div>Картинка 1080х1080</div>
      </div>
      {/* <image id="preview1" height="1920" width="1080" /> */}
      {/* <div className="flex py-2 overflow-x-auto gap-x-1">
        <div className="border-2 border-gray-600 min-w-[274px] w-full max-w-[484px] aspect-1"> */}
      <div className="max-w-[300px] my-2 border-2 border-gray-600 aspect-1">
        {/* tablet:max-w-[calc(100%-48px)] max-h-[calc(100vh-160px)]  */}
        <ReactImageGallery
          items={[Image]}
          renderItem={(Image) => <Image />}
          showPlayButton={false}
          showFullscreenButton={true}
          // useBrowserFullscreen={false}
          // showNav
          // showBullets={images?.length > 1}
          // additionalClass="h-full w-full"
        />

        {/* </div> */}
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

export default ToolsEventAnonsInstagramContent
