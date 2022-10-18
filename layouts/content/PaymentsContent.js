import ContentHeader from '@components/ContentHeader'
// import Fab from '@components/Fab'
import AddButton from '@components/IconToggleButtons/AddButton'
import { getNounPayments } from '@helpers/getNoun'
import PaymentCard from '@layouts/cards/PaymentCard'
import CardListWrapper from '@layouts/wrappers/CardListWrapper'

import { modalsFuncAtom } from '@state/atoms'
import paymentsAtom from '@state/atoms/paymentsAtom'
import isLoggedUserAdminSelector from '@state/selectors/isLoggedUserAdminSelector'
import { useRecoilValue } from 'recoil'

const PaymentsContent = () => {
  const modalsFunc = useRecoilValue(modalsFuncAtom)
  const payments = useRecoilValue(paymentsAtom)
  const isLoggedUserAdmin = useRecoilValue(isLoggedUserAdminSelector)

  return (
    <>
      <ContentHeader>
        <div className="flex items-center justify-end flex-1 flex-nowrap gap-x-2">
          <div className="text-lg font-bold whitespace-nowrap">
            {getNounPayments(payments.length)}
          </div>
          {isLoggedUserAdmin && (
            <AddButton onClick={() => modalsFunc.payment.edit()} />
          )}
        </div>
      </ContentHeader>
      <CardListWrapper>
        {payments?.length > 0 ? (
          payments.map((payment) => (
            <PaymentCard key={payment._id} paymentId={payment._id} />
          ))
        ) : (
          <div className="flex justify-center p-2">Нет транзакций</div>
        )}
        {/* <Fab onClick={() => modalsFunc.payment.edit()} show /> */}
      </CardListWrapper>
    </>
  )
}

export default PaymentsContent
