// import { getSession } from 'next-auth/react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

// import fetchProps from '@server/fetchProps'

import { useEffect } from 'react'
import loggedUserAtom from '@state/atoms/loggedUserAtom'
import eventsAtom from '@state/atoms/eventsAtom'
import directionsAtom from '@state/atoms/directionsAtom'
import additionalBlocksAtom from '@state/atoms/additionalBlocksAtom'
import usersAtom from '@state/atoms/usersAtom'
import reviewsAtom from '@state/atoms/reviewsAtom'
import paymentsAtom from '@state/atoms/paymentsAtom'
import itemsFuncAtom from '@state/atoms/itemsFuncAtom'
import itemsFuncGenerator from '@state/itemsFuncGenerator'
import eventsUsersEditSelector from '@state/selectors/eventsUsersEditSelector'
import eventsUsersDeleteSelector from '@state/selectors/eventsUsersDeleteSelector'
import eventsUsersAtom from '@state/atoms/eventsUsersAtom'
import LoadingSpinner from '@components/LoadingSpinner'

import eventEditSelector from '@state/selectors/eventEditSelector'
import eventDeleteSelector from '@state/selectors/eventDeleteSelector'
import directionEditSelector from '@state/selectors/directionEditSelector'
import directionDeleteSelector from '@state/selectors/directionDeleteSelector'
import additionalBlockEditSelector from '@state/selectors/additionalBlockEditSelector'
import additionalBlockDeleteSelector from '@state/selectors/additionalBlockDeleteSelector'
import userEditSelector from '@state/selectors/userEditSelector'
import userDeleteSelector from '@state/selectors/userDeleteSelector'
import reviewEditSelector from '@state/selectors/reviewEditSelector'
import reviewDeleteSelector from '@state/selectors/reviewDeleteSelector'
import paymentEditSelector from '@state/selectors/paymentEditSelector'
import paymentsDeleteSelector from '@state/selectors/paymentsDeleteSelector'
import eventsUsersDeleteByEventIdSelector from '@state/selectors/eventsUsersDeleteByEventIdSelector'
import setLoadingSelector from '@state/selectors/setLoadingSelector'
import setNotLoadingSelector from '@state/selectors/setNotLoadingSelector'
import setErrorSelector from '@state/selectors/setErrorSelector'
import setNotErrorSelector from '@state/selectors/setNotErrorSelector'
import { modalsFuncAtom } from '@state/atoms'
import loggedUserActiveRoleAtom from '@state/atoms/loggedUserActiveRoleAtom'
import loggedUserActiveStatusAtom from '@state/atoms/loggedUserActiveStatusAtom'
import siteSettingsAtom from '@state/atoms/siteSettingsAtom'
import isSiteLoadingAtom from '@state/atoms/isSiteLoadingAtom'
import ModalsPortal from '@layouts/modals/ModalsPortal'
import DeviceCheck from './DeviceCheck'
import cn from 'classnames'
import useSnackbar from '@helpers/useSnackbar'

const StateLoader = (props) => {
  if (props.error && Object.keys(props.error).length > 0)
    console.log('props.error', props.error)

  const snackbar = useSnackbar()

  const [isSiteLoading, setIsSiteLoading] = useRecoilState(isSiteLoadingAtom)

  const modalsFunc = useRecoilValue(modalsFuncAtom)

  const [loggedUser, setLoggedUser] = useRecoilState(loggedUserAtom)
  const [loggedUserActiveRole, setLoggedUserActiveRole] = useRecoilState(
    loggedUserActiveRoleAtom
  )
  const [loggedUserActiveStatus, setLoggedUserActiveStatus] = useRecoilState(
    loggedUserActiveStatusAtom
  )

  const setEventsState = useSetRecoilState(eventsAtom)
  const setDirectionsState = useSetRecoilState(directionsAtom)
  const setAdditionalBlocksState = useSetRecoilState(additionalBlocksAtom)
  const setUsersState = useSetRecoilState(usersAtom)
  const setReviewsState = useSetRecoilState(reviewsAtom)
  const setPaymentsState = useSetRecoilState(paymentsAtom)
  const setEventsUsersState = useSetRecoilState(eventsUsersAtom)
  const setSiteSettingsState = useSetRecoilState(siteSettingsAtom)

  const setEvent = useSetRecoilState(eventEditSelector)
  const deleteEvent = useSetRecoilState(eventDeleteSelector)
  const setDirection = useSetRecoilState(directionEditSelector)
  const deleteDirection = useSetRecoilState(directionDeleteSelector)
  const setAdditionalBlock = useSetRecoilState(additionalBlockEditSelector)
  const deleteAdditionalBlock = useSetRecoilState(additionalBlockDeleteSelector)
  const setUser = useSetRecoilState(userEditSelector)
  const deleteUser = useSetRecoilState(userDeleteSelector)
  const setReview = useSetRecoilState(reviewEditSelector)
  const deleteReview = useSetRecoilState(reviewDeleteSelector)
  const setPayment = useSetRecoilState(paymentEditSelector)
  const deletePayment = useSetRecoilState(paymentsDeleteSelector)
  const setEventsUsers = useSetRecoilState(eventsUsersEditSelector)
  const deleteEventsUsers = useSetRecoilState(eventsUsersDeleteSelector)
  const deleteEventsUsersByEventId = useSetRecoilState(
    eventsUsersDeleteByEventIdSelector
  )

  const [itemsFunc, setItemsFunc] = useRecoilState(itemsFuncAtom)
  const setLoadingCard = useSetRecoilState(setLoadingSelector)
  const setNotLoadingCard = useSetRecoilState(setNotLoadingSelector)
  const setErrorCard = useSetRecoilState(setErrorSelector)
  const setNotErrorCard = useSetRecoilState(setNotErrorSelector)

  useEffect(() => {
    if (!loggedUserActiveRole || props.loggedUser?.role !== loggedUser?.role)
      setLoggedUserActiveRole(props.loggedUser?.role ?? 'client')
    if (!loggedUserActiveStatus || props.loggedUser?.role !== 'dev')
      setLoggedUserActiveStatus(props.loggedUser?.status ?? 'novice')
    setLoggedUser(props.loggedUser)
    setEventsState(props.events)
    setDirectionsState(props.directions)
    setAdditionalBlocksState(props.additionalBlocks)
    setUsersState(props.users)
    setReviewsState(props.reviews)
    setPaymentsState(props.payments)
    setEventsUsersState(props.eventsUsers)
    setSiteSettingsState(props.siteSettings)

    setIsSiteLoading(false)
  }, [])

  useEffect(() => {
    if (Object.keys(modalsFunc).length > 0 && !itemsFunc)
      setItemsFunc(
        itemsFuncGenerator({
          setLoading: setIsSiteLoading,
          modalsFunc,
          setLoadingCard,
          setNotLoadingCard,
          setErrorCard,
          setNotErrorCard,
          setEvent,
          deleteEvent,
          setDirection,
          deleteDirection,
          setAdditionalBlock,
          deleteAdditionalBlock,
          setUser,
          deleteUser,
          setReview,
          deleteReview,
          setPayment,
          deletePayment,
          setEventsUsers,
          deleteEventsUsers,
          deleteEventsUsersByEventId,
          setSiteSettings: setSiteSettingsState,
          snackbar,
        })
      )
  }, [modalsFunc])

  return (
    <div className={cn('relative', props.className)}>
      {isSiteLoading ? (
        <div className="w-full h-screen">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <div className="relative w-full bg-white">
          <DeviceCheck right />
          {props.children}
        </div>
      )}
      <ModalsPortal />
    </div>
  )
}

export default StateLoader
