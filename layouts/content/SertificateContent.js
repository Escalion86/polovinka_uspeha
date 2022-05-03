// import { modalsFuncAtom } from '@state/atoms'
// import { useRecoilValue } from 'recoil'

import Button from '@components/Button'
import CheckBox from '@components/CheckBox'
import EditableTextarea from '@components/EditableTextarea'
import FormWrapper from '@components/FormWrapper'
import Input from '@components/Input'
import InputImage from '@components/InputImage'
import { putData } from '@helpers/CRUD'
import useErrors from '@helpers/useErrors'
import { useRouter } from 'next/router'
import { useState } from 'react'

const SertificateContent = ({
  user,
  events,
  directions,
  reviews,
  sertificates,
}) => {
  const sertificate = sertificates[0]
  const [title, setTitle] = useState(sertificate?.title)
  const [description, setDescription] = useState(sertificate?.description)
  const [image, setImage] = useState(sertificate?.image)
  const [showOnSite, setShowOnSite] = useState(sertificate?.showOnSite)

  const [errors, addError, removeError, clearErrors] = useErrors()

  const router = useRouter()

  const refreshPage = () => {
    router.replace(router.asPath)
  }

  const handleSubmit = async () => {
    await putData(
      `/api/sertificates/${sertificate._id}`,
      {
        title,
        description,
        image,
        showOnSite,
      },
      refreshPage
    )
  }

  const formChanged =
    sertificate?.title !== title ||
    sertificate?.description !== description ||
    sertificate?.image !== image ||
    sertificate?.showOnSite !== showOnSite

  return (
    <>
      <div className="flex flex-col px-2 gap-y-2">
        <FormWrapper className="p-2">
          <InputImage
            label="Картинка"
            directory="sertificate"
            image={image}
            onChange={setImage}
          />
          <Input
            label="Название"
            type="text"
            value={title}
            onChange={(value) => {
              removeError('title')
              setTitle(value)
            }}
            // labelClassName="w-40"
            error={errors.title}
            forGrid
          />
          <EditableTextarea
            label="Описание"
            html={description}
            uncontrolled={false}
            onChange={(value) => {
              removeError('description')
              setDescription(value)
            }}
            forGrid
          />
          <CheckBox
            checked={showOnSite}
            labelPos="left"
            // labelClassName="w-40"
            forGrid
            onClick={() => setShowOnSite((checked) => !checked)}
            label="Показывать на сайте"
          />
        </FormWrapper>
        <Button
          name="Применить"
          disabled={!formChanged}
          onClick={handleSubmit}
        />
      </div>
    </>
  )
}

export default SertificateContent
