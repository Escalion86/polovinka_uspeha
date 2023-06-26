import { modalsFuncAtom } from '@state/atoms'
import { useRecoilValue } from 'recoil'
import usersAtom from '@state/atoms/usersAtom'
import eventsUsersAtom from '@state/atoms/eventsUsersAtom'
import eventsAtom from '@state/atoms/eventsAtom'
import directionsAtom from '@state/atoms/directionsAtom'
import reviewsAtom from '@state/atoms/reviewsAtom'
import additionalBlocksAtom from '@state/atoms/additionalBlocksAtom'
import paymentsAtom from '@state/atoms/paymentsAtom'

import { CardWrapper } from '@components/CardWrapper'
import CardListWrapper from '@layouts/wrappers/CardListWrapper'
import InputImages from '@components/InputImages'
import { useEffect, useRef, useState } from 'react'
import Input from '@components/Input'
import FormWrapper from '@components/FormWrapper'
import formatDateTime from '@helpers/formatDateTime'
import dateToDateTimeStr from '@helpers/dateToDateTimeStr'
import ComboBox from '@components/ComboBox'
import { MONTHS, MONTHS_FULL, MONTHS_FULL_1 } from '@helpers/constants'
import sortFunctions from '@helpers/sortFunctions'
import CheckBox from '@components/CheckBox'
import YearSelector from '@components/ComboBox/YearSelector'
import MonthSelector from '@components/ComboBox/MonthSelector'
import ColorPicker from '@components/ColorPicker'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import Button from '@components/Button'

import { saveSvgAsPng } from 'save-svg-as-png'
import { SelectEvent } from '@components/SelectItem'
import InputWrapper from '@components/InputWrapper'
import {
  SvgBackgroundComponent,
  SvgBackgroundInput,
} from '@components/SvgBackground'
// import futuraPtFontBase64 from '@helpers/fontsBase64/futuraPt'
// import enchantsFontBase64 from '@helpers/fontsBase64/enchants'

// function loadImage(url) {
//   return new Promise((r) => {
//     let i = new Image()
//     i.onload = () => r(i)
//     i.src = url
//   })
// }

const styles = [
  {
    startXadd: 0,
    startYadd: 0,
    dotGapY: 0,
    minGap: 35,
    maxGap: 120,
    textLengthMax: 49 * 32,
    // dateHeight: 36,
    dateTextGap: 10,
    // lineHeight: 32,
    // maxHeight: 1000,
  },
  {
    startXadd: 15,
    startYadd: 0,
    dotGapY: 20,
    minGap: 35,
    maxGap: 120,
    textLengthMax: 48 * 32,
    // dateHeight: 36,
    dateTextGap: 10,
    // lineHeight: 32,
    // maxHeight: 1000,
  },
]

const closedEventsDirectionId = '6301d334e5b7fa785515faac' //6301d334e5b7fa785515faac

// function readURL(input) {
//   if (input.files && input.files[0]) {
//     var reader = new FileReader()

//     reader.onload = function (e) {
//       $('#blah').attr('src', e.target.result)
//     }

//     reader.readAsDataURL(input.files[0])
//   }
// }

// const setImage = (image, setSrc) => {
//   // const preview = document.querySelector('#preview')
//   // if (!preview) return
//   var reader = new FileReader()
//   // console.log('preview :>> ', preview)

//   // reader.onloadend = function (e) {
//   //   preview.src = e.target.result
//   // }

//   reader.addEventListener(
//     'load',
//     () => {
//       setSrc(reader.result.toString() || '')
//       modalsFunc.cropImage(
//         reader.result.toString() || '',
//         null,
//         aspect,
//         (newImage) => {
//           console.log('newImage :>> ', newImage)
//           setSrc(newImage)
//         }
//       )
//     }
//     // setImgSrc(reader.result.toString() || '')
//     // (preview.src = reader.result.toString() || '')
//   )
//   reader.readAsDataURL(image)

//   // if (image) {
//   //   reader.readAsDataURL(image)
//   // } else {
//   //   if (preview) preview.src = ''
//   // }
// }

