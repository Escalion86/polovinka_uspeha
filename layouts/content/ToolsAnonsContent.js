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

const ToolsAnonsContent = () => {
  const hiddenFileInput = useRef(null)
  const addImageClick = () => {
    hiddenFileInput.current.click()
  }

  const modalsFunc = useRecoilValue(modalsFuncAtom)
  const events = useRecoilValue(eventsAtom)
  // const users = useRecoilValue(usersAtom)
  // const eventsUsers = useRecoilValue(eventsUsersAtom)
  // const directions = useRecoilValue(directionsAtom)
  // const reviews = useRecoilValue(reviewsAtom)
  // const additionalBlocks = useRecoilValue(additionalBlocksAtom)
  // const payments = useRecoilValue(paymentsAtom)

  const [month, setMonth] = useState(new Date().getMonth())
  const [year, setYear] = useState(new Date().getFullYear())
  const [styleNum, setStyleNum] = useState(1)
  const [memberEvent, setMemberEvent] = useState('dontShow')

  const [src, setSrc] = useState()
  const [startX, setStartX] = useState(90)
  const [startY, setStartY] = useState(72)
  const [titleGap, setTitleGap] = useState(62)
  const [maxHeight, setMaxHeight] = useState(1000)
  const [textColor, setTextColor] = useState('#ffffff')
  const [dateColor, setDateColor] = useState('#ffffff')
  const [dotColor, setDotColor] = useState('#ffffff')
  const [lineColor, setLineColor] = useState('#ffffff')
  const [anonsColor, setAnonsColor] = useState('#ffffff')
  const [backgroundColor, setBackgroundColor] = useState('#8888ee')
  const [fontSize, setFontSize] = useState(32)
  const [dateFontSize, setDateFontSize] = useState(36)
  const [maxItemsOnList, setMaxItemsOnList] = useState(10)

  const eventsInMonth = events.filter((event) => {
    if (event.status === 'canceled') return false
    const date = new Date(event.dateStart)
    const eventMonth = date.getMonth()
    const eventYear = date.getFullYear()
    return eventMonth === month && eventYear === year
  })

  const filteredEvents = eventsInMonth.filter(
    (event) =>
      memberEvent !== 'hide' || event.directionId !== closedEventsDirectionId
  )

  let prevDate
  const items = [...filteredEvents]
    .sort(sortFunctions.dateStart.asc)
    .map((event) => {
      const dateStart = dateToDateTimeStr(
        event.dateStart,
        true,
        true,
        false,
        true
      )
      const dateEnd = dateToDateTimeStr(event.dateEnd, true, true, false, true)
      var date = ''
      if (styleNum === 0)
        if (
          dateStart[0] === dateEnd[0] &&
          dateStart[1] === dateEnd[1] &&
          dateStart[3] === dateEnd[3]
        ) {
          date = `${dateStart[0]} ${dateStart[1]} ${dateStart[2]} ${dateStart[4]}:${dateStart[5]} - ${dateEnd[4]}:${dateEnd[5]}`
        } else {
          date = `${dateStart[0]} ${dateStart[1]} ${dateStart[2]} ${dateStart[4]}:${dateStart[5]} - ${dateEnd[0]} ${dateEnd[1]} ${dateEnd[2]} ${dateEnd[4]}:${dateEnd[5]}`
        }
      if (styleNum === 1)
        if (
          dateStart[0] === dateEnd[0] &&
          dateStart[1] === dateEnd[1] &&
          dateStart[3] === dateEnd[3]
        ) {
          date = `${dateStart[4]}:${dateStart[5]} - ${dateEnd[4]}:${dateEnd[5]}`
        } else {
          date = `${dateStart[4]}:${dateStart[5]} - ${dateEnd[0]} ${dateEnd[1]} ${dateEnd[2]} ${dateEnd[4]}:${dateEnd[5]}`
        }
      const showDot = styleNum === 0 || prevDate !== dateStart[0] + dateStart[1]
      prevDate = dateStart[0] + dateStart[1]

      const text =
        memberEvent === 'dontShow' &&
        event.directionId === closedEventsDirectionId
          ? 'Мероприятие закрытого клуба'
          : event.title

      return {
        date,
        text,
        dot: showDot,
        day:
          styleNum === 0
            ? undefined
            : dateStart[0] <= 9
            ? '0' + dateStart[0]
            : dateStart[0],
        week: styleNum === 0 ? undefined : dateStart[2],
      }
    })

  const {
    startXadd,
    startYadd,
    dotGapY,
    minGap,
    maxGap,
    textLengthMax,
    // dateHeight,
    dateTextGap,
    // lineHeight,
    // maxHeight,
  } = styles[styleNum]

  const preparedItems = items.map(({ date, text, dot, day, week }, index) => {
    const textSplit = text.split(' ')

    var chars = 0
    var line = 0
    var textArray = []

    textSplit.forEach((word) => {
      const wordLength = word.length
      if (chars + wordLength > textLengthMax / fontSize) {
        ++line
        chars = 0
      }
      chars += wordLength
      textArray[line] = textArray[line] ? textArray[line] + ' ' + word : word
    })

    return { date, textArray, dot, day, week }
  })

  const listsCount = Math.ceil(preparedItems.length / maxItemsOnList)
  var itemsLeft = preparedItems.length
  const elementsOnList = Array(listsCount)
    .fill(0)
    .map((value, index) => {
      const listsLeft = listsCount - index
      const itemsInListCount = Math.ceil(itemsLeft / listsLeft)
      itemsLeft = itemsLeft - itemsInListCount
      return itemsInListCount
    })

  var elementStart = 0
  const listsWithPreparedItems = elementsOnList.map((elementsCount) => {
    const tempArray = []
    for (let i = elementStart; i < elementStart + elementsCount; i++) {
      tempArray.push(preparedItems[i])
    }
    elementStart = elementStart + elementsCount
    return tempArray
  })

  // preparedItems.push(preparedItems[0])
  // preparedItems.push(preparedItems[0])
  // preparedItems.push(preparedItems[0])
  // preparedItems.push(preparedItems[0])

  // const itemsCount = preparedItems.length
  // useEffect(() => {
  //   const preview = document.querySelector('#preview1')
  //   var reader = new FileReader()
  var addedLines
  //   reader.onloadend = function () {
  //     preview.src = reader.result
  //   }

  //   if (inputFile) {
  //     reader.readAsDataURL(inputFile)
  //   } else {
  //     if (preview) preview.src = ''
  //   }
  // }, [inputFile])

  return (
    <div className="h-full max-h-full px-1 overflow-y-auto">
      <div className="flex flex-wrap gap-x-1">
        <MonthSelector month={month} onChange={setMonth} />
        <YearSelector year={year} onChange={setYear} />
        <ComboBox
          label="Стиль"
          className="max-w-24"
          items={[
            { value: 0, name: '1' },
            { value: 1, name: '2' },
          ]}
          defaultValue={styleNum}
          onChange={(value) => setStyleNum(Number(value))}
        />
        <ComboBox
          label="Мероприятия клуба"
          className="max-w-60"
          items={[
            { value: 'show', name: 'Показывать название' },
            { value: 'dontShow', name: 'Не показывать название' },
            { value: 'hide', name: 'Скрыть' },
          ]}
          defaultValue={memberEvent}
          onChange={setMemberEvent}
        />
        {/* <CheckBox
          checked={memberEvent}
          labelPos="left"
          onClick={() => setMemberEvent((checked) => !checked)}
          label="Не показывать названия мероприятий клуба"
        /> */}
      </div>
      <div className="flex flex-wrap gap-x-1">
        <Input
          label="Макс. мероприятий на странице"
          type="number"
          className="w-[146px]"
          inputClassName="w-16"
          value={maxItemsOnList}
          onChange={(value) => setMaxItemsOnList(parseInt(value))}
          min={1}
          max={10}
          fullWidth={false}
          // noMargin
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
        <ColorPicker
          label="Цвет фона"
          value={backgroundColor}
          onChange={setBackgroundColor}
        />
      </div>
      <div className="flex items-center mb-1 gap-x-1">
        <div>Фон:</div>
        <Button
          name={src ? 'Изменить фон' : 'Загрузить фон'}
          thin
          onClick={addImageClick}
        />
        <input
          ref={hiddenFileInput}
          className="hidden"
          type="file"
          // value={src?.name || ''}
          onChange={(e) => {
            // setImage(e.target.files[0], setSrc)
            // var reader = new FileReader()
            // reader.addEventListener('load', () => {
            // setSrc(reader.result.toString() || '')
            modalsFunc.cropImage(
              // reader.result.toString() || '',
              e.target.files[0],
              null,
              1080 / 1920,
              // null,
              (newImage) => {
                console.log('newImage :>> ', newImage)
                setSrc(newImage)
              },
              false
            )
            // })
            // reader.readAsDataURL(e.target.files[0])
          }}
        />
        {src && (
          <FontAwesomeIcon
            className="w-6 h-6 duration-200 transform cursor-pointer text-danger hover:scale-110"
            icon={faTimes}
            // size="1x"
            onClick={() => setSrc('')}
          />
        )}
      </div>
      {/* <div style={{ height: 1920, width: 1080 }}>
        <img src={src} height={1920} width={1080} />
      </div> */}
      <Button
        name="Сохранить"
        onClick={() =>
          save2(listsWithPreparedItems.length, 'Анонс ' + MONTHS_FULL_1[month])
        }
      />
      {/* <image id="preview1" height="1920" width="1080" /> */}
      <div className="flex overflow-x-auto gap-x-1 max-h-[calc(100vh-160px)] overflow-y-auto">
        {listsWithPreparedItems.map((preparedItems, index) => {
          addedLines = 0
          const fullHeight = preparedItems.reduce(
            (total, { date, textArray }) =>
              total + dateTextGap + fontSize * textArray.length,
            0
          )

          const gap = Math.min(
            Math.max(
              minGap,
              (maxHeight - fullHeight) / (preparedItems.length - 1)
            ),
            maxGap
          )

          return (
            <svg
              key={month + year + index}
              width="270"
              height="480"
              viewBox="0 0 1080 1920"
              id={'input' + index}
              className="border min-w-[270px]"
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
              <rect
                fill={backgroundColor}
                x="0"
                y="0"
                width="100%"
                height="100%"
              />
              <image
                id={'preview' + index}
                // src={src}
                href={src}
                height="1920"
                width="1080"
              />

              {/* <rect
          x="10"
          y="10"
          width="30"
          height="30"
          stroke="black"
          fill="transparent"
          stroke-width="5"
        /> */}
              {preparedItems.map(
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
              />
            </svg>
          )
        })}
        <img
          id="output"
          alt=""
          width="270"
          height="480"
          className="max-w-[270px] max-h-[480px] hidden"
        />
      </div>
    </div>
  )
}

export default ToolsAnonsContent
