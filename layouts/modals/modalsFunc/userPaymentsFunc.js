import React from 'react'
import { useRecoilValue } from 'recoil'

import FormWrapper from '@components/FormWrapper'
import { SelectPaymentList } from '@components/SelectItemList'
import UserNameById from '@components/UserNameById'
import paymentsByUserIdSelector from '@state/selectors/paymentsByUserIdSelector'

const userPaymentsFunc = (userId, clone = false) => {
  const UserPaymentsModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
  }) => {
    const userPayments = useRecoilValue(paymentsByUserIdSelector(userId))

    return (
      <FormWrapper flex className="flex flex-col gap-y-2">
        <div className="flex justify-center text-lg">
          <UserNameById userId={userId} />
        </div>
        {userPayments.length > 0 && (
          <div className="">
            <SelectPaymentList
              paymentsId={userPayments.map((payment) => payment._id)}
              readOnly
            />
          </div>
        )}
        {userPayments.length === 0 && (
          <div className="text-center">
            Пользователь не произвел ни одной транзакции
          </div>
        )}
      </FormWrapper>
    )
  }

  return {
    title: `Транзакции пользователя`,
    declineButtonName: 'Закрыть',
    closeButtonShow: true,
    Children: UserPaymentsModal,
  }
}

export default userPaymentsFunc
