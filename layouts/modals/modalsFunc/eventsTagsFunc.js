import React, { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'

import FormWrapper from '@components/FormWrapper'
import eventsTagsAtom from '@state/atoms/eventsTagsAtom'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import Button from '@components/Button'
import Input from '@components/Input'
import ColorPicker from '@components/ColorPicker'
import siteSettingsAtom from '@state/atoms/siteSettingsAtom'

const eventsTagsFunc = () => {
  const EventsTagsModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
  }) => {
    const [siteSettings, setSiteSettings] = useRecoilState(siteSettingsAtom)
    // const setEventsTags = useRecoilValue(itemsFuncAtom).eventsTags.set
    const [tags, setTags] = useState(siteSettings.eventsTags ?? [])

    const onAdd = () => {
      setTags((state) => [...state, { text: '', color: '#ffffff' }])
    }

    const onEditColor = (index, color) => {
      setTags((state) => {
        const oldState = [...state]
        oldState[index] = { ...oldState[index], color }
        return oldState
      })
    }

    const onEditText = (index, text) => {
      setTags((state) => {
        const oldState = [...state]
        oldState[index] = { ...oldState[index], text }
        return oldState
      })
    }

    const onClickConfirm = async () => {
      closeModal()
      await postData(
        `/api/site`,
        {
          eventsTags: tags,
        },
        (data) => {
          setSiteSettings(data)
        },
        () => {
          addError({ response: 'Ошибка обновления тэгов' })
        },
        false,
        loggedUser._id
      )
    }

    useEffect(() => {
      console.log('tags :>> ', tags)
      if (tags.length === 0) {
        setOnConfirmFunc(undefined)
        setDisableConfirm(true)
      } else {
        setOnConfirmFunc(onClickConfirm)
        setDisableConfirm(false)
      }
    }, [tags])

    return (
      <FormWrapper className="">
        {tags.map(({ text, color }, index) => (
          <div className="flex -mt-2 gap-x-2">
            <Input
              label="Новый тэг"
              onChange={(value) => onEditText(index, value)}
              inputClassName="uppercase"
            />
            <ColorPicker
              label="Цвет"
              value={color}
              onChange={(color) => onEditColor(index, color)}
            />
            <div>{text}</div>
          </div>
        ))}
        <Button name="Добавить" thin onClick={onAdd} icon={faPlus} />
      </FormWrapper>
    )
  }

  return {
    title: `Тэги мероприятий`,
    declineButtonName: 'Закрыть',
    closeButtonShow: true,
    confirmButtonName: 'Применить',
    Children: EventsTagsModal,
  }
}

export default eventsTagsFunc
