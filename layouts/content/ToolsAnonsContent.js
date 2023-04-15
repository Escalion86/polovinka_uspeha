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
import { useState } from 'react'
import Input from '@components/Input'
import FormWrapper from '@components/FormWrapper'
import Button from '@components/Button'
import formatDateTime from '@helpers/formatDateTime'
import dateToDateTimeStr from '@helpers/dateToDateTimeStr'
import ComboBox from '@components/ComboBox'
import { MONTHS, MONTHS_FULL, MONTHS_FULL_1 } from '@helpers/constants'
import sortFunctions from '@helpers/sortFunctions'
import CheckBox from '@components/CheckBox'

function loadImage(url) {
  return new Promise((r) => {
    let i = new Image()
    i.onload = () => r(i)
    i.src = url
  })
}

const save = async (listsCount, bgImage, name) => {
  for (let i = 0; i < listsCount; i++) {
    const input = document.querySelector('#input' + i)
    const output = document.querySelector('#output')

    const svgData = new XMLSerializer().serializeToString(input)
    const svgDataBase64 = btoa(unescape(encodeURIComponent(svgData)))

    const svgDataUrl = `data:image/svg+xml;charset=utf-8;base64,${svgDataBase64}`

    const image = new Image()
    const imgBg = await loadImage(bgImage)

    image.addEventListener('load', () => {
      // const width = input.getAttribute('width')
      // const height = input.getAttribute('height')
      const canvas = document.createElement('canvas')

      // canvas.setAttribute('width', width)
      // canvas.setAttribute('height', height)
      canvas.setAttribute('width', 1080)
      canvas.setAttribute('height', 1920)

      const context = canvas.getContext('2d')

      context.drawImage(imgBg, 0, 0, 1080, 1920)

      // var img1 = new Image()

      // img1.onload = function () {
      //   context.drawImage(img1, 0, 0, 1080, 1920)
      // }

      // img1.src = '/img/anons/april.jpg'

      context.drawImage(image, 0, 0, 1080, 1920)

      const dataUrl = canvas.toDataURL('image/png')
      output.src = dataUrl

      var link = document.createElement('a')
      link.setAttribute(
        'download',
        `${name}${
          listsCount > 1 ? ` (лист ${i + 1} из ${listsCount})` : ''
        }.png`
      )
      link.setAttribute(
        'href',
        canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream')
      )
      link.click()

      // var image2 = canvas
      //   .toDataURL('image/png')
      //   .replace('image/png', 'image/octet-stream')
      // window.location.href = image2
    })
    image.src = svgDataUrl
  }
}

const styles = [
  {
    startX: 145,
    startY: 480,
    dotGapY: 0,
    minGap: 35,
    maxGap: 120,
    textLengthMax: 45,
    dateHeight: 36,
    dateTextGap: 10,
    lineHeight: 32,
    maxHeight: 1000,
  },
  {
    startX: 160,
    startY: 480,
    dotGapY: 20,
    minGap: 35,
    maxGap: 120,
    textLengthMax: 43,
    dateHeight: 36,
    dateTextGap: 10,
    lineHeight: 32,
    maxHeight: 1000,
  },
]

const closedEventsDirectionId = '6253de126daccdbf1ba85874' //6301d334e5b7fa785515faac

