import CheckBox from '@components/CheckBox'
import BackgroundPicker from '@components/BackgroundPicker'
import EditableTextarea from '@components/EditableTextarea'
import FormWrapper from '@components/FormWrapper'
import Input from '@components/Input'
import { useEffect, useState } from 'react'

const DEFAULT_BG_BY_TONE = {
  white: { mode: 'solid', color1: '#ffffff', color2: '#ffffff' },
  burgundy: { mode: 'gradient', color1: '#4b101b', color2: '#7b2a35' },
  blue: { mode: 'gradient', color1: '#3aa3e0', color2: '#6bc2f0' },
}

const aboutSpaceCardFunc = (card = null, onConfirm) => {
  const isEdit = Boolean(card)
  const toneFallback = DEFAULT_BG_BY_TONE[card?.tone] ?? DEFAULT_BG_BY_TONE.white

  const AboutSpaceCardModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
  }) => {
    const [title, setTitle] = useState(card?.title ?? '')
    const [text, setText] = useState(card?.text ?? '')
    const [wide, setWide] = useState(Boolean(card?.wide))
    const [bgMode, setBgMode] = useState(
      card?.bgMode ?? toneFallback.mode ?? 'solid'
    )
    const [bgColor1, setBgColor1] = useState(
      card?.bgColor1 ?? toneFallback.color1 ?? '#ffffff'
    )
    const [bgColor2, setBgColor2] = useState(
      card?.bgColor2 ?? toneFallback.color2 ?? '#ffffff'
    )
    const [error, setError] = useState('')

    const handleConfirm = () => {
      const nextText = String(text || '').trim()
      if (!nextText) {
        setError('Введите текст карточки')
        return
      }
      setError('')
      onConfirm &&
        onConfirm({
          ...(card ?? {}),
          title: String(title || '').trim() || '',
          text: nextText,
          wide,
          bgMode,
          bgColor1,
          bgColor2,
        })
      closeModal && closeModal()
    }

    const isFormChanged =
      (card?.title ?? '') !== title ||
      (card?.text ?? '') !== text ||
      Boolean(card?.wide) !== wide ||
      (card?.bgMode ?? toneFallback.mode ?? 'solid') !== bgMode ||
      (card?.bgColor1 ?? toneFallback.color1 ?? '#ffffff') !== bgColor1 ||
      (card?.bgColor2 ?? toneFallback.color2 ?? '#ffffff') !== bgColor2

    const isValid = String(text || '').trim().length > 0

    useEffect(() => {
      setOnConfirmFunc && setOnConfirmFunc(handleConfirm)
      setOnShowOnCloseConfirmDialog &&
        setOnShowOnCloseConfirmDialog(isFormChanged)
      setDisableConfirm && setDisableConfirm(!isFormChanged || !isValid)
    }, [title, text, wide, bgMode, bgColor1, bgColor2])

    return (
      <FormWrapper className="flex flex-col gap-y-3">
        <Input
          label="Заголовок (необязательно)"
          value={title}
          onChange={setTitle}
          copyPasteButtons
        />
        <EditableTextarea label="Текст" html={text} onChange={setText} />
        <BackgroundPicker
          mode={bgMode}
          onModeChange={setBgMode}
          color1={bgColor1}
          color2={bgColor2}
          onColor1Change={setBgColor1}
          onColor2Change={setBgColor2}
        />
        <CheckBox
          checked={wide}
          onChange={() => setWide((prev) => !prev)}
          label="Широкая карточка"
          labelPos="right"
        />
        {error && <div className="text-sm text-danger">{error}</div>}
      </FormWrapper>
    )
  }

  return {
    title: isEdit ? 'Редактирование карточки' : 'Новая карточка',
    confirmButtonName: 'Применить',
    declineButtonShow: true,
    declineButtonName: 'Закрыть',
    closeButtonShow: true,
    crossShow: true,
    Children: AboutSpaceCardModal,
  }
}

export default aboutSpaceCardFunc