const save2 = async (listsCount, name) => {
  for (let i = 0; i < listsCount; i++) {
    const input = document.querySelector('#input' + i)
    const fileName = `${name}${
      listsCount > 1 ? ` (лист ${i + 1} из ${listsCount})` : ''
    }.png`
    saveSvgAsPng(input, fileName)
  }
}

// const save = async (listsCount, name) => {
//   for (let i = 0; i < listsCount; i++) {
//     const input = document.querySelector('#input' + i)
//     const output = document.querySelector('#output')

//     const svgData = new XMLSerializer().serializeToString(input)
//     const svgDataBase64 = btoa(unescape(encodeURIComponent(svgData)))

//     const svgDataUrl = `data:image/svg+xml;charset=utf-8;base64,${svgDataBase64}`

//     const image = new Image()
//     // const imgBg = await loadImage(bgImage)

//     image.addEventListener('load', () => {
//       const canvas = document.createElement('canvas')

//       canvas.setAttribute('width', 1080)
//       canvas.setAttribute('height', 1920)

//       const context = canvas.getContext('2d')

//       // context.drawImage(imgBg, 0, 0, 1080, 1920)

//       context.drawImage(image, 0, 0, 1080, 1920)

//       const dataUrl = canvas.toDataURL('image/png')
//       output.src = dataUrl

//       var link = document.createElement('a')
//       link.setAttribute(
//         'download',
//         `${name}${
//           listsCount > 1 ? ` (лист ${i + 1} из ${listsCount})` : ''
//         }.png`
//       )
//       link.setAttribute(
//         'href',
//         canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream')
//       )
//       link.click()

//       // var image2 = canvas
//       //   .toDataURL('image/png')
//       //   .replace('image/png', 'image/octet-stream')
//       // window.location.href = image2
//     })
//     image.src = svgDataUrl
//   }
// }

