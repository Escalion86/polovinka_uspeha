import { useRecoilState, useSetRecoilState } from 'recoil'
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
import usersAtom from '@state/atoms/usersAtom'

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

import additionalBlocksAtomJ from '@state/jotai/atoms/additionalBlocksAtom'
import directionsAtomJ from '@state/jotai/atoms/directionsAtom'
import eventsAtomJ from '@state/jotai/atoms/eventsAtom'
import itemsFuncAtomJ from '@state/jotai/atoms/itemsFuncAtom'
import loggedUserAtomJ from '@state/jotai/atoms/loggedUserAtom'
import reviewsAtomJ from '@state/jotai/atoms/reviewsAtom'
import usersAtomJ from '@state/jotai/atoms/usersAtom'

import modalsFuncAtomJ from '@state/jotai/atoms/modalsFuncAtom'
// import historiesAtomJ from '@state/jotai/atoms/historiesAtom'
import isSiteLoadingAtomJ from '@state/jotai/atoms/isSiteLoadingAtom'
import loggedUserActiveRoleNameAtomJ from '@state/jotai/atoms/loggedUserActiveRoleNameAtom'
import loggedUserActiveStatusAtomJ from '@state/jotai/atoms/loggedUserActiveStatusAtom'
import questionnairesAtomJ from '@state/jotai/atoms/questionnairesAtom'
import questionnairesUsersAtomJ from '@state/jotai/atoms/questionnairesUsersAtom'
import siteSettingsAtomJ from '@state/jotai/atoms/siteSettingsAtom'
import servicesAtomJ from '@state/jotai/atoms/servicesAtom'
import modeAtomJ from '@state/jotai/atoms/modeAtom'
import serverSettingsAtomJ from '@state/jotai/atoms/serverSettingsAtom'
import locationAtomJ from '@state/jotai/atoms/locationAtom'
import loggedUserActiveAtomJ from '@state/jotai/atoms/loggedUserActiveAtom'
import rolesAtomJ from '@state/jotai/atoms/rolesAtom'

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

