import { useAtom, useSetAtom } from 'jotai'

import { useEffect } from 'react'
import LoadingSpinner from '@components/LoadingSpinner'
import cn from 'classnames'
import DeviceCheck from './DeviceCheck'
import useSnackbar from '@helpers/useSnackbar'
import ModalsPortal from '@layouts/modals/ModalsPortal'

import itemsFuncGenerator from '@state/itemsFuncGenerator'

import additionalBlocksAtom from '@state/atoms/additionalBlocksAtom'
import directionsAtom from '@state/atoms/directionsAtom'
import eventsAtom from '@state/atoms/eventsAtom'
import itemsFuncAtom from '@state/atoms/itemsFuncAtom'
import loggedUserAtom from '@state/atoms/loggedUserAtom'
import reviewsAtom from '@state/atoms/reviewsAtom'
import usersAtomAsync from '@state/async/usersAtomAsync'

import modalsFuncAtom from '@state/atoms/modalsFuncAtom'
// import historiesAtom from '@state/atoms/historiesAtom'
import isSiteLoadingAtom from '@state/atoms/isSiteLoadingAtom'
import loggedUserActiveRoleNameAtom from '@state/atoms/loggedUserActiveRoleNameAtom'
import loggedUserActiveStatusAtom from '@state/atoms/loggedUserActiveStatusAtom'
import questionnairesAtom from '@state/atoms/questionnairesAtom'
import questionnairesUsersAtom from '@state/atoms/questionnairesUsersAtom'
import siteSettingsAtom from '@state/atoms/siteSettingsAtom'
import servicesAtom from '@state/atoms/servicesAtom'
import modeAtom from '@state/atoms/modeAtom'
import serverSettingsAtom from '@state/atoms/serverSettingsAtom'
import locationAtom from '@state/atoms/locationAtom'
import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'
import rolesAtom from '@state/atoms/rolesAtom'

// import additionalBlocksAtomJ from '@state/atoms/additionalBlocksAtom'
// import directionsAtomJ from '@state/atoms/directionsAtom'
// import eventsAtomJ from '@state/atoms/eventsAtom'
// import itemsFuncAtomJ from '@state/atoms/itemsFuncAtom'
// import loggedUserAtomJ from '@state/atoms/loggedUserAtom'
// import reviewsAtomJ from '@state/atoms/reviewsAtom'
// import usersAtomJ from '@state/atoms/usersAtomAsync'

// import modalsFuncAtomJ from '@state/atoms/modalsFuncAtom'
// // import historiesAtomJ from '@state/atoms/historiesAtom'
// import isSiteLoadingAtomJ from '@state/atoms/isSiteLoadingAtom'
// import loggedUserActiveRoleNameAtomJ from '@state/atoms/loggedUserActiveRoleNameAtom'
// import loggedUserActiveStatusAtomJ from '@state/atoms/loggedUserActiveStatusAtom'
// import questionnairesAtomJ from '@state/atoms/questionnairesAtom'
// import questionnairesUsersAtomJ from '@state/atoms/questionnairesUsersAtom'
// import siteSettingsAtomJ from '@state/atoms/siteSettingsAtom'
// import servicesAtomJ from '@state/atoms/servicesAtom'
// import modeAtomJ from '@state/atoms/modeAtom'
// import serverSettingsAtomJ from '@state/atoms/serverSettingsAtom'
// import locationAtomJ from '@state/atoms/locationAtom'
// import loggedUserActiveAtomJ from '@state/atoms/loggedUserActiveAtom'
// import rolesAtomJ from '@state/atoms/rolesAtom'

import modalsFuncGenerator from '@layouts/modals/modalsFuncGenerator'
// import servicesUsersAtom from '@state/atoms/servicesUsersAtom'
import { useRouter } from 'next/router'
import { postData } from '@helpers/CRUD'
import isBrowserNeedToBeUpdate from '@helpers/browserCheck'
import browserVer from '@helpers/browserVer'
import { useWindowDimensionsStore } from '@helpers/useWindowDimensions'
import TopInfo from './TopInfo'
import { DEFAULT_ROLES } from '@helpers/constants'
import CheckSiteUpdateNotification from './CheckSiteUpdateNotification'
// import usersAtomAsync from '@state/async/usersAtomAsync'
import isLoadedAtom from '@state/atoms/isLoadedAtom'

