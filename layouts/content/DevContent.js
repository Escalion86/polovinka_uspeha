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

const DevCard = ({ title, data }) => {
  const modalsFunc = useRecoilValue(modalsFuncAtom)

  return (
    <CardWrapper
      // loading={loading}
      // onClick={() => !loading && modalsFunc.direction.edit(direction._id)}
      // showOnSite={direction.showOnSite}
      onClick={() => modalsFunc.json(data)}
    >
      <div className="flex items-center px-1 gap-x-2">
        <div className="text-xl font-bold">{title}</div>
        <span className="text-xl font-bold text-red-600">{data.length}</span>
        {/* <pre>{JSON.stringify(data, null, 4)}</pre> */}
      </div>
    </CardWrapper>
  )
}

const DevContent = () => {
  const modalsFunc = useRecoilValue(modalsFuncAtom)
  const events = useRecoilValue(eventsAtom)
  const users = useRecoilValue(usersAtom)
  const eventsUsers = useRecoilValue(eventsUsersAtom)
  const directions = useRecoilValue(directionsAtom)
  const reviews = useRecoilValue(reviewsAtom)
  const additionalBlocks = useRecoilValue(additionalBlocksAtom)
  const payments = useRecoilValue(paymentsAtom)

  const [images, setImages] = useState([])
  const [project, setProject] = useState('')
  const [folder, setFolder] = useState('')

  const usersImages = users
    .filter((user) =>
      user.images.find((src) => {
        console.log('src', src)
        return src && src.includes('cloudinary.com')
      })
    )
    .map((user) => {
      console.log('user.images', user.images)
      return {
        userName: `${user.secondName} ${user.firstName}`,
        images: user.images.filter((src) => src.includes('cloudinary.com')),
      }
    })

  function toDataURL(url) {
    return fetch(url)
      .then((response) => {
        return response.blob()
      })
      .then((blob) => {
        return URL.createObjectURL(blob)
      })
  }

  function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  const download = () => {
    async function downloadUrl(uri, name) {
      var link = document.createElement('a')
      link.href = await toDataURL(uri)
      link.download = name
      // link.href = uri
      link.click()
      await timeout(500)
    }
    var counter = 0
    for (let i = 0; i < usersImages.length; i++) {
      for (let j = 0; j < usersImages[i].images.length; j++) {
        downloadUrl(usersImages[i].images[j], usersImages[i].userName + j)
        counter++
      }
    }
    console.log('counter', counter)
  }
  const monthNum = 5 // Апрель
  const yearNum = 2023
  const eventsInMonth = events.filter((event) => {
    const date = new Date(event.dateStart)
    const month = date.getMonth()
    const year = date.getFullYear()
    return month === monthNum && year === yearNum
  })

  const items = eventsInMonth.map((event) => ({
    date: formatDateTime(event.dateStart, true, false, true, false, false),
    text: event.title,
  }))

  const startX = 145
  const startY = 470
  const gap = 120
  const textLengthMax = 60
  const lineHeight = 30
  // const items = [
  //   { date: '6 апреля ЧТ', text: 'Мероприятие закрытого клуба' },
  //   { date: '7 апреля ЧТ', text: 'Пятничная баня' },
  //   { date: '8 апреля ЧТ', text: 'Настольные игры' },
  //   { date: '9 апреля ЧТ', text: 'Мероприятие закрытого клуба' },
  // ]

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

      // var link = document.createElement('a')
      // link.setAttribute('download', 'MintyPaper.png')
      // link.setAttribute(
      //   'href',
      //   canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream')
      // )
      // link.click()

      // var image2 = canvas
      //   .toDataURL('image/png')
      //   .replace('image/png', 'image/octet-stream')
      // window.location.href = image2
    })
    image.src = svgDataUrl
  }

  var addedLines = 0

  return (
    // <CardListWrapper>
    //   <FormWrapper>
    //     <Input
    //       label="Project"
    //       type="text"
    //       value={project}
    //       onChange={(value) => {
    //         setProject(value)
    //       }}
    //     />
    //     <Input
    //       label="Folder"
    //       type="text"
    //       value={folder}
    //       onChange={(value) => {
    //         setFolder(value)
    //       }}
    //     />
    //     <InputImages
    //       label="escalioncloud"
    //       directory={folder}
    //       project={project}
    //       images={images}
    //       onChange={(images) => {
    //         setImages(images)
    //       }}
    //     />
    //     <Button onClick={download}>Скачать</Button>
    //   </FormWrapper>
    //   <DevCard title="users" data={users} />
    //   <DevCard title="events" data={events} />
    //   <DevCard title="eventsUsers" data={eventsUsers} />
    //   <DevCard title="directions" data={directions} />
    //   <DevCard title="reviews" data={reviews} />
    //   <DevCard title="additionalBlocks" data={additionalBlocks} />
    //   <DevCard title="payments" data={payments} />
    //   {/* <div onClick={() => modalsFunc.test()}>ТЕСТ</div> */}
    // </CardListWrapper>
    <div>
      <div className="flex bg-gray-400 gap-x-2">
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
          {items.map(({ date, text }, index) => {
            const textSplit = text.split(' ')
            console.log('textArray', textArray)
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
              textArray[line] = textArray[line]
                ? textArray[line] + ' ' + word
                : word
            })

            return (
              <>
                <circle
                  cx={startX}
                  cy={startY + index * gap + addedLines * lineHeight}
                  r="20"
                  fill="white"
                  // stroke-width="5"
                  // stroke="rgb(150,110,200)"
                />
                <text
                  x={startX + 50}
                  y={startY + index * gap + 10 + addedLines * lineHeight}
                  fontSize={32}
                  fill="white"
                  fontWeight="bold"
                >
                  {date}
                </text>
                {textArray.map((textLine, lineNum) => {
                  if (lineNum > 0) ++addedLines
                  return (
                    <text
                      x={startX + 50}
                      y={
                        startY + index * gap + 50 + addedLines * lineHeight
                        // lineNum * lineHeight
                      }
                      fontSize={28}
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
            y2={startY + items.length * gap + addedLines * lineHeight - 50}
            strokeWidth="3"
            stroke="white"
          />
        </svg>
        <img
          id="output"
          alt=""
          width="270"
          height="480"
          className="max-w-[270px] max-h-[480px]"
        />
      </div>
      <button onClick={() => save()}>Применить</button>
    </div>
  )
}

export default DevContent
