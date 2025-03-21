import Input from '@components/Input'
import Note from '@components/Note'
import itemsFuncAtom from '@state/itemsFuncAtom'
import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'
import userSelector from '@state/selectors/userSelector'
import { useEffect, useState } from 'react'
import { useAtom, useAtomValue } from 'jotai'

const userPersonalStatusEditFunc = (userId) => {
  const UserPersonalStatusEditModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
    setTopLeftComponent,
  }) => {
    const [loggedUserActive, setLoggedUserActive] =
      useAtom(loggedUserActiveAtom)
    const user = useAtomValue(userSelector(userId))
    const setUser = useAtomValue(itemsFuncAtom).user.set

    const [personalStatus, setPersonalStatus] = useState(user?.personalStatus)

    if (!user || !userId)
      return (
        <div className="flex justify-center w-full text-lg ">
          ОШИБКА! Пользователь не найден!
        </div>
      )

    const onClickConfirm = async () => {
      closeModal()
      const result = await setUser({
        _id: user?._id,
        personalStatus,
      })

      if (user?._id && loggedUserActive?._id === result?._id) {
        setLoggedUserActive(result)
      }
    }

    useEffect(() => {
      const isFormChanged = user?.personalStatus !== personalStatus
      setOnConfirmFunc(isFormChanged ? onClickConfirm : undefined)
    }, [personalStatus])

    return (
      <div>
        <Note>
          <span>
            Данный статус аналогичен статусу ВКонтакте, Однокласники и т.п.
            <br />
            То что Вы здесь укажете, будет видно всем пользователям, кто увидит
            вашу анкету.{' '}
          </span>
        </Note>
        <Input
          label="Персональный статус"
          value={personalStatus}
          onChange={setPersonalStatus}
          maxLength={140}
        />
      </div>
    )
  }

  return {
    title: 'Редактирование персонального статуса',
    confirmButtonName: 'Применить',
    Children: UserPersonalStatusEditModal,
  }
}

export default userPersonalStatusEditFunc