const StateLoader = (props) => {
  if (props.error && Object.keys(props.error).length > 0)
    console.log('props.error', props.error)

  const snackbar = useSnackbar()

  const router = useRouter()

  const [modalsFunc, setModalsFunc] = useAtom(modalsFuncAtom)

  const [isSiteLoading, setIsSiteLoading] = useAtom(isSiteLoadingAtom)
  const [mode, setMode] = useAtom(modeAtom)
  const [location, setLocation] = useAtom(locationAtom)
  const [loggedUser, setLoggedUser] = useAtom(loggedUserAtom)
  const [loggedUserActive, setLoggedUserActive] = useAtom(loggedUserActiveAtom)
  const [loggedUserActiveRole, setLoggedUserActiveRole] = useAtom(
    loggedUserActiveRoleNameAtom
  )
  const [loggedUserActiveStatus, setLoggedUserActiveStatus] = useAtom(
    loggedUserActiveStatusAtom
  )
  const setEventsState = useSetAtom(eventsAtom)
  const setDirectionsState = useSetAtom(directionsAtom)
  const setAdditionalBlocksState = useSetAtom(additionalBlocksAtom)
  const setUsersState = useSetAtom(usersAtomAsync)
  const setIsLoadedUsersAtom = useSetAtom(isLoadedAtom('usersAtomAsync'))
  const setReviewsState = useSetAtom(reviewsAtom)
  const [siteSettingsState, setSiteSettingsState] = useAtom(siteSettingsAtom)
  const setRolesSettingsState = useSetAtom(rolesAtom)
  // const setHistoriesState = useSetAtom(historiesAtom)
  const setQuestionnairesState = useSetAtom(questionnairesAtom)
  const setQuestionnairesUsersState = useSetAtom(questionnairesUsersAtom)
  const setServicesState = useSetAtom(servicesAtom)
  // const setServicesUsersState = useSetAtom(servicesUsersAtom)
  const setServerSettingsState = useSetAtom(serverSettingsAtom)

  const setItemsFunc = useSetAtom(itemsFuncAtom)

  // JOTAI

  // const [modalsFuncJ, setModalsFuncJ] = useAtom(modalsFuncAtomJ)

  // const [isSiteLoadingJ, setIsSiteLoadingJ] = useAtom(isSiteLoadingAtomJ)
  // const [modeJ, setModeJ] = useAtom(modeAtomJ)
  // const [locationJ, setLocationJ] = useAtom(locationAtomJ)
  // const [loggedUserJ, setLoggedUserJ] = useAtom(loggedUserAtomJ)
  // const [loggedUserActiveJ, setLoggedUserActiveJ] = useAtom(
  //   loggedUserActiveAtomJ
  // )
  // const [loggedUserActiveRoleJ, setLoggedUserActiveRoleJ] = useAtom(
  //   loggedUserActiveRoleNameAtomJ
  // )
  // const [loggedUserActiveStatusJ, setLoggedUserActiveStatusJ] = useAtom(
  //   loggedUserActiveStatusAtomJ
  // )
  // const setEventsStateJ = useSetAtom(eventsAtomJ)
  // const setDirectionsStateJ = useSetAtom(directionsAtomJ)
  // const setAdditionalBlocksStateJ = useSetAtom(additionalBlocksAtomJ)
  // const setUsersStateJ = useSetAtom(usersAtomJ)
  // const setReviewsStateJ = useSetAtom(reviewsAtomJ)
  // const [siteSettingsStateJ, setSiteSettingsStateJ] = useAtom(siteSettingsAtomJ)
  // const setRolesSettingsStateJ = useSetAtom(rolesAtomJ)
  // // const setHistoriesStateJ = useSetAtom(historiesAtomJ)
  // const setQuestionnairesStateJ = useSetAtom(questionnairesAtomJ)
  // const setQuestionnairesUsersStateJ = useSetAtom(questionnairesUsersAtomJ)
  // const setServicesStateJ = useSetAtom(servicesAtomJ)
  // // const setServicesUsersState = useSetAtom(servicesUsersAtom)
  // const setServerSettingsStateJ = useSetAtom(serverSettingsAtomJ)

  // const setItemsFuncJ = useSetAtom(itemsFuncAtomJ)

  // ------ Finish Jotai

  useWindowDimensionsStore()

  useEffect(() => {
    const itemsFunc = itemsFuncGenerator(snackbar, loggedUserActive)
    setItemsFunc(itemsFunc)
    // setItemsFuncJ(itemsFunc)

    const generatedModalsFunc = modalsFuncGenerator(
      router,
      itemsFunc,
      loggedUserActive,
      siteSettingsState,
      loggedUserActiveRole,
      loggedUserActiveStatus
    )
    // setModalsFuncJ(generatedModalsFunc)
    setModalsFunc(generatedModalsFunc)
  }, [
    loggedUserActive,
    siteSettingsState,
    loggedUserActiveRole,
    loggedUserActiveStatus,
  ])

  useEffect(() => {
    if (!loggedUserActiveRole || props.loggedUser?.role !== loggedUser?.role)
      setLoggedUserActiveRole(props.loggedUser?.role ?? 'client')
    if (
      !loggedUserActiveStatus ||
      props.loggedUser?.status !== loggedUser?.status
    )
      setLoggedUserActiveStatus(props.loggedUser?.status ?? 'novice')
    setLoggedUserActive(props.loggedUser)
    setLoggedUser(props.loggedUser)
    setEventsState(props.events)
    setDirectionsState(props.directions)
    if (props.additionalBlocks?.length > 0) {
      setAdditionalBlocksState(props.additionalBlocks)
    }
    if (props.users?.length > 0) {
      setUsersState(props.users)
      setIsLoadedUsersAtom(true)
    }
    setReviewsState(props.reviews)
    // setPaymentsState(props.payments)
    setSiteSettingsState(props.siteSettings)
    setRolesSettingsState([
      ...DEFAULT_ROLES,
      ...(typeof props.rolesSettings === 'object' ? props.rolesSettings : []),
    ])
    // setHistoriesState(props.histories)
    setQuestionnairesState(props.questionnaires)
    setQuestionnairesUsersState(props.questionnairesUsers)
    setServicesState(props.services)
    // setServicesUsersState(props.servicesUsers)
    setServerSettingsState(props.serverSettings)
    setMode(props.mode ?? 'production')
    setLocation(props.location ?? 'krasnoyarsk')
    setIsSiteLoading(false)

    //jotai

    // if (!loggedUserActiveRoleJ || props.loggedUser?.role !== loggedUser?.role)
    //   setLoggedUserActiveRoleJ(props.loggedUser?.role ?? 'client')
    // if (
    //   !loggedUserActiveStatusJ ||
    //   props.loggedUser?.status !== loggedUser?.status
    // )
    //   setLoggedUserActiveStatusJ(props.loggedUser?.status ?? 'novice')
    // setLoggedUserActiveJ(props.loggedUser)
    // setLoggedUserJ(props.loggedUser)
    // setEventsStateJ(props.events)
    // setDirectionsStateJ(props.directions)
    // setAdditionalBlocksStateJ(props.additionalBlocks)
    // setUsersStateJ(props.users)
    // setReviewsStateJ(props.reviews)
    // // setPaymentsState(props.payments)
    // setSiteSettingsStateJ(props.siteSettings)
    // setRolesSettingsStateJ([
    //   ...DEFAULT_ROLES,
    //   ...(typeof props.rolesSettings === 'object' ? props.rolesSettings : []),
    // ])
    // // setHistoriesStateJ(props.histories)
    // setQuestionnairesStateJ(props.questionnaires)
    // setQuestionnairesUsersStateJ(props.questionnairesUsers)
    // setServicesStateJ(props.services)
    // // setServicesUsersState(props.servicesUsers)
    // setServerSettingsStateJ(props.serverSettings)
    // setModeJ(props.mode ?? 'production')
    // setLocationJ(props.location ?? 'krasnoyarsk')
    // setIsSiteLoadingJ(false)

    // finish jotai
  }, [props.loggedUser])

  useEffect(() => {
    if (modalsFunc && !isSiteLoading) {
      if (props.isCabinet) {
        const url = isBrowserNeedToBeUpdate()
        if (url) modalsFunc.browserUpdate(url)
      }
      if (location !== 'dev')
        if (!props.isCabinet) {
          if (router.query?.location) {
            localStorage.setItem('location', router.query?.location)
          } else {
            const storagedLocation = localStorage.getItem('location')
            if (!storagedLocation) {
              modalsFunc.browseLocation()
            }
          }
        }
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
      <CheckSiteUpdateNotification />
    </div>
  )
}

export default StateLoader
