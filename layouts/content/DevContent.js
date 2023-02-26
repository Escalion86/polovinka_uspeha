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
