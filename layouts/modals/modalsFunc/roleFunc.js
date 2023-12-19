import Input from '@components/Input'
import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'

const roleFunc = (role, onConfirm) => {
  const RoleFuncModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
    setTopLeftComponent,
  }) => {
    const [text, setText] = useState(role ? role?.name ?? '' : '')

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
    title: `${role ? 'Редактирование' : 'Добавление'} роли`,
    confirmButtonName: role ? 'Применить' : 'Добавить',
    Children: RoleFuncModal,
  }
}

export default roleFunc
