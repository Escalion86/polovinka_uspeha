import Button from '@components/Button'
import CheckBox from '@components/CheckBox'
import ErrorsList from '@components/ErrorsList'
import FormWrapper from '@components/FormWrapper'
import Input from '@components/Input'
import InputImage from '@components/InputImage'
import { postData } from '@helpers/CRUD'
import useErrors from '@helpers/useErrors'
import loggedUserAtom from '@state/atoms/loggedUserAtom'
import siteSettingsAtom from '@state/atoms/siteSettingsAtom'
import { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'

const SupervisorBlockContent = (props) => {
  const loggedUser = useRecoilValue(loggedUserAtom)
  const [siteSettings, setSiteSettings] = useRecoilState(siteSettingsAtom)
  const [photo, setPhoto] = useState(siteSettings?.supervisor?.photo)
  const [quote, setQuote] = useState(siteSettings?.supervisor?.quote)
  const [name, setName] = useState(siteSettings?.supervisor?.name)
  const [showOnSite, setShowOnSite] = useState(
    siteSettings?.supervisor?.showOnSite
  )

  const [errors, checkErrors, addError, removeError, clearErrors] = useErrors()

  const [isWaitingToResponse, setIsWaitingToResponse] = useState(false)
  const [message, setMessage] = useState('')

  const formChanged =
    siteSettings?.supervisor?.photo !== photo ||
    siteSettings?.supervisor?.quote !== quote ||
    siteSettings?.supervisor?.name !== name ||
    siteSettings?.supervisor?.showOnSite !== showOnSite

  const onClickConfirm = async () => {
    if (
      !checkErrors({
        photo,
        quote,
        supervisorName: name,
      })
    )
      await postData(
        `/api/site`,
        {
          supervisor: { photo, quote, name, showOnSite },
        },
        (data) => {
          setSiteSettings(data)
          setMessage('Данные обновлены успешно')
          setIsWaitingToResponse(false)
          // refreshPage()
        },
        () => {
          setMessage('')
          addError({ response: 'Ошибка обновления данных' })
          setIsWaitingToResponse(false)
        },
        false,
        loggedUser?._id
      )
  }

  useEffect(() => {
    if (isWaitingToResponse) {
      setIsWaitingToResponse(false)
      // setMessage('Данные анкеты обновлены успешно')
    }
  }, [props])

  const buttonDisabled = !formChanged

  return (
    <div className="flex flex-col flex-1 h-screen px-2 my-2 gap-y-2">
      <div className="flex items-center w-full p-1 gap-x-1">
        <div className="flex flex-row-reverse flex-1">
          {!buttonDisabled && (
            <span className="leading-4 text-right tablet:text-lg">
              Чтобы изменения вступили в силу нажмите:
            </span>
          )}
        </div>
        <Button
          name="Применить"
          disabled={!formChanged}
          onClick={onClickConfirm}
          loading={isWaitingToResponse}
        />
      </div>
      <ErrorsList errors={errors} />
      {message && !isWaitingToResponse && (
        <div className="flex flex-col col-span-2 text-success">{message}</div>
      )}
      <FormWrapper>
        <InputImage
          label="Фотография"
          directory="supervisor"
          image={photo}
          onChange={setPhoto}
          required
          // aspect={1}
        />
        <Input
          label="Имя и Фамилия руководителя"
          value={name}
          onChange={setName}
          error={errors.supervisorName}
          required
        />
        <Input
          label="Цитата руководителя"
          value={quote}
          onChange={setQuote}
          error={errors.quote}
          required
        />
        <CheckBox
          checked={showOnSite}
          labelPos="left"
          // labelClassName="w-40"
          onClick={() => setShowOnSite((checked) => !checked)}
          label="Показывать на сайте"
        />
      </FormWrapper>
    </div>
  )
}

export default SupervisorBlockContent
