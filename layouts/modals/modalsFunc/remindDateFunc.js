import DatePicker from '@components/DatePicker'
import FormWrapper from '@components/FormWrapper'
import Input from '@components/Input'
import { DEFAULT_REMIND_DATE } from '@helpers/constants'
import { useEffect, useMemo, useState } from 'react'

const remindDateFunc = (remindDate, onAdd) => {
  const RemindDateModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
    setOnlyCloseButtonShow,
    setTopLeftComponent,
  }) => {
    const [name, setName] = useState(
      remindDate?.name ?? DEFAULT_REMIND_DATE.name
    )
    const defaultDate = useMemo(
      () => remindDate?.date ?? Date.now() - (Date.now() % 3600000),
      []
    )
    const [date, setDate] = useState(defaultDate)
    const [comment, setComment] = useState(
      remindDate?.comment ?? DEFAULT_REMIND_DATE.comment
    )

    const onClickConfirm = async () => {
      closeModal()
      onAdd({ name, date, comment })
    }

    useEffect(() => {
      const isFormChanged =
        (remindDate?.name ?? DEFAULT_REMIND_DATE.name) !== name ||
        defaultDate !== date ||
        (remindDate?.comment ?? DEFAULT_REMIND_DATE.comment) !== comment

      setOnConfirmFunc(onClickConfirm)
      setOnShowOnCloseConfirmDialog(isFormChanged)
      setDisableConfirm(!isFormChanged)
      // setOnlyCloseButtonShow(isEventClosed || !isFormChanged)
    }, [name, date, comment])

    return (
      <FormWrapper>
        <Input
          label="Название события"
          type="text"
          value={name}
          onChange={setName}
        />
        <DatePicker
          value={date}
          onChange={setDate}
          label="Дата события"
          required
          className="w-52"
        />
        <Input
          label="Комментарий"
          type="text"
          value={comment}
          onChange={setComment}
        />
      </FormWrapper>
    )
  }

  return {
    title: `${remindDate ? 'Редактирование' : 'Создание'} даты события ПУ`,
    confirmButtonName: remindDate ? 'Применить' : 'Создать',
    Children: RemindDateModal,
  }
}

export default remindDateFunc
