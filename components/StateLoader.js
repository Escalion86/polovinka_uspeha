// import { getSession } from 'next-auth/react'
import { useRecoilState, useSetRecoilState } from 'recoil'

import additionalBlocksAtom from '@state/atoms/additionalBlocksAtom'
import directionsAtom from '@state/atoms/directionsAtom'
import eventsAtom from '@state/atoms/eventsAtom'
import itemsFuncAtom from '@state/atoms/itemsFuncAtom'
import loggedUserAtom from '@state/atoms/loggedUserAtom'
import paymentsAtom from '@state/atoms/paymentsAtom'
import reviewsAtom from '@state/atoms/reviewsAtom'
import usersAtom from '@state/atoms/usersAtom'
import itemsFuncGenerator from '@state/itemsFuncGenerator'
import { useEffect } from 'react'
// import eventsUsersEditSelector from '@state/selectors/eventsUsersEditSelector'
// import eventsUsersDeleteSelector from '@state/selectors/eventsUsersDeleteSelector'
// import eventsUsersAtom from '@state/atoms/eventsUsersAtom'
import LoadingSpinner from '@components/LoadingSpinner'

// import eventEditSelector from '@state/selectors/eventEditSelector'
// import eventDeleteSelector from '@state/selectors/eventDeleteSelector'
// import directionEditSelector from '@state/selectors/directionEditSelector'
// import directionDeleteSelector from '@state/selectors/directionDeleteSelector'
// import additionalBlockEditSelector from '@state/selectors/additionalBlockEditSelector'
// import additionalBlockDeleteSelector from '@state/selectors/additionalBlockDeleteSelector'
// import userEditSelector from '@state/selectors/userEditSelector'
// import userDeleteSelector from '@state/selectors/userDeleteSelector'
// import reviewEditSelector from '@state/selectors/reviewEditSelector'
// import reviewDeleteSelector from '@state/selectors/reviewDeleteSelector'
// import paymentsAddSelector from '@state/selectors/paymentsAddSelector'
// import paymentEditSelector from '@state/selectors/paymentEditSelector'
// import paymentsDeleteSelector from '@state/selectors/paymentsDeleteSelector'
// import eventsUsersDeleteByEventIdSelector from '@state/selectors/eventsUsersDeleteByEventIdSelector'
// import setLoadingSelector from '@state/selectors/setLoadingSelector'
// import setNotLoadingSelector from '@state/selectors/setNotLoadingSelector'
// import setErrorSelector from '@state/selectors/setErrorSelector'
// import setNotErrorSelector from '@state/selectors/setNotErrorSelector'
import useSnackbar from '@helpers/useSnackbar'
import ModalsPortal from '@layouts/modals/ModalsPortal'
import { modalsFuncAtom } from '@state/atoms'
import historiesAtom from '@state/atoms/historiesAtom'
import isSiteLoadingAtom from '@state/atoms/isSiteLoadingAtom'
import loggedUserActiveRoleNameAtom from '@state/atoms/loggedUserActiveRoleNameAtom'
import loggedUserActiveStatusAtom from '@state/atoms/loggedUserActiveStatusAtom'
import questionnairesAtom from '@state/atoms/questionnairesAtom'
import questionnairesUsersAtom from '@state/atoms/questionnairesUsersAtom'
import siteSettingsAtom from '@state/atoms/siteSettingsAtom'
import cn from 'classnames'
import DeviceCheck from './DeviceCheck'
// import questionnaireEditSelector from '@state/selectors/questionnaireEditSelector'
// import questionnaireDeleteSelector from '@state/selectors/questionnaireDeleteSelector'
// import questionnaireUsersEditSelector from '@state/selectors/questionnaireUsersEditSelector'
// import questionnaireUsersDeleteSelector from '@state/selectors/questionnaireUsersDeleteSelector'
// import windowDimensionsAtom from '@state/atoms/windowDimensionsAtom'
import servicesAtom from '@state/atoms/servicesAtom'
// import serviceEditSelector from '@state/selectors/serviceEditSelector'
// import serviceDeleteSelector from '@state/selectors/serviceDeleteSelector'
// import { useMemo } from 'react'
// import addModalSelector from '@state/selectors/addModalSelector'
// import addErrorModalSelector from '@state/selectors/addErrorModalSelector'
// import snackbarAtom from '@state/atoms/snackbarAtom'
import modalsFuncGenerator from '@layouts/modals/modalsFuncGenerator'
import servicesUsersAtom from '@state/atoms/servicesUsersAtom'
import { useRouter } from 'next/router'
// import servicesUsersEditSelector from '@state/selectors/servicesUsersEditSelector'
// import servicesUsersDeleteSelector from '@state/selectors/servicesUsersDeleteSelector'
import { postData } from '@helpers/CRUD'
import isBrowserNeedToBeUpdate from '@helpers/browserCheck'
import browserVer from '@helpers/browserVer'
import { useWindowDimensionsRecoil } from '@helpers/useWindowDimensions'
import modeAtom from '@state/atoms/modeAtom'
import serverSettingsAtom from '@state/atoms/serverSettingsAtom'
// import { getRecoil } from 'recoil-nexus'
import TopInfo from './TopInfo'
import rolesAtom from '@state/atoms/rolesAtom'
import { DEFAULT_ROLES } from '@helpers/constants'
import locationAtom from '@state/atoms/locationAtom'
// import setRecoilFunc from '@helpers/setRecoilFunc'

