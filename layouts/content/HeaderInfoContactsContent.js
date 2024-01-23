import Button from '@components/Button'
import ErrorsList from '@components/ErrorsList'
import FormWrapper from '@components/FormWrapper'
import Input from '@components/Input'
import Note from '@components/Note'
import PhoneInput from '@components/PhoneInput'
import { postData } from '@helpers/CRUD'
import useErrors from '@helpers/useErrors'
import loggedUserAtom from '@state/atoms/loggedUserAtom'
import siteSettingsAtom from '@state/atoms/siteSettingsAtom'
import { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'

const HeaderInfoContactsContent = (props) => {
  const loggedUser = useRecoilValue(loggedUserAtom)
  const [siteSettings, setSiteSettings] = useRecoilState(siteSettingsAtom)
  const [whatsapp, setWhatsapp] = useState(siteSettings?.headerInfo?.whatsapp)
  const [telegram, setTelegram] = useState(siteSettings?.headerInfo?.telegram)
  const [memberChatLink, setMemberChatLink] = useState(
    siteSettings?.headerInfo?.memberChatLink
  )

  const [errors, checkErrors, addError, removeError, clearErrors] = useErrors()

  const [isWaitingToResponse, setIsWaitingToResponse] = useState(false)
  const [message, setMessage] = useState('')

  const formChanged =
    siteSettings?.headerInfo?.whatsapp !== whatsapp ||
    siteSettings?.headerInfo?.telegram !== telegram ||
    siteSettings?.headerInfo?.memberChatLink !== memberChatLink

  const onClickConfirm = async () => {
    if (
      !checkErrors({
        whatsapp,
      })
    )
      await postData(
        `/api/site`,
        {
          headerInfo: { whatsapp, telegram, memberChatLink },
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
        loggedUser?._id
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
      <Note>
        <span>
          Данная информация необходима для выпадающего меню при наведении
          курсора на медаль в шапке (возле аватара)
        </span>
      </Note>

      <FormWrapper>
        <div>Контакты для связи по вопросам вступления в клуб:</div>
        <div className="flex flex-wrap gap-x-2">
          <PhoneInput
            label="Whatsapp"
            value={whatsapp}
            onChange={setWhatsapp}
            error={errors.whatsapp}
          />
          <Input
            prefix="@"
            label="Telegram"
            value={telegram}
            onChange={setTelegram}
          />
        </div>
        <Input
          label="Ссылка на чат клуба (доступна только для клуба)"
          type="text"
          value={memberChatLink}
          onChange={setMemberChatLink}
        />
      </FormWrapper>
    </div>
  )
}

export default HeaderInfoContactsContent
