import Input from '@components/Input'
import itemsFuncAtom from '@state/atoms/itemsFuncAtom'
import userSelector from '@state/selectors/userSelector'
import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'

const userSetPasswordFunc = (userId) => {
  const UserSetPasswordModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
    setTopLeftComponent,
  }) => {
    const user = useRecoilValue(userSelector(userId))
    const setUser = useRecoilValue(itemsFuncAtom).user.set

    const [password, setPassword] = useState('')
    const [password2, setPassword2] = useState('')
    const [error, setError] = useState()

    if (!user || !userId)
      return (
        <div className="flex justify-center w-full text-lg ">
          ОШИБКА! Пользователь не найден!
        </div>
      )

    const onClickConfirm = async () => {
      if (password !== password2) {
        setError('Пароли не совпадают')
      } else {
        closeModal()
        setUser({
          _id: user?._id,
          password,
        })
      }
    }

    useEffect(() => {
      setOnConfirmFunc(onClickConfirm)
      setDisableConfirm(!password)
    }, [password, password2])

    return (
      <div>
        <Input
          label="Новый пароль пользователя"
          type="password"
          value={password}
          onChange={(value) => {
            setError()
            setPassword(value)
          }}
          autoComplete="one-time-code"
        />
        <Input
          label="Повтор нового пароля"
          type="password"
          value={password2}
          onChange={(value) => {
            setError()
            setPassword2(value)
          }}
          autoComplete="one-time-code"
        />
        <div className="flex flex-col col-span-2 text-red-500">{error}</div>
      </div>
    )
  }

  return {
    title: `Изменение пароля пользователя`,
    confirmButtonName: 'Применить',
    Children: UserSetPasswordModal,
    // TopLeftComponent: () => (
    //   <CardButtons
    //     item={{ _id: eventId }}
    //     typeOfItem="event"
    //     forForm
    //     direction="right"
    //   />
    // ),
  }
}

export default userSetPasswordFunc
