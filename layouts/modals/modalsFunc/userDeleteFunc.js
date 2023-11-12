import FormWrapper from '@components/FormWrapper'
import itemsFuncAtom from '@state/atoms/itemsFuncAtom'
import isUserHaveActionsSelector from '@state/selectors/isUserHaveActionsSelector'
import { useEffect } from 'react'
import { useRecoilValue } from 'recoil'

const userDeleteFunc = (userId) => {
  const UserDeleteModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
  }) => {
    const itemsFunc = useRecoilValue(itemsFuncAtom)
    const isUserHaveActions = useRecoilValue(isUserHaveActionsSelector(userId))

    const onClickConfirm = async () => {
      closeModal()
      itemsFunc.user.delete(userId)
    }

    useEffect(() => {
      if (!isUserHaveActions) setOnConfirmFunc(onClickConfirm)
      // setOnConfirmFunc(onClickConfirm)
      // setOnShowOnCloseConfirmDialog(isFormChanged)
      setDisableConfirm(isUserHaveActions)
    }, [])

    return (
      <FormWrapper flex className="flex-col">
        <div className="px-2 tablet:px-3">
          {isUserHaveActions
            ? 'Удаление пользователя невозможно, так как он производил действия на сайте'
            : 'Вы уверены, что хотите удалить пользователя?'}
        </div>

        {/* <UserName user={user} className="text-lg font-bold" /> */}
      </FormWrapper>
    )
  }

  return {
    title: 'Удаление пользователя',
    declineButtonName: 'Закрыть',
    confirmButtonName: 'Удалить',
    // onConfirm: true,
    Children: UserDeleteModal,
  }
}

export default userDeleteFunc
