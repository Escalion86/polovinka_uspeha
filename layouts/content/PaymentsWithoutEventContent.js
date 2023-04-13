import ContentHeader from '@components/ContentHeader'
import PaymentsFilter from '@components/Filter/PaymentsFilter'
import AddButton from '@components/IconToggleButtons/AddButton'
import { getNounPayments } from '@helpers/getNoun'

import { modalsFuncAtom } from '@state/atoms'
import isLoggedUserAdminSelector from '@state/selectors/isLoggedUserAdminSelector'
import { useMemo, useState } from 'react'
import { useRecoilValue } from 'recoil'
import sortFunctions from '@helpers/sortFunctions'
import SortingButtonMenu from '@components/SortingButtonMenu'
import PaymentsList from '@layouts/lists/PaymentsList'
import paymentsOfEventWithoutEventIdSelector from '@state/selectors/paymentsOfEventWithoutEventIdSelector'
import paymentSectorFunc from '@helpers/paymentSector'

const PaymentsWithoutEventContent = () => {
  // const modalsFunc = useRecoilValue(modalsFuncAtom)
  const paymentsWithoutEvent = useRecoilValue(
    paymentsOfEventWithoutEventIdSelector
  )
  // const isLoggedUserAdmin = useRecoilValue(isLoggedUserAdminSelector)

  const [sort, setSort] = useState({ payAt: 'asc' })
  const [filter, setFilter] = useState({
    payType: {
      card: true,
      cash: true,
      remittance: true,
      coupon: true,
    },
    // sector: {
    //   event: true,
    //   service: true,
    //   product: true,
    //   internal: true,
    // },
    // payDirection: {
    //   fromUser: true,
    //   toUser: true,
    // },
  })

  const sortKey = Object.keys(sort)[0]
  const sortValue = sort[sortKey]
  const sortFunc = sortFunctions[sortKey]
    ? sortFunctions[sortKey][sortValue]
    : undefined

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
      paymentsWithoutEvent.filter(
        (payment) => filter.payType[payment.payType]
        //  &&
        // filter.sector[paymentSectorFunc(payment)]
        //  &&
        // filter.payDirection[payment.payDirection]
      ),
    [paymentsWithoutEvent, filter]
  )

  return (
    <>
      <ContentHeader>
        <PaymentsFilter
          value={filter}
          onChange={setFilter}
          payDirectionValues={['toUser', 'fromUser']}
        />
        <div className="flex items-center justify-end flex-1 flex-nowrap gap-x-2">
          <div className="text-lg font-bold whitespace-nowrap">
            {getNounPayments(visiblePayments.length)}
          </div>
          <SortingButtonMenu
            sort={sort}
            onChange={setSort}
            sortKeys={['payAt']}
          />
        </div>
      </ContentHeader>
      <PaymentsList payments={[...visiblePayments].sort(sortFunc)} />
    </>
  )
}

export default PaymentsWithoutEventContent
