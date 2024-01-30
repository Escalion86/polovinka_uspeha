import Button from '@components/Button'
import ErrorsList from '@components/ErrorsList'
import FormWrapper from '@components/FormWrapper'
import ValuePicker from '@components/ValuePicker/ValuePicker'
import { postData } from '@helpers/CRUD'
import { CODE_SEND_SERVICES } from '@helpers/constants'
import useErrors from '@helpers/useErrors'
import loggedUserAtom from '@state/atoms/loggedUserAtom'
import siteSettingsAtom from '@state/atoms/siteSettingsAtom'
import { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'

const getBalance = async (onSuccess, onError) =>
  await postData(
    `/api/telefonip`,
    {
      get_balance: true,
    },
    onSuccess,
    onError,
    false,
    null,
    true
  )

const SettingsCodeSendServiceContent = (props) => {
  const loggedUser = useRecoilValue(loggedUserAtom)
  const [siteSettings, setSiteSettings] = useRecoilState(siteSettingsAtom)
  const [codeSendService, setCodeSendService] = useState(
    siteSettings?.codeSendService
  )

  const [codeSendServiceInfo, setCodeSendServiceInfo] = useState(null)

  const [errors, checkErrors, addError, removeError, clearErrors] = useErrors()

  const [isWaitingToResponse, setIsWaitingToResponse] = useState(false)
  const [message, setMessage] = useState('')

  const formChanged = siteSettings?.codeSendService !== codeSendService

  useEffect(() => {
    if (codeSendService === 'telefonip')
      getBalance((response) => {
        setCodeSendServiceInfo(response.data)
      })
    else setCodeSendServiceInfo(null)
  }, [codeSendService])

  const onClickConfirm = async () => {
    await postData(
      `/api/site`,
      {
        codeSendService,
      },
      (data) => {
        setSiteSettings(data)
        setMessage('Данные обновлены успешно')
        setIsWaitingToResponse(false)
      },
      () => {
        setMessage('')
        addError({ response: 'Ошибка обновления данных' })
        setIsWaitingToResponse(false)
      },
      false,
      loggedUser._id
    )
  }

  useEffect(() => {
    if (isWaitingToResponse) {
      setIsWaitingToResponse(false)
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
          label="Сервис подтверждения номера телефона"
          onChange={setCodeSendService}
          name="codeSendService"
          disabledValues={['ucaller']}
        />
        {codeSendService === 'telefonip' && (
          <div>
            <div className="flex gap-x-1">
              <span className="italic">Баланс на счете:</span>
              <span>
                {!codeSendServiceInfo?.balance
                  ? 'загружаем информацию...'
                  : `${codeSendServiceInfo?.balance} ₽`}
              </span>
            </div>
          </div>
        )}
      </FormWrapper>
    </div>
  )
}

export default SettingsCodeSendServiceContent
