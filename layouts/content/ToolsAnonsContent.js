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
import { MONTHS } from '@helpers/constants'
import sortFunctions from '@helpers/sortFunctions'

const ToolsAnonsContent = () => {
  const modalsFunc = useRecoilValue(modalsFuncAtom)
  const events = useRecoilValue(eventsAtom)
  const users = useRecoilValue(usersAtom)
  const eventsUsers = useRecoilValue(eventsUsersAtom)
  const directions = useRecoilValue(directionsAtom)
  const reviews = useRecoilValue(reviewsAtom)
  const additionalBlocks = useRecoilValue(additionalBlocksAtom)
  const payments = useRecoilValue(paymentsAtom)

  const [month, setMonth] = useState(new Date().getMonth())
  const [year, setYear] = useState(new Date().getFullYear())

  const eventsInMonth = events.filter((event) => {
    const date = new Date(event.dateStart)
    const eventMonth = date.getMonth()
    const eventYear = date.getFullYear()
    return eventMonth === month && eventYear === year
  })

  const items = [...eventsInMonth]
    .sort(sortFunctions.dateStart.asc)
    .map((event) => {
      const dateStart = dateToDateTimeStr(event.dateStart, true, true, false)
      const dateEnd = dateToDateTimeStr(event.dateEnd, true, true, false)
      var date = ''
      if (dateStart[0] === dateEnd[0]) {
        date = `${dateStart[0]} ${dateStart[1]} - ${dateEnd[1]}`
      } else {
        date = `${dateStart[0]} ${dateStart[1]} - ${dateEnd[0]} ${dateEnd[1]}`
      }
      return {
        date,
        text: event.title,
      }
    })

  const startX = 145
  const startY = 480
  const minGap = 50
  const maxGap = 120
  const textLengthMax = 45
  const dateHeight = 36
  const dateTextGap = 15
  const lineHeight = 32
  const maxHeight = 1100

  function loadImage(url) {
    return new Promise((r) => {
      let i = new Image()
      i.onload = () => r(i)
      i.src = url
    })
  }

  const save = async () => {
    const input = document.querySelector('#input')
    const output = document.querySelector('#output')

    const svgData = new XMLSerializer().serializeToString(input)
    const svgDataBase64 = btoa(unescape(encodeURIComponent(svgData)))

    const svgDataUrl = `data:image/svg+xml;charset=utf-8;base64,${svgDataBase64}`

    const image = new Image()
    const imgBg = await loadImage('/img/anons/april.jpg')

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
      link.setAttribute('download', 'MintyPaper.png')
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

  var addedLines = 0

  const preparedItems = items.map(({ date, text }, index) => {
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

    return { date, textArray }
  })

  // preparedItems.push(preparedItems[0])
  // preparedItems.push(preparedItems[0])
  // preparedItems.push(preparedItems[0])
  // preparedItems.push(preparedItems[0])

  // const itemsCount = preparedItems.length
  const fullHeight = preparedItems.reduce(
    (total, { date, textArray }) =>
      total + dateTextGap + lineHeight * textArray.length,
    0
  )

  // const fullHeightWithGap =
  //   preparedItems.length * (dateTextGap + dateHeight) +
  //   (preparedItems.length - 1) * minGap +
  //   addedLines * lineHeight

  const gap = Math.min(
    Math.max(minGap, (maxHeight - fullHeight) / (preparedItems.length - 1)),
    maxGap
  )

  return (
    <div className="px-1">
      <div>
        <ComboBox
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
      </div>
      <div className="max-h-[calc(100vh-124px)] overflow-y-scroll">
        <Button name="Сохранить" onClick={() => save()} />
        <svg
          width="270"
          height="480"
          viewBox="0 0 1080 1920"
          id="input"
          className="border"
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
          {preparedItems.map(({ date, textArray }, index) => {
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

            return (
              <>
                <circle
                  cx={startX}
                  cy={
                    startY +
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
              </>
            )
          })}
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