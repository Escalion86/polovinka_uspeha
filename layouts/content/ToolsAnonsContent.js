import Button from '@components/Button'
import ColorPicker from '@components/ColorPicker'
import ComboBox from '@components/ComboBox'
import MonthSelector from '@components/ComboBox/MonthSelector'
import YearSelector from '@components/ComboBox/YearSelector'
import Input from '@components/Input'
import {
  SvgBackgroundComponent,
  SvgBackgroundInput,
} from '@components/SvgBackground'
import { MONTHS_FULL_1 } from '@helpers/constants'
import dateToDateTimeStr from '@helpers/dateToDateTimeStr'
import getEventsYears from '@helpers/getEventsYears'
import getNoun from '@helpers/getNoun'
import sortFunctions from '@helpers/sortFunctions'
import eventsAtom from '@state/atoms/eventsAtom'
import serverSettingsAtom from '@state/atoms/serverSettingsAtom'
import { useMemo, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { saveSvgAsPng } from 'save-svg-as-png'

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

const save2 = async (listsCount, name) => {
  for (let i = 0; i < listsCount; i++) {
    const input = document.querySelector('#input' + i)
    const fileName = `${name}${
      listsCount > 1 ? ` (лист ${i + 1} из ${listsCount})` : ''
    }.png`
    saveSvgAsPng(input, fileName)
  }
}

const ToolsAnonsContent = () => {
  const serverDate = new Date(useRecoilValue(serverSettingsAtom)?.dateTime)
  const events = useRecoilValue(eventsAtom)

  const [month, setMonth] = useState(serverDate.getMonth())
  const [year, setYear] = useState(serverDate.getFullYear())
  const [styleNum, setStyleNum] = useState(1)
  const [memberEvent, setMemberEvent] = useState('dontShow')

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
  const [maxItemsOnList, setMaxItemsOnList] = useState(10)

  const years = useMemo(() => getEventsYears(events), [events])

  const eventsInMonth = events.filter((event) => {
    if (event.status === 'canceled' || !event.showOnSite) return false
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
        <YearSelector year={year} onChange={setYear} years={years} />
        <ComboBox
          label="Стиль"
          className="min-w-16 max-w-24"
          items={[
            { value: 0, name: '1' },
            { value: 1, name: '2' },
          ]}
          value={styleNum}
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
          value={memberEvent}
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
          inputClassName="w-[64px]"
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
          className="w-[128px]"
          inputClassName="w-[64px]"
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
          className="w-[128px]"
          inputClassName="w-[64px]"
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
          className="w-[128px]"
          inputClassName="w-[64px]"
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
          className="w-[128px]"
          inputClassName="w-[64px]"
          value={startY}
          onChange={(value) => setStartY(parseInt(value))}
          min={0}
          max={1400}
          fullWidth={false}
        />
        <Input
          label="Макс высота списка"
          type="number"
          className="w-[128px]"
          inputClassName="w-[64px]"
          value={maxHeight}
          onChange={(value) => setMaxHeight(parseInt(value))}
          min={0}
          max={1920}
          fullWidth={false}
        />
        <Input
          label="Отступ списка от заголовка"
          type="number"
          className="w-[128px]"
          inputClassName="w-[64px]"
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

      <SvgBackgroundInput
        // value={backgroundProps}
        onChange={setBackgroundProps}
        imageAspect={1080 / 1920}
      />
      {/* <div style={{ height: 1920, width: 1080 }}>
        <img src={src} height={1920} width={1080} />
      </div> */}
      <div className="flex items-center gap-x-2">
        <Button
          name="Сохранить"
          onClick={() =>
            save2(
              listsWithPreparedItems.length,
              'Анонс ' + MONTHS_FULL_1[month]
            )
          }
        />
        <div>
          {getNoun(
            listsWithPreparedItems?.length,
            'картинка',
            'картинки',
            'картинок'
          ) + ' 1080х1920'}
        </div>
      </div>
      {/* <image id="preview1" height="1920" width="1080" /> */}
      <div className="flex overflow-x-auto py-2 gap-x-1 max-h-[calc(100vh-160px)] overflow-y-auto">
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
            <div
              key={month + year + index}
              className="border-2 border-gray-600"
            >
              <svg
                // key={month + year + index}
                width="270"
                height="480"
                viewBox="0 0 1080 1920"
                id={'input' + index}
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
            </div>
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