const ToolsEventAnonsContent = () => {
  // const hiddenFileInput = useRef(null)
  // const addImageClick = () => {
  //   hiddenFileInput.current.click()
  // }

  // const modalsFunc = useRecoilValue(modalsFuncAtom)
  // const events = useRecoilValue(eventsAtom)
  // const users = useRecoilValue(usersAtom)
  // const eventsUsers = useRecoilValue(eventsUsersAtom)
  // const directions = useRecoilValue(directionsAtom)
  // const reviews = useRecoilValue(reviewsAtom)
  // const additionalBlocks = useRecoilValue(additionalBlocksAtom)
  // const payments = useRecoilValue(paymentsAtom)

  const [eventId, setEventId] = useState(null)

  const [startX, setStartX] = useState(90)
  const [startY, setStartY] = useState(72)
  const [titleGap, setTitleGap] = useState(62)
  const [maxHeight, setMaxHeight] = useState(1000)
  const [textColor, setTextColor] = useState('#ffffff')
  const [dateColor, setDateColor] = useState('#ffffff')
  const [dotColor, setDotColor] = useState('#ffffff')
  const [lineColor, setLineColor] = useState('#ffffff')
  const [anonsColor, setAnonsColor] = useState('#ffffff')
  const [backgroundProps, setBackgroundProps] = useState()

  const [fontSize, setFontSize] = useState(32)
  const [dateFontSize, setDateFontSize] = useState(36)

  return (
    <div className="h-full max-h-full px-1 overflow-y-auto">
      <div className="flex flex-wrap gap-x-1">
        <SelectEvent
          label="Мероприятие"
          selectedId={eventId}
          onChange={setEventId}
          // required
          // showEventUsersButton
          // showPaymentsButton
          // showEditButton
          // clearButton={!isEventClosed && !fixedEventId}
          // readOnly={isEventClosed}
          // readOnly={fixedEventId}
        />
      </div>
      <div className="flex flex-wrap gap-x-1">
        <SvgBackgroundInput
          // value={backgroundProps}
          onChange={setBackgroundProps}
          imageAspect={1}
        />
        <Input
          label="Размер шрифта мероприятий"
          type="number"
          className="w-32"
          inputClassName="w-16"
          value={fontSize}
          onChange={(value) => setFontSize(parseInt(value))}
          min={10}
          max={100}
          fullWidth={false}
          // noMargin
        />
        <Input
          label="Размер шрифта даты"
          type="number"
          className="w-32"
          inputClassName="w-16"
          value={dateFontSize}
          onChange={(value) => setDateFontSize(parseInt(value))}
          min={10}
          max={100}
          fullWidth={false}
          // noMargin
        />
        <Input
          label="Позиция по X"
          type="number"
          className="w-28"
          inputClassName="w-16"
          value={startX}
          onChange={(value) => setStartX(parseInt(value))}
          min={0}
          max={120}
          fullWidth={false}
          // noMargin
        />
        <Input
          label="Позиция по Y"
          type="number"
          className="w-28"
          inputClassName="w-16"
          value={startY}
          onChange={(value) => setStartY(parseInt(value))}
          min={0}
          max={1400}
          fullWidth={false}
        />
        <Input
          label="Макс высота списка"
          type="number"
          className="w-28"
          inputClassName="w-16"
          value={maxHeight}
          onChange={(value) => setMaxHeight(parseInt(value))}
          min={0}
          max={1920}
          fullWidth={false}
        />
        <Input
          label="Отступ списка от заголовка"
          type="number"
          className="w-28"
          inputClassName="w-16"
          value={titleGap}
          onChange={(value) => setTitleGap(parseInt(value))}
          min={0}
          max={1920}
          fullWidth={false}
        />
        <ColorPicker
          label="Цвет заголовка"
          value={anonsColor}
          onChange={setAnonsColor}
        />
        <ColorPicker
          label="Цвет даты"
          value={dateColor}
          onChange={setDateColor}
        />
        <ColorPicker
          label="Цвет текста"
          value={textColor}
          onChange={setTextColor}
        />
        <ColorPicker
          label="Цвет линии"
          value={lineColor}
          onChange={setLineColor}
        />
        <ColorPicker
          label="Цвет точек"
          value={dotColor}
          onChange={setDotColor}
        />
      </div>
      {/* <div style={{ height: 1920, width: 1080 }}>
        <img src={src} height={1920} width={1080} />
      </div> */}
      <Button
        name="Сохранить"
        onClick={() => save2(listsWithPreparedItems.length, 'Анонс')}
      />
      {/* <image id="preview1" height="1920" width="1080" /> */}
      <div className="flex py-2 overflow-x-auto gap-x-1 max-h-[calc(100vh-160px)] overflow-y-auto">
        <svg
          // key={month + year + index}
          width="480"
          height="480"
          viewBox="0 0 1080 1080"
          // id={'input' + index}
          className="min-w-[270px]"
        >
          {/* <defs> */}
          {/* @font-face {
                font-family: Enchants;
                src: url(${enchantsFontBase64})
            } */}
          {/* <style> */}
          {/* {`@font-face {
              font-family: Futura PT;
              src: url("${futuraPtFontBase64}")
          }`} */}
          {/* </style> */}
          {/* </defs> */}
          {/* <rect fill={backgroundColor} x="0" y="0" width="100%" height="100%" /> */}
          <SvgBackgroundComponent {...backgroundProps} />

          {/* <rect
          x="10"
          y="10"
          width="30"
          height="30"
          stroke="black"
          fill="transparent"
          stroke-width="5"
        /> */}
          {/* {preparedItems.map(
                ({ date, textArray, dot, day, week }, index) => {
                  // const textSplit = text.split(' ')

                  // var chars = 0
                  // var line = 0
                  // var textArray = []
                  // textSplit.forEach((word) => {
                  //   const wordLength = word.length
                  //   if (chars + wordLength > textLengthMax) {
                  //     ++line
                  //     chars = 0
                  //   }
                  //   chars += wordLength
                  //   textArray[line] = textArray[line]
                  //     ? textArray[line] + ' ' + word
                  //     : word
                  // })

                  const showDot = dot || index === 0

                  return (
                    <g key={month + year + date + index}>
                      <text
                        x={startX + 50}
                        y={startY + 250}
                        fontSize={250}
                        fill={anonsColor}
                        // fontWeight="bold"
                        // textAnchor="middle"
                        fontFamily="Enchants"
                      >
                        Анонс
                      </text>
                      <text
                        x={startX + 730}
                        y={startY + 90}
                        fontSize={110}
                        fill={anonsColor}
                        fontWeight="300"
                        textAnchor="middle"
                        fontFamily="Futura PT"
                      >
                        {MONTHS_FULL_1[month].toLocaleUpperCase()}
                      </text>
                      <line
                        x1={0}
                        y1={startY + 54}
                        x2={startX + 445}
                        y2={startY + 54}
                        strokeWidth="5"
                        stroke={anonsColor}
                      />
                      {showDot && (
                        <circle
                          cx={startX + 90 + startXadd}
                          cy={
                            startY +
                            340 +
                            titleGap +
                            startYadd +
                            dotGapY +
                            index * gap +
                            index * dateTextGap +
                            index * dateFontSize +
                            addedLines * fontSize
                          }
                          r="20"
                          fill={dotColor}
                          // stroke-width="5"
                          // stroke="rgb(150,110,200)"
                        />
                      )}
                      {showDot && day && week && (
                        <>
                          <text
                            x={startX + 90 + startXadd - 72}
                            y={
                              startY +
                              340 +
                              titleGap +
                              startYadd +
                              index * gap +
                              index * dateTextGap +
                              index * dateFontSize +
                              15 +
                              // 10 +
                              addedLines * fontSize
                            }
                            fontSize={60}
                            fill={dateColor}
                            fontWeight="bold"
                            textAnchor="middle"
                          >
                            {day}
                          </text>
                          <text
                            x={startX + 90 + startXadd - 72}
                            y={
                              startY +
                              340 +
                              titleGap +
                              startYadd +
                              index * gap +
                              index * dateTextGap +
                              index * dateFontSize +
                              60 +
                              addedLines * fontSize
                            }
                            fontSize={48}
                            fill={dateColor}
                            // fontWeight="bold"
                            textAnchor="middle"
                          >
                            {week}
                          </text>
                        </>
                      )}
                      <text
                        x={startX + 90 + startXadd + 50}
                        y={
                          startY +
                          372 +
                          titleGap +
                          startYadd +
                          index * gap +
                          index * dateTextGap +
                          index * dateFontSize +
                          10 +
                          addedLines * fontSize -
                          30
                        }
                        fontSize={dateFontSize}
                        fill={dateColor}
                        fontWeight="bold"
                      >
                        {date}
                      </text>
                      {textArray.map((textLine, lineNum) => {
                        ++addedLines
                        return (
                          <text
                            key={textLine + lineNum}
                            x={startX + 90 + startXadd + 50}
                            y={
                              startY +
                              338 +
                              titleGap +
                              startYadd +
                              10 +
                              index * gap +
                              (index + 1) * dateTextGap +
                              index * dateFontSize +
                              // 20 +
                              addedLines * fontSize
                              // lineNum * lineHeight
                            }
                            fontSize={fontSize}
                            fill={textColor}
                            width={800}
                            className="max-w-[800px]"
                          >
                            {textLine}
                          </text>
                        )
                      })}
                    </g>
                  )
                }
              )}
              <line
                x1={startX + 90 + startXadd}
                y1={startY + 340 + startYadd - 50 + titleGap}
                x2={startX + 90 + startXadd}
                y2={
                  startY +
                  340 +
                  titleGap +
                  startYadd +
                  preparedItems.length * (dateTextGap + dateFontSize) +
                  (preparedItems.length - 1) * gap +
                  addedLines * fontSize
                }
                strokeWidth="3"
                stroke={lineColor}
              /> */}
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

export default ToolsEventAnonsContent