const ToolsAnonsContent = () => {
  // const modalsFunc = useRecoilValue(modalsFuncAtom)
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

  const eventsInMonth = events.filter((event) => {
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
    startX,
    startY,
    dotGapY,
    minGap,
    maxGap,
    textLengthMax,
    dateHeight,
    dateTextGap,
    lineHeight,
    maxHeight,
  } = styles[styleNum]

  const preparedItems = items.map(({ date, text, dot, day, week }, index) => {
    const textSplit = text.split(' ')

    var chars = 0
    var line = 0
    var textArray = []

    textSplit.forEach((word) => {
      const wordLength = word.length
      if (chars + wordLength > textLengthMax) {
        ++line
        chars = 0
      }
      chars += wordLength
      textArray[line] = textArray[line] ? textArray[line] + ' ' + word : word
    })

    return { date, textArray, dot, day, week }
  })

  const listsCount = Math.ceil(preparedItems.length / 10)
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

  var addedLines

  return (
    <div className="px-1">
      <div className="flex flex-wrap gap-x-1">
        <ComboBox
          className="max-w-40"
          label="Месяц"
          items={[
            { value: 0, name: 'Январь' },
            { value: 1, name: 'Февраль' },
            { value: 2, name: 'Март' },
            { value: 3, name: 'Апрель' },
            { value: 4, name: 'Май' },
            { value: 5, name: 'Июнь' },
            { value: 6, name: 'Июль' },
            { value: 7, name: 'Август' },
            { value: 8, name: 'Сентябрь' },
            { value: 9, name: 'Октябрь' },
            { value: 10, name: 'Ноябрь' },
            { value: 11, name: 'Декабрь' },
          ]}
          defaultValue={month}
          onChange={(value) => setMonth(Number(value))}
        />
        <ComboBox
          label="Год"
          className="max-w-30"
          items={[
            { value: 2022, name: '2022' },
            { value: 2023, name: '2023' },
          ]}
          defaultValue={year}
          onChange={(value) => setYear(Number(value))}
        />
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
      <Button
        name="Сохранить"
        onClick={() =>
          save(
            listsWithPreparedItems.length,
            '/img/anons/april.jpg',
            'Анонс ' + MONTHS_FULL_1[month]
          )
        }
      />
      <div className="flex overflow-x-auto gap-x-1 max-h-[calc(100vh-160px)] overflow-y-auto">
        {listsWithPreparedItems.map((preparedItems, index) => {
          addedLines = 0
          const fullHeight = preparedItems.reduce(
            (total, { date, textArray }) =>
              total + dateTextGap + lineHeight * textArray.length,
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
              <image href="/img/anons/april.jpg" height="1920" width="1080" />
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
                      {showDot && (
                        <circle
                          cx={startX}
                          cy={
                            startY +
                            dotGapY +
                            index * gap +
                            index * dateTextGap +
                            index * dateHeight +
                            addedLines * lineHeight
                          }
                          r="20"
                          fill="white"
                          // stroke-width="5"
                          // stroke="rgb(150,110,200)"
                        />
                      )}
                      {showDot && day && week && (
                        <>
                          <text
                            x={startX - 72}
                            y={
                              startY +
                              index * gap +
                              index * dateTextGap +
                              index * dateHeight +
                              15 +
                              // 10 +
                              addedLines * lineHeight
                            }
                            fontSize={60}
                            fill="white"
                            fontWeight="bold"
                            textAnchor="middle"
                          >
                            {day}
                          </text>
                          <text
                            x={startX - 72}
                            y={
                              startY +
                              index * gap +
                              index * dateTextGap +
                              index * dateHeight +
                              60 +
                              addedLines * lineHeight
                            }
                            fontSize={48}
                            fill="white"
                            // fontWeight="bold"
                            textAnchor="middle"
                          >
                            {week}
                          </text>
                        </>
                      )}
                      <text
                        x={startX + 50}
                        y={
                          startY +
                          index * gap +
                          index * dateTextGap +
                          index * dateHeight +
                          10 +
                          addedLines * lineHeight
                        }
                        fontSize={dateHeight}
                        fill="white"
                        fontWeight="bold"
                      >
                        {date}
                      </text>
                      {textArray.map((textLine, lineNum) => {
                        ++addedLines
                        return (
                          <text
                            key={textLine + lineNum}
                            x={startX + 50}
                            y={
                              startY +
                              10 +
                              index * gap +
                              (index + 1) * dateTextGap +
                              index * dateHeight +
                              // 20 +
                              addedLines * lineHeight
                              // lineNum * lineHeight
                            }
                            fontSize={lineHeight}
                            fill="white"
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
                x1={startX}
                y1={startY - 50}
                x2={startX}
                y2={
                  startY +
                  preparedItems.length * (dateTextGap + dateHeight) +
                  (preparedItems.length - 1) * gap +
                  addedLines * lineHeight
                }
                strokeWidth="3"
                stroke="white"
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
