'use client'

import ContentHeader from '@components/ContentHeader'
import PaymentsFilter from '@components/Filter/PaymentsFilter'
import SortingButtonMenu from '@components/SortingButtonMenu'
import { getNounPayments } from '@helpers/getNoun'
import sortFunctions from '@helpers/sortFunctions'
import PaymentsList from '@layouts/lists/PaymentsList'
import paymentsWithoutUserWritingToEventSelector from '@state/selectors/paymentsWithoutUserWritingToEventSelector'
import { useMemo, useState } from 'react'
import { useAtomValue } from 'jotai'

const PaymentsNotParticipantsEventContent = () => {
  // const modalsFunc = useAtomValue(modalsFuncAtom)
  const paymentsWithoutUserWritingToEvent = useAtomValue(
    paymentsWithoutUserWritingToEventSelector
  )

  const [sort, setSort] = useState({ payAt: 'asc' })
  const [filter, setFilter] = useState({
    payType: {
      card: true,
      cash: true,
      remittance: true,
      coupon: true,
    },
    payDirection: {
      fromUser: true,
      toUser: true,
    },
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
      paymentsWithoutUserWritingToEvent.filter(
        (payment) =>
          filter.payType[payment.payType] &&
          filter.payDirection[payment.payDirection]
      ),
    [paymentsWithoutUserWritingToEvent, filter]
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

export default PaymentsNotParticipantsEventContent
