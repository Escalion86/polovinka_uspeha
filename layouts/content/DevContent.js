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

  return (
    <CardListWrapper>
      <FormWrapper>
        <Input
          label="Project"
          type="text"
          value={project}
          onChange={(value) => {
            setProject(value)
          }}
        />
        <Input
          label="Folder"
          type="text"
          value={folder}
          onChange={(value) => {
            setFolder(value)
          }}
        />
        <InputImages
          label="escalioncloud"
          directory={folder}
          project={project}
          images={images}
          onChange={(images) => {
            setImages(images)
          }}
        />
        <Button onClick={download}>Скачать</Button>
      </FormWrapper>
      <DevCard title="users" data={users} />
      <DevCard title="events" data={events} />
      <DevCard title="eventsUsers" data={eventsUsers} />
      <DevCard title="directions" data={directions} />
      <DevCard title="reviews" data={reviews} />
      <DevCard title="additionalBlocks" data={additionalBlocks} />
      <DevCard title="payments" data={payments} />
      {/* <div onClick={() => modalsFunc.test()}>ТЕСТ</div> */}
    </CardListWrapper>
  )
}

export default DevContent
