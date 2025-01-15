import { postData, putData, deleteData } from '@helpers/CRUD'
import isSiteLoadingAtom from './atoms/isSiteLoadingAtom'

import addErrorModalSelector from './selectors/addErrorModalSelector'
import setLoadingSelector from './selectors/setLoadingSelector'
import setNotLoadingSelector from './selectors/setNotLoadingSelector'
import setErrorSelector from './selectors/setErrorSelector'
import setNotErrorSelector from './selectors/setNotErrorSelector'
import eventEditSelector from './selectors/eventEditSelector'
import eventDeleteSelector from './selectors/eventDeleteSelector'
import directionEditSelector from './selectors/directionEditSelector'
import directionDeleteSelector from './selectors/directionDeleteSelector'
import additionalBlockEditSelector from './selectors/additionalBlockEditSelector'
import additionalBlockDeleteSelector from './selectors/additionalBlockDeleteSelector'
import userDeleteSelector from './selectors/userDeleteSelector'
import userEditSelector from './selectors/userEditSelector'
import reviewEditSelector from './selectors/reviewEditSelector'
import reviewDeleteSelector from './selectors/reviewDeleteSelector'
import paymentsAddSelector from './selectors/paymentsAddSelector'
import paymentEditSelector from './selectors/paymentEditSelector'
import paymentsDeleteSelector from './selectors/paymentsDeleteSelector'
import siteSettingsAtom from './atoms/siteSettingsAtom'
import questionnaireEditSelector from './selectors/questionnaireEditSelector'
import questionnaireDeleteSelector from './selectors/questionnaireDeleteSelector'
import questionnaireUsersEditSelector from './selectors/questionnaireUsersEditSelector'
import questionnaireUsersDeleteSelector from './selectors/questionnaireUsersDeleteSelector'
import serviceEditSelector from './selectors/serviceEditSelector'
import serviceDeleteSelector from './selectors/serviceDeleteSelector'
import servicesUsersEditSelector from './selectors/servicesUsersEditSelector'
import servicesUsersDeleteSelector from './selectors/servicesUsersDeleteSelector'
import setEventsUsersSelector from './async/setEventsUsersSelector'
import signOutUserSelector from './async/signOutUserSelector'
import signUpUserSelector from './async/signUpUserSelector'
import setEventUserSelector from './async/setEventUserSelector'
import rolesAtom from './atoms/rolesAtom'
import updateEventsUsersSelector from './async/updateEventsUsersSelector'

import store from './store'

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

