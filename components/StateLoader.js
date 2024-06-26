import { useRecoilState, useSetRecoilState } from 'recoil'

import additionalBlocksAtom from '@state/atoms/additionalBlocksAtom'
import directionsAtom from '@state/atoms/directionsAtom'
import eventsAtom from '@state/atoms/eventsAtom'
import itemsFuncAtom from '@state/atoms/itemsFuncAtom'
import loggedUserAtom from '@state/atoms/loggedUserAtom'
import reviewsAtom from '@state/atoms/reviewsAtom'
import usersAtom from '@state/atoms/usersAtom'
import itemsFuncGenerator from '@state/itemsFuncGenerator'
import { useEffect } from 'react'
import LoadingSpinner from '@components/LoadingSpinner'

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
import servicesAtom from '@state/atoms/servicesAtom'
import modalsFuncGenerator from '@layouts/modals/modalsFuncGenerator'
// import servicesUsersAtom from '@state/atoms/servicesUsersAtom'
import { useRouter } from 'next/router'
import { postData } from '@helpers/CRUD'
import isBrowserNeedToBeUpdate from '@helpers/browserCheck'
import browserVer from '@helpers/browserVer'
import { useWindowDimensionsRecoil } from '@helpers/useWindowDimensions'
import modeAtom from '@state/atoms/modeAtom'
import serverSettingsAtom from '@state/atoms/serverSettingsAtom'
import TopInfo from './TopInfo'
import rolesAtom from '@state/atoms/rolesAtom'
import { DEFAULT_ROLES } from '@helpers/constants'
import locationAtom from '@state/atoms/locationAtom'
import CheckSiteUpdateNotification from './CheckSiteUpdateNotification'
import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'

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
  const setHistoriesState = useSetRecoilState(historiesAtom)
  const setQuestionnairesState = useSetRecoilState(questionnairesAtom)
  const setQuestionnairesUsersState = useSetRecoilState(questionnairesUsersAtom)
  const setServicesState = useSetRecoilState(servicesAtom)
  // const setServicesUsersState = useSetRecoilState(servicesUsersAtom)
  const setServerSettingsState = useSetRecoilState(serverSettingsAtom)

  const setItemsFunc = useSetRecoilState(itemsFuncAtom)

  useWindowDimensionsRecoil()

  useEffect(() => {
    const itemsFunc = itemsFuncGenerator(snackbar, loggedUserActive)
    setItemsFunc(itemsFunc)
    setModalsFunc(
      modalsFuncGenerator(
        router,
        itemsFunc,
        loggedUserActive,
        siteSettingsState,
        loggedUserActiveRole,
        loggedUserActiveStatus
      )
    )
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
    setHistoriesState(props.histories)
    setQuestionnairesState(props.questionnaires)
    setQuestionnairesUsersState(props.questionnairesUsers)
    setServicesState(props.services)
    // setServicesUsersState(props.servicesUsers)
    setServerSettingsState(props.serverSettings)
    setMode(props.mode ?? 'production')
    setLocation(props.location ?? 'krasnoyarsk')
    setIsSiteLoading(false)
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
