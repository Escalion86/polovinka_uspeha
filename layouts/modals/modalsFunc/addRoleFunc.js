import Input from '@components/Input'
import { useEffect, useState } from 'react'

const addRoleFunc = (onConfirm) => {
  const AddRoleFuncModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
    setTopLeftComponent,
  }) => {
    const [text, setText] = useState('')

    const onClickConfirm = async () => {
      closeModal()
      onConfirm(text)
    }

    useEffect(() => {
      setOnConfirmFunc(onClickConfirm)
      setDisableConfirm(!text)
    }, [text])

    return (
      <div className="flex flex-col gap-y-2">
        <Input label="Название роли" value={text} onChange={setText} />
      </div>
    )
  }

  return {
    title: `Добавление роли`,
    confirmButtonName: 'Добавить',
    Children: AddRoleFuncModal,
  }
}

export default addRoleFunc
