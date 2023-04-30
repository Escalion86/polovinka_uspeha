// import { getSession } from 'next-auth/react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

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
import paymentsAddSelector from '@state/selectors/paymentsAddSelector'
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
import historiesAtom from '@state/atoms/historiesAtom'
import questionnairesUsersAtom from '@state/atoms/questionnairesUsersAtom'
import questionnairesAtom from '@state/atoms/questionnairesAtom'
import questionnaireEditSelector from '@state/selectors/questionnaireEditSelector'
import questionnaireDeleteSelector from '@state/selectors/questionnaireDeleteSelector'
import questionnaireUsersEditSelector from '@state/selectors/questionnaireUsersEditSelector'
import questionnaireUsersDeleteSelector from '@state/selectors/questionnaireUsersDeleteSelector'
import windowDimensionsAtom from '@state/atoms/windowDimensionsAtom'
import servicesAtom from '@state/atoms/servicesAtom'
import serviceEditSelector from '@state/selectors/serviceEditSelector'
import serviceDeleteSelector from '@state/selectors/serviceDeleteSelector'
import { useMemo } from 'react'
import addModalSelector from '@state/selectors/addModalSelector'
import addErrorModalSelector from '@state/selectors/addErrorModalSelector'
// import snackbarAtom from '@state/atoms/snackbarAtom'
import { useRouter } from 'next/router'
import modalsFuncGenerator from '@layouts/modals/modalsFuncGenerator'
import servicesUsersAtom from '@state/atoms/servicesUsersAtom'
import servicesUsersEditSelector from '@state/selectors/servicesUsersEditSelector'
import servicesUsersDeleteSelector from '@state/selectors/servicesUsersDeleteSelector'
import isBrowserNeedToBeUpdate from '@helpers/browserCheck'
import { postData } from '@helpers/CRUD'
import browserVer from '@helpers/browserVer'
import modeAtom from '@state/atoms/modeAtom'
import TopInfo from './TopInfo'

const StateLoader = (props) => {
  if (props.error && Object.keys(props.error).length > 0)
    console.log('props.error', props.error)

  const snackbar = useSnackbar()

  const router = useRouter()

  const [modalsFunc, setModalsFunc] = useRecoilState(modalsFuncAtom)

  const [isSiteLoading, setIsSiteLoading] = useRecoilState(isSiteLoadingAtom)

  const [mode, setMode] = useRecoilState(modeAtom)

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
  const setHistoriesState = useSetRecoilState(historiesAtom)
  const setQuestionnairesState = useSetRecoilState(questionnairesAtom)
  const setQuestionnairesUsersState = useSetRecoilState(questionnairesUsersAtom)
  const setServicesState = useSetRecoilState(servicesAtom)
  const setServicesUsersState = useSetRecoilState(servicesUsersAtom)

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
  const addPayments = useSetRecoilState(paymentsAddSelector)
  const deletePayment = useSetRecoilState(paymentsDeleteSelector)
  const setEventsUser = useSetRecoilState(eventsUsersEditSelector)
  const deleteEventsUser = useSetRecoilState(eventsUsersDeleteSelector)
  const deleteEventsUsersByEventId = useSetRecoilState(
    eventsUsersDeleteByEventIdSelector
  )
  const setQuestionnaire = useSetRecoilState(questionnaireEditSelector)
  const deleteQuestionnaire = useSetRecoilState(questionnaireDeleteSelector)
  const setQuestionnaireUsers = useSetRecoilState(
    questionnaireUsersEditSelector
  )
  const deleteQuestionnaireUsers = useSetRecoilState(
    questionnaireUsersDeleteSelector
  )
  const setService = useSetRecoilState(serviceEditSelector)
  const deleteService = useSetRecoilState(serviceDeleteSelector)
  const setServicesUser = useSetRecoilState(servicesUsersEditSelector)
  const deleteServicesUser = useSetRecoilState(servicesUsersDeleteSelector)

  const setItemsFunc = useSetRecoilState(itemsFuncAtom)
  const setLoadingCard = useSetRecoilState(setLoadingSelector)
  const setNotLoadingCard = useSetRecoilState(setNotLoadingSelector)
  const setErrorCard = useSetRecoilState(setErrorSelector)
  const setNotErrorCard = useSetRecoilState(setNotErrorSelector)
  const setWindowDimensions = useSetRecoilState(windowDimensionsAtom)

  const addModal = useSetRecoilState(addModalSelector)
  const addErrorModal = useSetRecoilState(addErrorModalSelector)

  const itemsFunc = useMemo(
    () =>
      itemsFuncGenerator({
        setLoading: setIsSiteLoading,
        addErrorModal,
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
        addPayments,
        setPayment,
        deletePayment,
        setEventsUser,
        deleteEventsUser,
        deleteEventsUsersByEventId,
        setSiteSettings: setSiteSettingsState,
        setQuestionnaire,
        deleteQuestionnaire,
        setQuestionnaireUsers,
        deleteQuestionnaireUsers,
        setService,
        deleteService,
        setServicesUser,
        deleteServicesUser,
        snackbar,
        loggedUser,
      }),
    []
  )

  useEffect(() => {
    setModalsFunc(modalsFuncGenerator(addModal, itemsFunc, router, loggedUser))
  }, [loggedUser])

  useEffect(() => {
    function handleResize() {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    setItemsFunc(itemsFunc)

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
    setHistoriesState(props.histories)
    setQuestionnairesState(props.questionnaires)
    setQuestionnairesUsersState(props.questionnairesUsers)
    setServicesState(props.services)
    setServicesUsersState(props.servicesUsers)
    setMode(props.mode ?? 'production')
    // setSnackbar(snackbar)
    setIsSiteLoading(false)
  }, [])

  useEffect(() => {
    if (props.isCabinet && !isSiteLoading) {
      const url = isBrowserNeedToBeUpdate()
      if (url) modalsFunc.browserUpdate(url)
    }
  }, [props.isCabinet, isSiteLoading])

  useEffect(() => {
    if (loggedUser) {
      postData(
        `/api/loginhistory`,
        {
          userId: loggedUser._id,
          browser: browserVer(true),
        },
        null,
        null,
        false,
        null,
        true
      )
    }
  }, [loggedUser])

  return (
    <div className={cn('relative', props.className)}>
      {isSiteLoading ? (
        <div className="w-full h-screen">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <div className="relative w-full bg-white">
          {mode === 'development' && <TopInfo />}
          <DeviceCheck right />
          {props.children}
        </div>
      )}
      <ModalsPortal />
    </div>
  )
}

export default StateLoader
