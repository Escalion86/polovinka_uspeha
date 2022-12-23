import React, { useEffect } from 'react'

import { useRecoilValue } from 'recoil'
// import userSelector from '@state/selectors/userSelector'
// import { GENDERS } from '@helpers/constants'

import FormWrapper from '@components/FormWrapper'
// import ContactsIconsButtons from '@components/ContactsIconsButtons'
// import birthDateToAge from '@helpers/birthDateToAge'
// import UserName from '@components/UserName'
// import Tooltip from '@components/Tooltip'
// import Image from 'next/image'
// import isLoggedUserAdminSelector from '@state/selectors/isLoggedUserAdminSelector'
// import ImageGallery from '@components/ImageGallery'
// import CardButtons from '@components/CardButtons'
// import eventsUsersByUserIdSelector from '@state/selectors/eventsUsersByUserIdSelector'
// import eventsUsersVisitedByUserIdSelector from '@state/selectors/eventsUsersVisitedByUserIdSelector'
// import { SelectEventList } from '@components/SelectItemList'
// import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons'
// import ValueItem from '@components/ValuePicker/ValueItem'
// import { modalsFuncAtom } from '@state/atoms'
// import ZodiacIcon from '@components/ZodiacIcon'
// import formatDate from '@helpers/formatDate'
// import TextLine from '@components/TextLine'
// import isLoggedUserDevSelector from '@state/selectors/isLoggedUserDevSelector'
// import isLoggedUserMemberSelector from '@state/selectors/isLoggedUserMemberSelector'
// import eventsUsersSignedUpByUserIdSelector from '@state/selectors/eventsUsersSignedUpByUserIdSelector'
// import eventsUsersSignedUpWithEventStatusByUserIdCountSelector from '@state/selectors/eventsUsersSignedUpWithEventStatusByUserIdCountSelector'
import isUserHaveActionsSelector from '@state/selectors/isUserHaveActionsSelector'
import itemsFuncAtom from '@state/atoms/itemsFuncAtom'

const userDeleteFunc = (userId) => {
  const UserDeleteModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
  }) => {
    // const modalsFunc = useRecoilValue(modalsFuncAtom)
    const itemsFunc = useRecoilValue(itemsFuncAtom)
    // const isLoggedUserAdmin = useRecoilValue(isLoggedUserAdminSelector)
    // const isLoggedUserDev = useRecoilValue(isLoggedUserDevSelector)
    // const isLoggedUserMember = useRecoilValue(isLoggedUserMemberSelector)
    const isUserHaveActions = useRecoilValue(isUserHaveActionsSelector(userId))

    // const user = useRecoilValue(userSelector(userId))

    // const eventsUsersSignedUpCount = useRecoilValue(
    //   eventsUsersSignedUpWithEventStatusByUserIdCountSelector(userId)
    // )

    // console.log('isUserHaveActions', isUserHaveActions)

    const onClickConfirm = async () => itemsFunc.user.delete(userId)

    useEffect(() => {
      if (isUserHaveActions) setOnConfirmFunc(onClickConfirm)
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
    showConfirm: true,
    Children: UserDeleteModal,
  }
}

export default userDeleteFunc
