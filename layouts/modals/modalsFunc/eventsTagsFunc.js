import Button from '@components/Button'
import ColorPicker from '@components/ColorPicker'
import FormWrapper from '@components/FormWrapper'
import Input from '@components/Input'
import {
  faPaintBrush,
  faPlus,
  faTrash,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { postData } from '@helpers/CRUD'
import compareObjects from '@helpers/compareObjects'
import { PASTEL_COLORS } from '@helpers/constants'
import loggedUserAtom from '@state/atoms/loggedUserAtom'
import siteSettingsAtom from '@state/atoms/siteSettingsAtom'
import { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'

function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min)
}

const eventsTagsFunc = () => {
  const EventsTagsModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
  }) => {
    const loggedUser = useRecoilValue(loggedUserAtom)
    const [siteSettings, setSiteSettings] = useRecoilState(siteSettingsAtom)
    // const setEventsTags = useRecoilValue(itemsFuncAtom).eventsTags.set
    const [tags, setTags] = useState(siteSettings.eventsTags ?? [])

    const onAdd = () => {
      const color = PASTEL_COLORS[tags.length % PASTEL_COLORS.length]
      setTags((state) => [...state, { text: '', color }])
    }

    const onRandomColor = (index) =>
      setTags((state) => {
        const color =
          PASTEL_COLORS[randomIntFromInterval(0, PASTEL_COLORS.length - 1)]
        const oldState = [...state]
        oldState[index] = { ...oldState[index], color }
        return oldState
      })

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

    const onDeleteTag = (index) =>
      setTags((state) => state.filter((tag, i) => i !== index))

    const onClickConfirm = async () => {
      closeModal()
      const filteredTags = tags.filter((tag) => tag.text)
      const modifedTags = filteredTags.map((tag) => ({
        ...tag,
        text: tag.text.toLowerCase(),
      }))
      await postData(
        `/api/site`,
        {
          eventsTags: modifedTags,
        },
        (data) => {
          setSiteSettings(data)
        },
        null,
        false,
        loggedUser._id
      )
    }

    useEffect(() => {
      const isTagsChanged = !compareObjects(siteSettings.eventsTags ?? [], tags)
      setDisableConfirm(!isTagsChanged)
      setOnConfirmFunc(isTagsChanged ? onClickConfirm : undefined)
    }, [tags])

    return (
      <FormWrapper className="">
        {tags.map(({ text, color }, index) => (
          <div key={'tag' + index} className="flex -mt-2 gap-x-2">
            <Input
              label="Тэг"
              onChange={(value) => {
                onEditText(index, value)
              }}
              value={text}
              inputClassName="uppercase"
            />
            <ColorPicker
              label="Цвет"
              value={color}
              onChange={(color) => onEditColor(index, color)}
            />
            <div
              onClick={() => onRandomColor(index)}
              className="mt-3 flex items-center justify-center p-0.5 cursor-pointer group"
            >
              <FontAwesomeIcon
                icon={faPaintBrush}
                className="w-4 h-4 duration-300 text-general group-hover:scale-125"
              />
            </div>
            <div
              onClick={() => onDeleteTag(index)}
              className="mt-3 flex items-center justify-center p-0.5 cursor-pointer group"
            >
              <FontAwesomeIcon
                icon={faTrash}
                className="w-4 h-4 duration-300 text-danger group-hover:scale-125"
              />
            </div>
          </div>
        ))}
        <Button name="Добавить" thin onClick={onAdd} icon={faPlus} />
      </FormWrapper>
    )
  }

  return {
    title: `Тэги мероприятий`,
    declineButtonName: 'Закрыть',
    // closeButtonShow: true,
    confirmButtonName: 'Применить',
    // showConfirm: true,
    Children: EventsTagsModal,
  }
}

export default eventsTagsFunc