const messages = {
  event: {
    update: {
      success: 'Мероприятие обновлено',
      error: 'Не удалось обновить мероприятие',
    },
    add: {
      success: 'Мероприятие создано',
      error: 'Не удалось создать мероприятие',
    },
    delete: {
      success: 'Мероприятие удалено',
      error: 'Не удалось удалить мероприятие',
    },
  },
  direction: {
    update: {
      success: 'Направление обновлено',
      error: 'Не удалось обновить направление',
    },
    add: {
      success: 'Направление создано',
      error: 'Не удалось создать направление',
    },
    delete: {
      success: 'Направление удалено',
      error: 'Не удалось удалить направление',
    },
  },
  additionalBlock: {
    update: {
      success: 'Дополнительный блок обновлен',
      error: 'Не удалось обновить дополнительный блок',
    },
    add: {
      success: 'Дополнительный блок создан',
      error: 'Не удалось создать дополнительный блок',
    },
    delete: {
      success: 'Дополнительный блок удален',
      error: 'Не удалось удалить дополнительный блок',
    },
  },
  user: {
    update: {
      success: 'Пользователь обновлен',
      error: 'Не удалось обновить пользователя',
    },
    add: {
      success: 'Пользователь создан',
      error: 'Не удалось создать пользователя',
    },
    delete: {
      success: 'Пользователь удален',
      error: 'Не удалось удалить пользователя',
    },
  },
  review: {
    update: {
      success: 'Отзыв обновлен',
      error: 'Не удалось обновить отзыв',
    },
    add: {
      success: 'Отзыв создан',
      error: 'Не удалось создать отзыв',
    },
    delete: {
      success: 'Отзыв удален',
      error: 'Не удалось удалить отзыв',
    },
  },
  payment: {
    update: {
      success: 'Транзакция обновлена',
      error: 'Не удалось обновить транзакцию',
    },
    add: {
      success: 'Транзакция создана',
      error: 'Не удалось создать транзакцию',
    },
    delete: {
      success: 'Транзакция удалена',
      error: 'Не удалось удалить транзакцию',
    },
  },
  questionnaire: {
    update: {
      success: 'Профиль обновлен',
      error: 'Не удалось обновить профиль',
    },
    add: {
      success: 'Профиль создан',
      error: 'Не удалось создать профиль',
    },
    delete: {
      success: 'Профиль удален',
      error: 'Не удалось удалить профиль',
    },
  },
  service: {
    update: {
      success: 'Услуга обновлена',
      error: 'Не удалось обновить услугу',
    },
    add: {
      success: 'Услуга создана',
      error: 'Не удалось создать услугу',
    },
    delete: {
      success: 'Услуга удалена',
      error: 'Не удалось удалить услугу',
    },
  },
  eventsUser: {
    update: {
      success: 'Пользователь на мероприятии обновлен',
      error: 'Не удалось обновить пользователя на мероприятии',
    },
    add: {
      success: 'Пользователь на мероприятии создан',
      error: 'Не удалось создать пользователя на мероприятии',
    },
    delete: {
      success: 'Пользователь на мероприятии удален',
      error: 'Не удалось удалить пользователя на мероприятии',
    },
  },
  servicesUser: {
    update: {
      success: 'Заявка на услугу обновлена',
      error: 'Не удалось обновить заявку на услугу',
    },
    add: {
      success: 'Заявка на услугу создана',
      error: 'Не удалось создать заявку на услугу',
    },
    delete: {
      success: 'Заявка на услугу удалена',
      error: 'Не удалось удалить заявку на услугу',
    },
  },
}

const setFunc = (selector) => (value) => store.set(selector, value)
const setFamilyFunc = (selector) => (id, value) =>
  store.set(selector(id), value)

const props = {
  setLoading: setFunc(isSiteLoadingAtom),
  addErrorModal: setFunc(addErrorModalSelector),
  setLoadingCard: setFunc(setLoadingSelector),
  setNotLoadingCard: setFunc(setNotLoadingSelector),
  setErrorCard: setFunc(setErrorSelector),
  setNotErrorCard: setFunc(setNotErrorSelector),
  setEvent: setFunc(eventEditSelector),
  deleteEvent: setFunc(eventDeleteSelector),
  setDirection: setFunc(directionEditSelector),
  deleteDirection: setFunc(directionDeleteSelector),
  setAdditionalBlock: setFunc(additionalBlockEditSelector),
  deleteAdditionalBlock: setFunc(additionalBlockDeleteSelector),
  setUser: setFunc(userEditSelector),
  deleteUser: setFunc(userDeleteSelector),
  setReview: setFunc(reviewEditSelector),
  deleteReview: setFunc(reviewDeleteSelector),
  addPayments: setFunc(paymentsAddSelector),
  setPayment: setFunc(paymentEditSelector),
  deletePayment: setFunc(paymentsDeleteSelector),

  setEventsUsers: setFamilyFunc(setEventsUsersSelector),
  updateEventsUsers: setFamilyFunc(updateEventsUsersSelector),
  deleteEventsUser: setFunc(signOutUserSelector),
  addEventsUser: setFunc(signUpUserSelector),
  setEventsUser: setFunc(setEventUserSelector),

  setSiteSettings: setFunc(siteSettingsAtom),
  setQuestionnaire: setFunc(questionnaireEditSelector),
  deleteQuestionnaire: setFunc(questionnaireDeleteSelector),
  setQuestionnaireUsers: setFunc(questionnaireUsersEditSelector),
  deleteQuestionnaireUsers: setFunc(questionnaireUsersDeleteSelector),
  setService: setFunc(serviceEditSelector),
  deleteService: setFunc(serviceDeleteSelector),
  setServicesUser: setFunc(servicesUsersEditSelector),
  deleteServicesUser: setFunc(servicesUsersDeleteSelector),
  setRoles: setFunc(rolesAtom),
}

