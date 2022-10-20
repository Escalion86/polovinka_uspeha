import ContentHeader from '@components/ContentHeader'
import PaymentsFilter from '@components/Filter/PaymentsFilter'
// import Fab from '@components/Fab'
import AddButton from '@components/IconToggleButtons/AddButton'
import { getNounPayments } from '@helpers/getNoun'
import PaymentCard from '@layouts/cards/PaymentCard'
import CardListWrapper from '@layouts/wrappers/CardListWrapper'

import { modalsFuncAtom } from '@state/atoms'
import paymentsAtom from '@state/atoms/paymentsAtom'
import isLoggedUserAdminSelector from '@state/selectors/isLoggedUserAdminSelector'
import { useMemo, useState } from 'react'
import { useRecoilValue } from 'recoil'
import sortFunctions from '@helpers/sortFunctions'
import SortingButtonMenu from '@components/SortingButtonMenu'

const PaymentsContent = () => {
  const modalsFunc = useRecoilValue(modalsFuncAtom)
  const payments = useRecoilValue(paymentsAtom)
  const isLoggedUserAdmin = useRecoilValue(isLoggedUserAdminSelector)

  const [sort, setSort] = useState({ payAt: 'asc' })
  const [filter, setFilter] = useState({
    payType: {
      card: true,
      cash: true,
      remittance: true,
    },
  })

  const sortKey = Object.keys(sort)[0]
  const sortValue = sort[sortKey]
  const sortFunc = sortFunctions[sortKey]
    ? sortFunctions[sortKey][sortValue]
    : undefined

    const visiblePaymentsIds = useMemo(
      () =>
        payments
          .filter(
            (payment) =>
              filter.payType[payment.payType]
          )
          .map((payment) => payment._id),
      [payments, filter]
    )

  return (
    <>
      <ContentHeader>
        <PaymentsFilter value={filter} onChange={setFilter} />
        <div className="flex items-center justify-end flex-1 flex-nowrap gap-x-2">
          <div className="text-lg font-bold whitespace-nowrap">
            {getNounPayments(payments.length)}
          </div>
          <SortingButtonMenu
            sort={sort}
            onChange={setSort}
            sortKeys={['payAt']}
          />
          {isLoggedUserAdmin && (
            <AddButton onClick={() => modalsFunc.payment.edit()} />
          )}
        </div>
      </ContentHeader>
      <CardListWrapper>
        {payments?.length > 0 ? (
          [...payments]
            .sort(sortFunc)
            .map((payment) => (
              <PaymentCard key={payment._id} paymentId={payment._id} hidden={!visiblePaymentsIds.includes(payment._id)} />
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