const StateLoader = (props) => {
  if (props.error && Object.keys(props.error).length > 0)
    console.log('props.error', props.error)

  const snackbar = useSnackbar()

  const router = useRouter()

  const [modalFunc, setModalsFunc] = useRecoilState(modalsFuncAtom)

  const [isSiteLoading, setIsSiteLoading] = useRecoilState(isSiteLoadingAtom)

  const [mode, setMode] = useRecoilState(modeAtom)
  const [location, setLocation] = useRecoilState(locationAtom)

  const [loggedUser, setLoggedUser] = useRecoilState(loggedUserAtom)
  const [loggedUserActiveRole, setLoggedUserActiveRole] = useRecoilState(
    loggedUserActiveRoleNameAtom
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
  // const setEventsUsersState = useSetRecoilState(eventsUsersAtom)
  const [siteSettingsState, setSiteSettingsState] =
    useRecoilState(siteSettingsAtom)
  const setRolesSettingsState = useSetRecoilState(rolesAtom)
  const setHistoriesState = useSetRecoilState(historiesAtom)
  const setQuestionnairesState = useSetRecoilState(questionnairesAtom)
  const setQuestionnairesUsersState = useSetRecoilState(questionnairesUsersAtom)
  const setServicesState = useSetRecoilState(servicesAtom)
  const setServicesUsersState = useSetRecoilState(servicesUsersAtom)
  const setServerSettingsState = useSetRecoilState(serverSettingsAtom)

  // const setEvent = useSetRecoilState(eventEditSelector)
  // const deleteEvent = useSetRecoilState(eventDeleteSelector)
  // const setDirection = useSetRecoilState(directionEditSelector)
  // const deleteDirection = useSetRecoilState(directionDeleteSelector)
  // const setAdditionalBlock = useSetRecoilState(additionalBlockEditSelector)
  // const deleteAdditionalBlock = useSetRecoilState(additionalBlockDeleteSelector)
  // const setUser = useSetRecoilState(userEditSelector)
  // const deleteUser = useSetRecoilState(userDeleteSelector)
  // const setReview = useSetRecoilState(reviewEditSelector)
  // const deleteReview = useSetRecoilState(reviewDeleteSelector)
  // const setPayment = useSetRecoilState(paymentEditSelector)
  // const addPayments = useSetRecoilState(paymentsAddSelector)
  // const deletePayment = useSetRecoilState(paymentsDeleteSelector)
  // const setEventsUser = useSetRecoilState(eventsUsersEditSelector)
  // const deleteEventsUser = useSetRecoilState(eventsUsersDeleteSelector)
  // const deleteEventsUsersByEventId = useSetRecoilState(
  //   eventsUsersDeleteByEventIdSelector
  // )
  // const setQuestionnaire = useSetRecoilState(questionnaireEditSelector)
  // const deleteQuestionnaire = useSetRecoilState(questionnaireDeleteSelector)
  // const setQuestionnaireUsers = useSetRecoilState(
  //   questionnaireUsersEditSelector
  // )
  // const deleteQuestionnaireUsers = useSetRecoilState(
  //   questionnaireUsersDeleteSelector
  // )
  // const setService = useSetRecoilState(serviceEditSelector)
  // const deleteService = useSetRecoilState(serviceDeleteSelector)
  // const setServicesUser = useSetRecoilState(servicesUsersEditSelector)
  // const deleteServicesUser = useSetRecoilState(servicesUsersDeleteSelector)

  const setItemsFunc = useSetRecoilState(itemsFuncAtom)
  // const setLoadingCard = useSetRecoilState(setLoadingSelector)
  // const setNotLoadingCard = useSetRecoilState(setNotLoadingSelector)
  // const setErrorCard = useSetRecoilState(setErrorSelector)
  // const setNotErrorCard = useSetRecoilState(setNotErrorSelector)
  // const setWindowDimensions = useSetRecoilState(windowDimensionsAtom)

  // const addErrorModal = useSetRecoilState(addErrorModalSelector)

  // const itemsFunc = useMemo(() => itemsFuncGenerator(snackbar), [])

  // useEffect(() => {
  //   setModalsFunc(modalsFuncGenerator(router))
  // }, [])

  useWindowDimensionsRecoil()

  useEffect(() => {
    const itemsFunc = itemsFuncGenerator(snackbar, loggedUser)
    setItemsFunc(itemsFunc)
    setModalsFunc(
      modalsFuncGenerator(
        router,
        itemsFunc,
        loggedUser,
        siteSettingsState,
        loggedUserActiveRole,
        loggedUserActiveStatus
      )
    )
  }, [
    loggedUser,
    siteSettingsState,
    loggedUserActiveRole,
    loggedUserActiveStatus,
  ])

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
    // setEventsUsersState(props.eventsUsers)
    setSiteSettingsState(props.siteSettings)
    setRolesSettingsState([
      ...DEFAULT_ROLES,
      ...(typeof props.rolesSettings === 'object' ? props.rolesSettings : []),
    ])
    setHistoriesState(props.histories)
    setQuestionnairesState(props.questionnaires)
    setQuestionnairesUsersState(props.questionnairesUsers)
    setServicesState(props.services)
    setServicesUsersState(props.servicesUsers)
    setServerSettingsState(props.serverSettings)
    setMode(props.mode ?? 'production')
    setLocation(props.location ?? 'krasnoyarsk')
    // setSnackbar(snackbar)
    setIsSiteLoading(false)
  }, [])

  useEffect(() => {
    if (modalFunc && !isSiteLoading) {
      if (props.isCabinet) {
        const url = isBrowserNeedToBeUpdate()
        if (url) modalFunc.browserUpdate(url) //getRecoil(modalsFuncAtom).browserUpdate(url)
      }
      if (location !== 'dev')
        if (!props.isCabinet) {
          if (router.query?.location) {
            localStorage.setItem('location', router.query?.location)
          } else {
            const storagedLocation = localStorage.getItem('location')
            if (!storagedLocation) {
              modalFunc.browseLocation()
            }
          }
        }
    }
  }, [modalFunc, props.isCabinet, isSiteLoading])

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
