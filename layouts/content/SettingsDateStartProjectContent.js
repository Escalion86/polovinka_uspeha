import Button from '@components/Button'
import DateTimePicker from '@components/DateTimePicker'
import FormWrapper from '@components/FormWrapper'
import { postData } from '@helpers/CRUD'
import loggedUserAtom from '@state/atoms/loggedUserAtom'
import siteSettingsAtom from '@state/atoms/siteSettingsAtom'
import { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'

const SettingsDateStartProjectContent = (props) => {
  const loggedUser = useRecoilValue(loggedUserAtom)
  const [siteSettings, setSiteSettings] = useRecoilState(siteSettingsAtom)
  const [dateStartProject, setDateStartProject] = useState(
    siteSettings?.dateStartProject ?? null
  )

  const [isWaitingToResponse, setIsWaitingToResponse] = useState(false)
  const [message, setMessage] = useState('')

  const formChanged = siteSettings?.dateStartProject !== dateStartProject

  const onClickConfirm = async () => {
    await postData(
      `/api/site`,
      {
        dateStartProject,
      },
      (data) => {
        console.log('data :>> ', data)
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
      {message && !isWaitingToResponse && (
        <div className="flex flex-col col-span-2 text-success">{message}</div>
      )}
      <FormWrapper className="flex gap-x-2">
        <DateTimePicker
          value={dateStartProject}
          onChange={setDateStartProject}
          label="Дата старта проекта"
          noMargin
        />
        <Button
          className="mt-1"
          name="Сбросить"
          onClick={() => setDateStartProject(null)}
        />
        {/* {getDiffBetweenDates(dateStartProject) > 0 && (
                <div className="flex items-center pt-[4px] leading-3 laptop:pt-0 text-danger">
                  Внимание: дата прошла!
                </div>
              )} */}
      </FormWrapper>
    </div>
  )
}

export default SettingsDateStartProjectContent
