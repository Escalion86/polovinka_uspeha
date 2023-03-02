import { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import siteSettingsAtom from '@state/atoms/siteSettingsAtom'

import Button from '@components/Button'
import ErrorsList from '@components/ErrorsList'
import FormWrapper from '@components/FormWrapper'
import Input from '@components/Input'
import PhoneInput from '@components/PhoneInput'
import { postData, putData } from '@helpers/CRUD'
import useErrors from '@helpers/useErrors'
import ValuePicker from '@components/ValuePicker/ValuePicker'
import { CODE_SEND_SERVICES } from '@helpers/constants'

// TODO Сделать правильное обновление страницы (а не полную перезагрузку), а также добавить редактирование Email
const SettingsContent = (props) => {
  const [siteSettings, setSiteSettings] = useRecoilState(siteSettingsAtom)
  const [codeSendService, setCodeSendService] = useState(
    siteSettings?.codeSendService
  )

  const [errors, checkErrors, addError, removeError, clearErrors] = useErrors()

  const [isWaitingToResponse, setIsWaitingToResponse] = useState(false)
  const [message, setMessage] = useState('')

  const formChanged = siteSettings?.codeSendService !== codeSendService

  const onClickConfirm = async () => {
    // if (
    //   !checkErrors({
    //     phoneNoRequired: phone,
    //     viber,
    //     whatsapp,
    //     email,
    //   })
    // )
    await postData(
      `/api/site`,
      {
        codeSendService,
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
      }
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
        <ValuePicker
          value={codeSendService}
          valuesArray={CODE_SEND_SERVICES}
          label="Сервис получения кода для подтверждения номера телефона"
          onChange={setCodeSendService}
          name="codeSendService"
          // required={required}
          // error={error}
        />
      </FormWrapper>
    </div>
  )
}

export default SettingsContent