const itemsFuncGenerator = (
  snackbar,
  loggedUser,
  location,
  array = [
    'event',
    'eventsUser',
    'direction',
    'additionalBlock',
    'user',
    'review',
    'payment',
    'questionnaire',
    'questionnairesUser',
    'service',
    'eventsUser',
    'servicesUser',
    'eventsTag',
  ]
) => {
  const {
    setLoadingCard,
    setNotLoadingCard,
    setErrorCard,
    // setNotErrorCard,
    addErrorModal,
    // snackbar = {},
  } = props
  const obj = {}
  array?.length > 0 &&
    array.forEach((itemName) => {
      obj[itemName] = {
        set: async (item, clone, noSnackbar) => {
          if (item?._id && !clone) {
            setLoadingCard(itemName + item._id)
            return await putData(
              `/api/${location}/${itemName.toLowerCase()}s/${item._id}`,
              item,
              (data) => {
                setNotLoadingCard(itemName + item._id)
                if (!noSnackbar && messages[itemName]?.update?.success)
                  snackbar.success(messages[itemName].update.success)
                props['set' + capitalizeFirstLetter(itemName)](data)
                // setEvent(data)
              },
              (error) => {
                if (!noSnackbar && messages[itemName]?.update?.error)
                  snackbar.error(messages[itemName].update.error)
                setErrorCard(itemName + item._id)
                const data = {
                  errorPlace: 'UPDATE ERROR',
                  itemName,
                  item,
                  error,
                }
                addErrorModal(data)
              },
              false,
              loggedUser?._id
            )
          } else {
            const clearedItem = { ...item }
            delete clearedItem._id
            return await postData(
              `/api/${location}/${itemName.toLowerCase()}s`,
              clearedItem,
              (data) => {
                if (!noSnackbar && messages[itemName]?.add?.success)
                  snackbar.success(messages[itemName].add.success)
                props['set' + capitalizeFirstLetter(itemName)](data)
                // setEvent(data)
              },
              (error) => {
                if (!noSnackbar && messages[itemName]?.add?.error)
                  snackbar.error(messages[itemName].add.error)
                setErrorCard(itemName + item._id)
                const data = {
                  errorPlace: 'CREATE ERROR',
                  itemName,
                  item,
                  error,
                }
                addErrorModal(data)
                console.log(data)
              },
              false,
              loggedUser?._id
            )
          }
        },
        delete: async (itemId) => {
          setLoadingCard(itemName + itemId)
          return await deleteData(
            `/api/${location}/${itemName.toLowerCase()}s/${itemId}`,
            () => {
              if (messages[itemName]?.delete?.success)
                snackbar.success(messages[itemName].delete.success)
              props['delete' + capitalizeFirstLetter(itemName)](itemId)
            },
            (error) => {
              if (messages[itemName]?.delete?.error)
                snackbar.error(messages[itemName].delete.error)
              setErrorCard(itemName + itemId)
              const data = {
                errorPlace: 'DELETE ERROR',
                itemName,
                itemId,
                error,
              }
              addErrorModal(data)
              console.log(data)
            },
            false,
            loggedUser?._id
            //  deleteEvent(itemId)
          )
        },
      }
    })

  // obj['additionalBlock'].up = async (itemId) => {
  //   // Сначала получаем список элементов которые можно поднять
  //   toggleLoading('additionalBlock' + itemId)
  //   await putData(
  //     `/api/${location}/additionalblocks/${itemId}`,
  //     () => props['setAdditionalBlock'](itemId)
  //     //  deleteEvent(itemId)
  //   )
  // }

  obj.event.cancel = async (eventId) => {
    setLoadingCard('event' + eventId)
    return await putData(
      `/api/${location}/events/${eventId}`,
      { status: 'canceled' },
      (data) => {
        snackbar.success('Мероприятие отменено')
        setNotLoadingCard('event' + eventId)
        props.setEvent(data)
      },
      (error) => {
        snackbar.error('Не удалось отменить мероприятие')
        setErrorCard('event' + eventId)
        const data = { errorPlace: 'EVENT CANCEL ERROR', eventId, error }
        addErrorModal(data)
        console.log(data)
      },
      false,
      loggedUser?._id
    )
  }

  obj.event.close = async (eventId) => {
    setLoadingCard('event' + eventId)
    return await putData(
      `/api/${location}/events/${eventId}`,
      { status: 'close' },
      (data) => {
        snackbar.success('Мероприятие закрыто')
        setNotLoadingCard('event' + eventId)
        props.setEvent(data)
      },
      (error) => {
        snackbar.error('Не удалось закрыть мероприятие')
        setErrorCard('event' + eventId)
        const data = { errorPlace: 'EVENT CLOSE ERROR', eventId, error }
        addErrorModal(data)
        console.log(data)
      },
      false,
      loggedUser?._id
    )
  }
  obj.roles = {}
  obj.roles.update = async (roles) => {
    return await postData(
      `/api/${location}/roles`,
      roles,
      (data) => {
        snackbar.success('Роли обновлены')
        props.setRoles(data)
      },
      (error) => {
        snackbar.error('Не удалось обновить роли')
        const data = { errorPlace: 'ROLES UPDATE ERROR', roles, error }
        addErrorModal(data)
        console.log(data)
      },
      false,
      loggedUser?._id
    )
  }

  obj.payment.link = async (paymentId, eventId) => {
    setLoadingCard('payment' + paymentId)
    return await putData(
      `/api/${location}/payments/${paymentId}`,
      { eventId },
      (data) => {
        snackbar.success('Транзакция привязана к мероприятию')
        setNotLoadingCard('payment' + paymentId)
        props.setPayment(data)
      },
      (error) => {
        snackbar.error('Не удалось привязать транзакцию к мероприятию')
        setErrorCard('payment' + paymentId)
        const data = {
          errorPlace: 'PAYMENT LINK ERROR',
          paymentId,
          eventId,
          error,
        }
        addErrorModal(data)
        console.log(data)
      },
      false,
      loggedUser?._id
    )
  }

  obj.payment.unlink = async (paymentId) => {
    setLoadingCard('payment' + paymentId)
    return await putData(
      `/api/${location}/payments/${paymentId}`,
      { eventId: null },
      (data) => {
        snackbar.success('Транзакция отвязана от мероприятия')
        setNotLoadingCard('payment' + paymentId)
        props.setPayment(data)
      },
      (error) => {
        snackbar.error('Не удалось отвязать транзакцию от мероприятия')
        setErrorCard('payment' + paymentId)
        const data = {
          errorPlace: 'PAYMENT UNLINK ERROR',
          paymentId,
          error,
        }
        addErrorModal(data)
        console.log(data)
      },
      false,
      loggedUser?._id
    )
  }

  obj.event.uncancel = async (eventId) => {
    setLoadingCard('event' + eventId)
    return await putData(
      `/api/${location}/events/${eventId}`,
      { status: 'active' },
      (data) => {
        snackbar.success('Мероприятие активировано')
        setNotLoadingCard('event' + eventId)
        props.setEvent(data)
      },
      (error) => {
        snackbar.error('не удалось активировать мероприятие')
        setErrorCard('event' + eventId)
        const data = { errorPlace: 'EVENT ACTIVE ERROR', eventId, error }
        addErrorModal(data)
        console.log(data)
      },
      false,
      loggedUser?._id
    )
  }
  // FIX
  obj.event.signUp = async (propsObj, onError, onSuccess) => {
    const { eventId, userId, status, userStatus, subEventId, comment } =
      propsObj

    setLoadingCard('event' + eventId)
    return await postData(
      `/api/${location}/eventsusers`,
      propsObj,
      (data) => {
        // Если запрос прошел, но записаться нельзя, так как уже ктото успел записаться
        if (data.error) {
          snackbar.error(
            `Не удалось записаться на мероприятие, так как ${data.error}`
          )
          setNotLoadingCard('event' + eventId)
          if (typeof onError === 'function') onError(data)
        } else {
          snackbar.success(
            `Запись${
              status === 'reserve' ? ' в резерв' : ''
            } на мероприятие прошла успешно`
          )
          setNotLoadingCard('event' + eventId)
          props.addEventsUser(data)
          if (typeof onSuccess === 'function') onSuccess(data)
        }
      },
      (error) => {
        snackbar.error(
          `Не удалось записаться${
            status === 'reserve' ? ' в резерв' : ''
          } на мероприятие`
        )
        setErrorCard('event' + eventId)
        const data = {
          errorPlace: 'EVENT SIGNUP ERROR',
          eventId,
          userId,
          error,
        }
        addErrorModal(data)
        console.log(data)
      },
      false,
      loggedUser?._id

      // () => props['setAdditionalBlock'](itemId)
      //  deleteEvent(itemId)
    )
  }

  obj.event.signOut = async (eventId, userId, activeStatus) => {
    setLoadingCard('event' + eventId)
    return await deleteData(
      `/api/${location}/eventsusers`,
      (data) => {
        snackbar.success(
          `Вы успешно отписались${
            activeStatus === 'reserve' ? ' из резерва' : ' от'
          } мероприятия`
        )
        setNotLoadingCard('event' + eventId)
        props.deleteEventsUser(data.data)
      },
      (error) => {
        snackbar.error(
          `Не удалось отписаться${
            activeStatus === 'reserve' ? ' из резерва' : ' от'
          } мероприятия`
        )
        setErrorCard('event' + eventId)
        const data = {
          errorPlace: 'EVENT SIGNOUT ERROR',
          eventId,
          userId,
          error,
        }
        addErrorModal(data)
        console.log(data)
      },
      { eventId, userId },
      loggedUser?._id
      // () => props['setAdditionalBlock'](itemId)
      //  deleteEvent(itemId)
    )
  }

  // obj.event.setUsers = async (eventId, usersId) => {
  //   toggleLoading('event' + eventId)
  //   await postData(
  //     `/api/${location}/eventsusers`,
  //     { eventId, usersId },
  //     (data) => {
  //       toggleLoading('event' + eventId)
  //       props.deleteEventsUsersByEventId(eventId)
  //       props.setEventsUsers(data)
  //     }
  //     // () => props['setAdditionalBlock'](itemId)
  //     //  deleteEvent(itemId)
  //   )
  // }

  obj.event.setEventUsers = async (eventId, eventUsersStatuses) => {
    setLoadingCard('event' + eventId)
    return await postData(
      `/api/${location}/eventsusers`,
      { eventId, eventUsersStatuses },
      (data) => {
        snackbar.success('Список участников мероприятия успешно обновлен')
        setNotLoadingCard('event' + eventId)
        // props.deleteEventsUsersByEventId(eventId)
        props.setEventsUsers(eventId, data)
      },
      (error) => {
        snackbar.error('Не удалось обновить список участников мероприятия')
        setErrorCard('event' + eventId)
        const data = {
          errorPlace: 'setEventUsers ERROR',
          eventId,
          eventUsersStatuses,
          error,
        }
        addErrorModal(data)
        console.log(data)
      },
      false,
      loggedUser?._id
      // () => props['setAdditionalBlock'](itemId)
      //  deleteEvent(itemId)
    )
  }

  obj.eventsUser.setData = async (eventId, data, dontShowSnackBar) => {
    setLoadingCard('event' + eventId)
    return await putData(
      `/api/${location}/eventsusers`,
      { data },
      (res) => {
        !dontShowSnackBar &&
          snackbar.success('Лайки участников мероприятия обновлены')
        setNotLoadingCard('event' + eventId)
        props.updateEventsUsers(eventId, res)
      },
      (error) => {
        !dontShowSnackBar &&
          snackbar.error('Не удалось обновить лайки участников мероприятия')
        setErrorCard('event' + eventId)
        const res = {
          errorPlace: 'setLikes ERROR',
          eventId,
          data,
          error,
        }
        addErrorModal(res)
        console.log(res)
      },
      false,
      loggedUser?._id
    )
  }

  obj.service.buy = async (serviceId, userId) => {
    return await postData(
      `/api/${location}/services/buy`,
      { serviceId, userId },
      (data) => {
        snackbar.success('Заявка на покупку услуги успешно отправлена')
        // props.deleteEventsUsersByEventId(eventId)
        // props.setEventsUsers(data)
      },
      (error) => {
        snackbar.error('Не удалось отправить заявку на покупку услуги')
        const data = {
          errorPlace: 'buy ERROR',
          serviceId,
          userId,
          error,
        }
        addErrorModal(data)
        console.log(data)
      },
      false,
      loggedUser?._id
      // () => props['setAdditionalBlock'](itemId)
      //  deleteEvent(itemId)
    )
  }

  obj.payment.autofillPayments = async ({
    eventId,
    payType,
    payAt,
    couponForOrganizer,
  }) => {
    return await postData(
      `/api/${location}/payments/autofill`,
      {
        eventId,
        payType,
        payAt,
        couponForOrganizer,
      },
      (data) => {
        snackbar.success(
          'Автоматическое заполнение транзакций выполнено успешно'
        )
        // props.deleteEventsUsersByEventId(eventId)
        props.addPayments(data)
      },
      (error) => {
        snackbar.error('Не удалось автоматически заполненить транзакции')
        const data = {
          errorPlace: 'autofill payments ERROR',
          eventId,
          payType,
          payAt,
          error,
        }
        addErrorModal(data)
        console.log(data)
      },
      false,
      loggedUser?._id
      // () => props['setAdditionalBlock'](itemId)
      //  deleteEvent(itemId)
    )
  }

  return obj

  // return {
  //   event: {
  //     set: async (event, clone) => {
  //       if (event?._id && !clone) {
  //         toggleLoading('event' + event._id)
  //         await putData(`/api/${location}/events/${event._id}`, event, (data) => {
  //           toggleLoading('event' + event._id)
  //           setEvent(data)
  //         })
  //       } else {
  //         await postData(`/api/${location}/events`, event, (data) => {
  //           setEvent(data)
  //         })
  //       }
  //     },
  //     delete: async (eventId) => {
  //       toggleLoading('event' + eventId)
  //       await deleteData(`/api/${location}/events/${eventId}`, () => deleteEvent(eventId))
  //     },
  //   },
  //   direction: {
  //     set: async (direction, clone) => {
  //       if (direction?._id && !clone) {
  //         toggleLoading('direction' + direction._id)
  //         await putData(
  //           `/api/${location}/directions/${direction._id}`,
  //           direction,
  //           (data) => {
  //             toggleLoading('direction' + direction._id)
  //             setDirection(data)
  //           }
  //         )
  //       } else {
  //         await postData(`/api/${location}/directions`, direction, (data) => {
  //           setDirection(data)
  //         })
  //       }
  //     },
  //     delete: async (directionId) => {
  //       toggleLoading('direction' + directionId)
  //       await deleteData(`/api/${location}/directions/${directionId}`, () =>
  //         deleteDirection(directionId)
  //       )
  //     },
  //   },
  // }
}

export default itemsFuncGenerator
