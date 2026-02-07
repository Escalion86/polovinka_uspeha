import FormWrapper from '@components/FormWrapper'
import Input from '@components/Input'
import Textarea from '@components/Textarea'
import { useState } from 'react'

const spaceStatsFunc = (stat = null, onConfirm) => {
  const isEdit = Boolean(stat)

  const SpaceStatsModal = ({ closeModal }) => {
    const [number, setNumber] = useState(stat?.number ?? '')
    const [text, setText] = useState(stat?.text ?? '')
    const [error, setError] = useState('')

    const handleConfirm = () => {
      const nextNumber = String(number || '').trim()
      const nextText = String(text || '').trim()
      if (!nextNumber || !nextText) {
        setError('Заполните значение и описание')
        return
      }
      setError('')
      onConfirm &&
        onConfirm({
          ...(stat ?? {}),
          number: nextNumber,
          text: nextText,
        })
      closeModal && closeModal()
    }

    return (
      <FormWrapper className="flex flex-col gap-y-3">
        <Input
          label="Значение"
          value={number}
          onChange={setNumber}
          copyPasteButtons
        />
        <Textarea
          label="Описание"
          value={text}
          onChange={setText}
          rows={4}
        />
        {error && <div className="text-sm text-danger">{error}</div>}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleConfirm}
            className="rounded-md bg-general px-4 py-2 text-sm font-semibold text-white"
          >
            {isEdit ? 'Сохранить' : 'Создать'}
          </button>
        </div>
      </FormWrapper>
    )
  }

  return {
    title: isEdit ? 'Редактирование карточки' : 'Новая карточка',
    confirmButtonShow: false,
    declineButtonShow: false,
    closeButtonShow: true,
    crossShow: true,
    Children: SpaceStatsModal,
  }
}

export default spaceStatsFunc
