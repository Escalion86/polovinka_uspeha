'use client'

import Button from '@components/Button'
import ComboBox from '@components/ComboBox'
import ErrorsList from '@components/ErrorsList'
import FormWrapper from '@components/FormWrapper'
import Input from '@components/Input'
import Textarea from '@components/Textarea'
import { postData } from '@helpers/CRUD'
import useErrors from '@helpers/useErrors'
import directionsAtom from '@state/atoms/directionsAtom'
import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'
import locationAtom from '@state/atoms/locationAtom'
import siteSettingsAtom from '@state/atoms/siteSettingsAtom'
import { useAtom, useAtomValue } from 'jotai'
import { useEffect, useMemo, useState } from 'react'

const DEFAULT_CLOSED_SPACE_SUBTITLE = 'ЗАКРЫТОЕ ПРОСТРАНСТВО ДЛЯ СВОИХ'
const DEFAULT_CLOSED_SPACE_DESCRIPTION =
  'Это формат с камерными встречами, где мы собираем небольшие группы по ценностям. Здесь больше глубины, доверия и долгих разговоров. Доступ открывается после знакомства с командой и участия в открытых мероприятиях.'

const sortByIndexAndTitle = (a, b) => {
  const indexA =
    typeof a?.index === 'number' ? a.index : Number.MAX_SAFE_INTEGER
  const indexB =
    typeof b?.index === 'number' ? b.index : Number.MAX_SAFE_INTEGER
  if (indexA !== indexB) return indexA - indexB
  return String(a?.title ?? '').localeCompare(String(b?.title ?? ''))
}

const ClosedSpaceContent = () => {
  const location = useAtomValue(locationAtom)
  const loggedUserActive = useAtomValue(loggedUserActiveAtom)
  const directions = useAtomValue(directionsAtom)
  const [siteSettings, setSiteSettings] = useAtom(siteSettingsAtom)
  const [errors, checkErrors, addError] = useErrors()
  const [isWaitingToResponse, setIsWaitingToResponse] = useState(false)
  const [message, setMessage] = useState('')

  const selectableDirections = useMemo(
    () =>
      (Array.isArray(directions) ? directions : [])
        .sort(sortByIndexAndTitle),
    [directions]
  )

  const [directionId, setDirectionId] = useState(
    siteSettings?.closedSpace?.directionId ?? null
  )
  const [subtitle, setSubtitle] = useState(
    siteSettings?.closedSpace?.subtitle ?? DEFAULT_CLOSED_SPACE_SUBTITLE
  )
  const [description, setDescription] = useState(
    siteSettings?.closedSpace?.description ?? DEFAULT_CLOSED_SPACE_DESCRIPTION
  )

  useEffect(() => {
    setDirectionId(siteSettings?.closedSpace?.directionId ?? null)
    setSubtitle(
      siteSettings?.closedSpace?.subtitle ?? DEFAULT_CLOSED_SPACE_SUBTITLE
    )
    setDescription(
      siteSettings?.closedSpace?.description ?? DEFAULT_CLOSED_SPACE_DESCRIPTION
    )
  }, [
    siteSettings?.closedSpace?.directionId,
    siteSettings?.closedSpace?.subtitle,
    siteSettings?.closedSpace?.description,
  ])

  const formChanged =
    (siteSettings?.closedSpace?.directionId ?? null) !==
      (directionId ?? null) ||
    (siteSettings?.closedSpace?.subtitle ?? DEFAULT_CLOSED_SPACE_SUBTITLE) !==
      subtitle ||
    (siteSettings?.closedSpace?.description ??
      DEFAULT_CLOSED_SPACE_DESCRIPTION) !== description

  const onClickConfirm = async () => {
    if (!checkErrors({})) {
      setIsWaitingToResponse(true)
      await postData(
        `/api/${location}/site`,
        {
          closedSpace: {
            directionId: directionId ?? null,
            subtitle: subtitle || DEFAULT_CLOSED_SPACE_SUBTITLE,
            description: description || DEFAULT_CLOSED_SPACE_DESCRIPTION,
          },
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
        loggedUserActive?._id
      )
    }
  }

  return (
    <div className="flex flex-col flex-1 h-screen px-2 my-2 gap-y-2">
      <div className="flex items-center w-full p-1 gap-x-1">
        <div className="flex flex-row-reverse flex-1">
          {formChanged && (
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
        <div className="flex flex-col text-success">{message}</div>
      )}
      <FormWrapper>
        <ComboBox
          label="Закрытое пространство"
          placeholder="Не выбрано"
          activePlaceholder
          value={directionId}
          onChange={setDirectionId}
          items={selectableDirections.map((item) => {
            const isHidden = item?.showOnSite === false
            return {
              value: item?._id,
              name: `${item?.title || 'Без названия'}${isHidden ? ' (скрыто на сайте)' : ''}`,
            }
          })}
          fullWidth
        />
        <div className="px-2">
          <Button
            name="Сбросить выбор"
            onClick={() => setDirectionId(null)}
            disabled={directionId === null}
          />
        </div>
        <div className="px-2 text-sm text-gray-600">
          Выбранное пространство будет вести из блока "Наши пространства" в
          секцию "Закрытое пространство".
        </div>
        <Input label="Подзаголовок" value={subtitle} onChange={setSubtitle} />
        <Textarea
          label="Описание"
          value={description}
          onChange={setDescription}
          rows={5}
        />
      </FormWrapper>
    </div>
  )
}

export default ClosedSpaceContent
