import { useAtom, useAtomValue, useSetAtom } from 'jotai'

import { useEffect } from 'react'
import LoadingSpinner from '@components/LoadingSpinner'
import cn from 'classnames'
import DeviceCheck from './DeviceCheck'
import useSnackbar from '@helpers/useSnackbar'
import ModalsPortal from '@layouts/modals/ModalsPortal'

// import itemsFuncGenerator from '@state/itemsFuncGenerator'

import achievementsAtom from '@state/atoms/achievementsAtom'
import achievementsUsersAtom from '@state/atoms/achievementsUsersAtom'
import additionalBlocksAtom from '@state/atoms/additionalBlocksAtom'
import directionsAtom from '@state/atoms/directionsAtom'
import eventsAtom from '@state/atoms/eventsAtom'
// import itemsFuncAtom from '@state/itemsFuncAtom'
import loggedUserAtom from '@state/atoms/loggedUserAtom'
import reviewsAtom from '@state/atoms/reviewsAtom'
import usersAtomAsync from '@state/async/usersAtomAsync'

// import modalsFuncAtom from '@state/modalsFuncAtom'
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

import telegramBotNameAtom from '@state/atoms/telegramBotNameAtom'

// import additionalBlocksAtomJ from '@state/atoms/additionalBlocksAtom'
// import directionsAtomJ from '@state/atoms/directionsAtom'
// import eventsAtomJ from '@state/atoms/eventsAtom'
// import itemsFuncAtomJ from '@state/itemsFuncAtom'
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

// import modalsFuncGenerator from '@layouts/modals/modalsFuncGenerator'
// import servicesUsersAtom from '@state/atoms/servicesUsersAtom'
import { useRouter } from 'next/router'
import { getData, postData } from '@helpers/CRUD'
// import isBrowserNeedToBeUpdate from '@helpers/browserCheck'
import browserVer from '@helpers/browserVer'
import { useWindowDimensionsStore } from '@helpers/useWindowDimensions'
import TopInfo from './TopInfo'
import { DEFAULT_ROLES } from '@helpers/constants'
import CheckSiteUpdateNotification from './CheckSiteUpdateNotification'
import snackbarAtom from '@state/atoms/snackbarAtom'
import routerAtom from '@state/atoms/routerAtom'
import CheckBrowserUpdate from './CheckBrowserUpdate'
// import usersAtomAsync from '@state/async/usersAtomAsync'
// import isLoadedAtom from '@state/atoms/isLoadedAtom'

