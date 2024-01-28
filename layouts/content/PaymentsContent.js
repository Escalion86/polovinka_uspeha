import ContentHeader from '@components/ContentHeader'
import PaymentsFilter from '@components/Filter/PaymentsFilter'
import AddButton from '@components/IconToggleButtons/AddButton'
import SortingButtonMenu from '@components/SortingButtonMenu'
import { getNounPayments } from '@helpers/getNoun'
import paymentSectorFunc from '@helpers/paymentSector'
import sortFuncGenerator from '@helpers/sortFuncGenerator'
import PaymentsList from '@layouts/lists/PaymentsList'
import { modalsFuncAtom } from '@state/atoms'
import paymentsAtom from '@state/atoms/paymentsAtom'
import loggedUserActiveRoleSelector from '@state/selectors/loggedUserActiveRoleSelector'
import { useMemo, useState } from 'react'
import { useRecoilValue } from 'recoil'

const PaymentsContent = () => {
  const modalsFunc = useRecoilValue(modalsFuncAtom)
  const payments = useRecoilValue(paymentsAtom)
  const loggedUserActiveRole = useRecoilValue(loggedUserActiveRoleSelector)
  const addButton = loggedUserActiveRole?.payments?.add

  const [filter, setFilter] = useState({
    payType: {
      card: true,
      cash: true,
      remittance: true,
      coupon: true,
    },
    // payDirection: {
    //   fromUser: true,
    //   toUser: true,
    //   toEvent: true,
    //   fromEvent: true,
    // },
    sector: {
      event: true,
      service: true,
      product: true,
      internal: true,
    },
    linking: {
      linked: true,
      unlinked: true,
    },
  })

  const [sort, setSort] = useState({ payAt: 'asc' })
  const sortFunc = useMemo(() => sortFuncGenerator(sort), [sort])

  // const visiblePaymentsIds = useMemo(
  //   () =>
  //     payments
  //       .filter(
  //         (payment) =>
  //           filter.payType[payment.payType]
  //       )
  //       .map((payment) => payment._id),
  //   [payments, filter]
  // )

  const visiblePayments = useMemo(
    () =>
      payments.filter(
        (payment) =>
          filter.payType[payment.payType] &&
          filter.sector[paymentSectorFunc(payment)] &&
          (((!payment.sector || payment.sector === 'event') &&
            !payment.eventId) ||
          (payment.sector === 'service' && !payment.serviceId) ||
          (payment.sector === 'product' && !payment.productId)
            ? filter.linking.unlinked
            : filter.linking.linked)
        // &&
        // filter.payDirection[payment.payDirection]
      ),
    [payments, filter]
  )

  return (
    <>
      <ContentHeader>
        <PaymentsFilter value={filter} onChange={setFilter} />
        <div className="flex items-center justify-end flex-1 flex-nowrap gap-x-2">
          <div className="text-lg font-bold whitespace-nowrap">
            {getNounPayments(visiblePayments.length)}
          </div>
          <SortingButtonMenu
            sort={sort}
            onChange={setSort}
            sortKeys={['payAt']}
          />
          {addButton && <AddButton onClick={() => modalsFunc.payment.edit()} />}
        </div>
      </ContentHeader>
      <PaymentsList payments={[...visiblePayments].sort(sortFunc)} />
    </>
  )
}

export default PaymentsContent