const StateLoader = (props) => {
  if (props.error && Object.keys(props.error).length > 0)
    console.log('props.error', props.error)

  const snackbar = useSnackbar()

  const router = useRouter()

  const [modalsFunc, setModalsFunc] = useRecoilState(modalsFuncAtom)

  const [isSiteLoading, setIsSiteLoading] = useRecoilState(isSiteLoadingAtom)
  const [mode, setMode] = useRecoilState(modeAtom)
  const [location, setLocation] = useRecoilState(locationAtom)
  const [loggedUser, setLoggedUser] = useRecoilState(loggedUserAtom)
  const [loggedUserActive, setLoggedUserActive] =
    useRecoilState(loggedUserActiveAtom)
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
  const [siteSettingsState, setSiteSettingsState] =
    useRecoilState(siteSettingsAtom)
  const setRolesSettingsState = useSetRecoilState(rolesAtom)
  // const setHistoriesState = useSetRecoilState(historiesAtom)
  const setQuestionnairesState = useSetRecoilState(questionnairesAtom)
  const setQuestionnairesUsersState = useSetRecoilState(questionnairesUsersAtom)
  const setServicesState = useSetRecoilState(servicesAtom)
  // const setServicesUsersState = useSetRecoilState(servicesUsersAtom)
  const setServerSettingsState = useSetRecoilState(serverSettingsAtom)

  const setItemsFunc = useSetRecoilState(itemsFuncAtom)

  // JOTAI

  const [modalsFuncJ, setModalsFuncJ] = useAtom(modalsFuncAtomJ)

  const [isSiteLoadingJ, setIsSiteLoadingJ] = useAtom(isSiteLoadingAtomJ)
  const [modeJ, setModeJ] = useAtom(modeAtomJ)
  const [locationJ, setLocationJ] = useAtom(locationAtomJ)
  const [loggedUserJ, setLoggedUserJ] = useAtom(loggedUserAtomJ)
  const [loggedUserActiveJ, setLoggedUserActiveJ] = useAtom(
    loggedUserActiveAtomJ
  )
  const [loggedUserActiveRoleJ, setLoggedUserActiveRoleJ] = useAtom(
    loggedUserActiveRoleNameAtomJ
  )
  const [loggedUserActiveStatusJ, setLoggedUserActiveStatusJ] = useAtom(
    loggedUserActiveStatusAtomJ
  )
  const setEventsStateJ = useSetAtom(eventsAtomJ)
  const setDirectionsStateJ = useSetAtom(directionsAtomJ)
  const setAdditionalBlocksStateJ = useSetAtom(additionalBlocksAtomJ)
  const setUsersStateJ = useSetAtom(usersAtomJ)
  const setReviewsStateJ = useSetAtom(reviewsAtomJ)
  const [siteSettingsStateJ, setSiteSettingsStateJ] = useAtom(siteSettingsAtomJ)
  const setRolesSettingsStateJ = useSetAtom(rolesAtomJ)
  // const setHistoriesStateJ = useSetAtom(historiesAtomJ)
  const setQuestionnairesStateJ = useSetAtom(questionnairesAtomJ)
  const setQuestionnairesUsersStateJ = useSetAtom(questionnairesUsersAtomJ)
  const setServicesStateJ = useSetAtom(servicesAtomJ)
  // const setServicesUsersState = useSetRecoilState(servicesUsersAtom)
  const setServerSettingsStateJ = useSetAtom(serverSettingsAtomJ)

  const setItemsFuncJ = useSetAtom(itemsFuncAtomJ)

  // ------ Finish Jotai

  useWindowDimensionsStore()

  useEffect(() => {
    const itemsFunc = itemsFuncGenerator(snackbar, loggedUserActive)
    setItemsFunc(itemsFunc)
    setItemsFuncJ(itemsFunc)

    const generatedModalsFunc = modalsFuncGenerator(
      router,
      itemsFunc,
      loggedUserActive,
      siteSettingsState,
      loggedUserActiveRole,
      loggedUserActiveStatus
    )
    setModalsFuncJ(generatedModalsFunc)
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
    setAdditionalBlocksState(props.additionalBlocks)
    setUsersState(props.users)
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

    if (!loggedUserActiveRoleJ || props.loggedUser?.role !== loggedUser?.role)
      setLoggedUserActiveRoleJ(props.loggedUser?.role ?? 'client')
    if (
      !loggedUserActiveStatusJ ||
      props.loggedUser?.status !== loggedUser?.status
    )
      setLoggedUserActiveStatusJ(props.loggedUser?.status ?? 'novice')
    setLoggedUserActiveJ(props.loggedUser)
    setLoggedUserJ(props.loggedUser)
    setEventsStateJ(props.events)
    setDirectionsStateJ(props.directions)
    setAdditionalBlocksStateJ(props.additionalBlocks)
    setUsersStateJ(props.users)
    setReviewsStateJ(props.reviews)
    // setPaymentsState(props.payments)
    setSiteSettingsStateJ(props.siteSettings)
    setRolesSettingsStateJ([
      ...DEFAULT_ROLES,
      ...(typeof props.rolesSettings === 'object' ? props.rolesSettings : []),
    ])
    // setHistoriesStateJ(props.histories)
    setQuestionnairesStateJ(props.questionnaires)
    setQuestionnairesUsersStateJ(props.questionnairesUsers)
    setServicesStateJ(props.services)
    // setServicesUsersState(props.servicesUsers)
    setServerSettingsStateJ(props.serverSettings)
    setModeJ(props.mode ?? 'production')
    setLocationJ(props.location ?? 'krasnoyarsk')
    setIsSiteLoadingJ(false)

    // finish jotai
  }, [props.loggedUser])

  useEffect(() => {
    if (modalsFunc && !isSiteLoading) {
      if (props.isCabinet) {
        const url = isBrowserNeedToBeUpdate()
        if (url) modalsFunc.browserUpdate(url) //getRecoil(modalsFuncAtom).browserUpdate(url)
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