const StateLoader = (props) => {
  if (props.error && Object.keys(props.error).length > 0)
    console.log('props.error', props.error)

  const snackbar = useSnackbar()

  const router = useRouter()

  const location = useAtomValue(locationAtom)

  // const modalsFunc = useAtomValue(modalsFuncAtom)

  const [isSiteLoading, setIsSiteLoading] = useAtom(isSiteLoadingAtom)
  const setTelegramBotName = useSetAtom(telegramBotNameAtom)
  const setSnackbar = useSetAtom(snackbarAtom)
  const setRouter = useSetAtom(routerAtom)
  const [mode, setMode] = useAtom(modeAtom)
  // const [location, setLocation] = useAtom(locationAtom)
  const [loggedUser, setLoggedUser] = useAtom(loggedUserAtom)
  const loggedUserActive = useAtomValue(loggedUserActiveAtom)
  const loggedUserActiveId = loggedUserActive?._id
    ? String(loggedUserActive._id)
    : null
  const setLoggedUserActive = useSetAtom(loggedUserActiveAtom)
  const [loggedUserActiveRole, setLoggedUserActiveRole] = useAtom(
    loggedUserActiveRoleNameAtom
  )
  const [loggedUserActiveStatus, setLoggedUserActiveStatus] = useAtom(
    loggedUserActiveStatusAtom
  )
  const setEventsState = useSetAtom(eventsAtom)
  const setDirectionsState = useSetAtom(directionsAtom)
  const setAchievementsState = useSetAtom(achievementsAtom)
  const setAchievementsUsersState = useSetAtom(achievementsUsersAtom)
  const setAdditionalBlocksState = useSetAtom(additionalBlocksAtom)
  const setUsersState = useSetAtom(usersAtomAsync)
  // const setIsLoadedUsersAtom = useSetAtom(isLoadedAtom('usersAtomAsync'))
  const setReviewsState = useSetAtom(reviewsAtom)
  const setSiteSettingsState = useSetAtom(siteSettingsAtom)
  const setRolesSettingsState = useSetAtom(rolesAtom)
  // const setHistoriesState = useSetAtom(historiesAtom)
  const setQuestionnairesState = useSetAtom(questionnairesAtom)
  const setQuestionnairesUsersState = useSetAtom(questionnairesUsersAtom)
  const setServicesState = useSetAtom(servicesAtom)
  // const setServicesUsersState = useSetAtom(servicesUsersAtom)
  const setServerSettingsState = useSetAtom(serverSettingsAtom)

  // const itemsFunc = useAtomValue(itemsFuncAtom)

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

  // useEffect(() => {
  //   const itemsFunc = itemsFuncGenerator(snackbar, loggedUserActive, location)
  //   // setItemsFunc(itemsFunc)
  //   // setItemsFuncJ(itemsFunc)

  //   const generatedModalsFunc = modalsFuncGenerator(
  //     router,
  //     itemsFunc,
  //     loggedUserActive,
  //     siteSettingsState,
  //     loggedUserActiveRole,
  //     loggedUserActiveStatus
  //   )
  //   // setModalsFuncJ(generatedModalsFunc)
  //   setModalsFunc(generatedModalsFunc)
  // }, [
  //   loggedUserActive,
  //   siteSettingsState,
  //   loggedUserActiveRole,
  //   loggedUserActiveStatus,
  //   location,
  // ])

  useEffect(() => {
    setRouter(router)
    setSnackbar(snackbar)
    if (!loggedUserActiveRole || props.loggedUser?.role !== loggedUser?.role)
      setLoggedUserActiveRole(props.loggedUser?.role ?? 'client')
    if (
      !loggedUserActiveStatus ||
      props.loggedUser?.status !== loggedUser?.status
    )
      setLoggedUserActiveStatus(props.loggedUser?.status ?? 'novice')
    // Для разработчиков позволяем оставаться под выбранным аккаунтом,
    // пока они сознательно не вернутся в свой профиль
    const shouldSyncActiveUser =
      !props.loggedUser?.role ||
      props.loggedUser?.role !== 'dev' ||
      !loggedUserActive?._id ||
      loggedUserActive._id === props.loggedUser._id

    if (shouldSyncActiveUser) {
      setLoggedUserActive(props.loggedUser)
    }
    setLoggedUser(props.loggedUser)
    setEventsState(props.events)
    setDirectionsState(props.directions)
    if (props.additionalBlocks?.length > 0) {
      setAdditionalBlocksState(props.additionalBlocks)
    }
    if (props.users?.length > 0) {
      setUsersState(props.users)
      // setIsLoadedUsersAtom(true)
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
    setAchievementsState(props.achievements ?? [])
    setAchievementsUsersState(props.achievementsUsers ?? [])
    // setServicesUsersState(props.servicesUsers)
    setServerSettingsState(props.serverSettings)
    setMode(props.mode ?? 'production')
    setTelegramBotName(props.telegramBotName)
    // setLocation(props.location ?? 'krasnoyarsk')
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
    if (loggedUser && location) {
      postData(
        `/api/${location}/loginhistory`,
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
  }, [loggedUser, location])

  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      !('serviceWorker' in navigator) ||
      !location ||
      !loggedUserActiveId
    ) {
      return undefined
    }

    const processPushNotificationMessage = async (event, source) => {
      const message = event?.data
      if (!message || message.type !== 'push-notification') return

      const payload = message.payload || {}
      const payloadData = payload?.data || {}
      const payloadType = payloadData?.type || payload?.type

      console.info('[Push debug] Получено push-сообщение', {
        source,
        payload,
        payloadData,
        payloadType,
        loggedUserActiveId,
      })

      if (payloadType !== 'achievement-assigned') return

      console.info('[Push debug] Получено уведомление о достижении', {
        payload,
        payloadData,
        loggedUserActiveId,
      })

      if (
        payloadData?.userId &&
        String(payloadData.userId) !== String(loggedUserActiveId)
      ) {
        console.debug('[Push debug] Сообщение не для активного пользователя', {
          payloadUserId: payloadData.userId,
          loggedUserActiveId,
        })
        return
      }

      const achievementUserId = payloadData?.achievementUserId
      if (!achievementUserId) {
        console.warn(
          '[Push debug] Получено уведомление без идентификатора выдачи достижения'
        )
        return
      }

      const showForegroundNotification = (assignmentData) => {
        if (typeof window === 'undefined') return false
        if (typeof document !== 'undefined' && document.visibilityState !== 'visible') {
          return false
        }

        const hasNotificationApi =
          typeof Notification !== 'undefined' && Notification.permission === 'granted'

        const titleFromPayload =
          payload?.title || assignmentData?.achievement?.title || 'Половинка успеха'
        const bodyFromPayload =
          payload?.body ||
          payloadData?.body ||
          assignmentData?.achievement?.description ||
          'У вас новое достижение'

        const notificationOptions = {
          body: bodyFromPayload,
          icon: payload?.icon || '/icon-192x192.png',
          badge: payload?.badge || '/icon-192x192.png',
          data: payload?.data || {},
          silent: false,
        }

        let notificationShown = false

        if (hasNotificationApi) {
          try {
            const notification = new Notification(
              titleFromPayload,
              notificationOptions
            )
            notificationShown = true

            const notificationUrl = notificationOptions?.data?.url
            if (notificationUrl) {
              notification.onclick = () => {
                try {
                  window.focus()
                } catch (error) {
                  console.warn('Не удалось сфокусировать окно после клика по уведомлению', error)
                }
                window.open(notificationUrl, '_blank')
              }
            }
          } catch (error) {
            console.warn(
              '[Push debug] Не удалось показать foreground-уведомление через Notification API',
              error
            )
          }
        }

        if (!notificationShown && snackbar?.info) {
          snackbar.info(titleFromPayload, {
            autoHideDuration: 4000,
          })
          notificationShown = true
        }

        if (notificationShown) {
          console.info('[Push debug] Foreground-уведомление показано в активной вкладке')
        }

        return notificationShown
      }

      try {
        const assignment = await getData(
          `/api/${location}/achievementsusers/${achievementUserId}`
        )

        if (!assignment) {
          console.warn(
            '[Push debug] Не удалось загрузить информацию о выдаче достижения'
          )
          return
        }

        showForegroundNotification(assignment)

        setAchievementsUsersState((state) => {
          const nextState = Array.isArray(state) ? [...state] : []
          const normalizedId = String(assignment._id)
          const existingIndex = nextState.findIndex(
            (item) => String(item?._id) === normalizedId
          )

          if (existingIndex >= 0) {
            nextState[existingIndex] = assignment
            return nextState
          }

          nextState.push(assignment)
          return nextState
        })
      } catch (error) {
        console.error(
          'Не удалось обновить достижения после push-уведомления',
          error
        )
      }
    }

    const handleServiceWorkerMessage = (event) => {
      processPushNotificationMessage(event, 'serviceWorker').catch((error) => {
        console.error('[Push debug] Ошибка обработки push-сообщения', error)
      })
    }

    const handleWindowMessage = (event) => {
      processPushNotificationMessage(event, 'window').catch((error) => {
        console.error('[Push debug] Ошибка обработки push-сообщения (window)', error)
      })
    }

    navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage)
    window.addEventListener('message', handleWindowMessage)

    if (typeof navigator.serviceWorker.startMessages === 'function') {
      navigator.serviceWorker.startMessages()
    }

    return () => {
      navigator.serviceWorker.removeEventListener(
        'message',
        handleServiceWorkerMessage
      )
      window.removeEventListener('message', handleWindowMessage)
    }
  }, [getData, location, loggedUserActiveId, setAchievementsUsersState])

  return (
    <div className={cn('relative', props.className)}>
      {isSiteLoading ? (
        <div className="w-full h-screen">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <div className="relative w-full bg-white">
          {mode === 'dev' && <TopInfo />}
          <DeviceCheck right />
          {props.children}
        </div>
      )}
      <ModalsPortal />
      <CheckSiteUpdateNotification />
      <CheckBrowserUpdate />
    </div>
  )
}

export default StateLoader
