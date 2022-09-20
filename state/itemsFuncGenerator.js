import { postData, putData, deleteData } from '@helpers/CRUD'

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
      success: 'Трензакция обновлена',
      error: 'Не удалось обновить транзакцию',
    },
    add: {
      success: 'Трензакция создана',
      error: 'Не удалось создать транзакцию',
    },
    delete: {
      success: 'Трензакция удалена',
      error: 'Не удалось удалить транзакцию',
    },
  },
}

const itemsFuncGenerator = (
  props,
  array = ['event', 'direction', 'additionalBlock', 'user', 'review', 'payment']
) => {
  const {
    setLoadingCard,
    setNotLoadingCard,
    setErrorCard,
    setNotErrorCard,
    modalsFunc,
    snackbar = {},
  } = props
  const obj = {}
  array?.length > 0 &&
    array.forEach((itemName) => {
      obj[itemName] = {
        set: async (item, clone) => {
          if (item?._id && !clone) {
            setLoadingCard(itemName + item._id)
            return await putData(
              `/api/${itemName}s/${item._id}`,
              item,
              (data) => {
                setNotLoadingCard(itemName + item._id)
                snackbar.success(messages[itemName].update.success)
                props['set' + capitalizeFirstLetter(itemName)](data)
                // setEvent(data)
              },
              (error) => {
                snackbar.error(messages[itemName].update.error)
                setErrorCard(itemName + item._id)
                const data = {
                  errorPlace: 'UPDATE ERROR',
                  itemName,
                  item,
                  error,
                }
                modalsFunc.error(data)
              }
            )
          } else {
            const clearedItem = { ...item }
            delete clearedItem._id
            return await postData(
              `/api/${itemName}s`,
              clearedItem,
              (data) => {
                snackbar.success(messages[itemName].add.success)
                props['set' + capitalizeFirstLetter(itemName)](data)
                // setEvent(data)
              },
              (error) => {
                snackbar.error(messages[itemName].add.error)
                setErrorCard(itemName + item._id)
                const data = {
                  errorPlace: 'CREATE ERROR',
                  itemName,
                  item,
                  error,
                }
                modalsFunc.error(data)
                console.log(data)
              }
            )
          }
        },
        delete: async (itemId) => {
          setLoadingCard(itemName + itemId)
          return await deleteData(
            `/api/${itemName}s/${itemId}`,
            () => {
              snackbar.success(messages[itemName].delete.success)
              props['delete' + capitalizeFirstLetter(itemName)](itemId)
            },
            (error) => {
              snackbar.error(messages[itemName].delete.error)
              setErrorCard(itemName + item._id)
              const data = { errorPlace: 'DELETE ERROR', itemName, item, error }
              modalsFunc.error(data)
              console.log(data)
            }
            //  deleteEvent(itemId)
          )
        },
      }
    })

  // obj['additionalBlock'].up = async (itemId) => {
  //   // Сначала получаем список элементов которые можно поднять
  //   toggleLoading('additionalBlock' + itemId)
  //   await putData(
  //     `/api/additionalBlocks/${itemId}`,
  //     () => props['setAdditionalBlock'](itemId)
  //     //  deleteEvent(itemId)
  //   )
  // }

  obj.event.cancel = async (eventId) => {
    setLoadingCard('event' + eventId)
    return await putData(
      `/api/events/${eventId}`,
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
        modalsFunc.error(data)
        console.log(data)
      }
    )
  }

  obj.event.uncancel = async (eventId) => {
    setLoadingCard('event' + eventId)
    return await putData(
      `/api/events/${eventId}`,
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
        modalsFunc.error(data)
        console.log(data)
      }
    )
  }

  obj.event.signUp = async (eventId, userId, status) => {
    setLoadingCard('event' + eventId)
    return await postData(
      `/api/eventsusers`,
      { eventId, userId, status },
      (data) => {
        snackbar.success(
          `Запись${
            status === 'reserve' ? ' в резерв' : ''
          } на мероприятие прошла успешно`
        )
        setNotLoadingCard('event' + eventId)
        props.setEventsUsers(data)
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
        modalsFunc.error(data)
        console.log(data)
      }

      // () => props['setAdditionalBlock'](itemId)
      //  deleteEvent(itemId)
    )
  }

  obj.event.signOut = async (eventId, userId, activeStatus) => {
    setLoadingCard('event' + eventId)
    return await deleteData(
      `/api/eventsusers`,
      (data) => {
        snackbar.success(
          `Вы успешно отписались${
            activeStatus === 'reserve' ? ' из резерва' : ' от'
          } мероприятия`
        )
        setNotLoadingCard('event' + eventId)
        props.deleteEventsUsers(data._id)
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
        modalsFunc.error(data)
        console.log(data)
      },
      { eventId, userId }
      // () => props['setAdditionalBlock'](itemId)
      //  deleteEvent(itemId)
    )
  }

  // obj.event.setUsers = async (eventId, usersId) => {
  //   toggleLoading('event' + eventId)
  //   await postData(
  //     `/api/eventsusers`,
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
    snackbar.success('Список участников мероприятия успешно обновлен')
    setLoadingCard('event' + eventId)
    return await postData(
      `/api/eventsusers`,
      { eventId, eventUsersStatuses },
      (data) => {
        setNotLoadingCard('event' + eventId)
        props.deleteEventsUsersByEventId(eventId)
        props.setEventsUsers(data)
      },
      (error) => {
        snackbar.success('Не удалось обновить список участников мероприятия')
        setErrorCard('event' + eventId)
        const data = {
          errorPlace: 'setEventUsers ERROR',
          eventId,
          eventUsersStatuses,
          error,
        }
        modalsFunc.error(data)
        console.log(data)
      }
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
  //         await putData(`/api/events/${event._id}`, event, (data) => {
  //           toggleLoading('event' + event._id)
  //           setEvent(data)
  //         })
  //       } else {
  //         await postData(`/api/events`, event, (data) => {
  //           setEvent(data)
  //         })
  //       }
  //     },
  //     delete: async (eventId) => {
  //       toggleLoading('event' + eventId)
  //       await deleteData(`/api/events/${eventId}`, () => deleteEvent(eventId))
  //     },
  //   },
  //   direction: {
  //     set: async (direction, clone) => {
  //       if (direction?._id && !clone) {
  //         toggleLoading('direction' + direction._id)
  //         await putData(
  //           `/api/directions/${direction._id}`,
  //           direction,
  //           (data) => {
  //             toggleLoading('direction' + direction._id)
  //             setDirection(data)
  //           }
  //         )
  //       } else {
  //         await postData(`/api/directions`, direction, (data) => {
  //           setDirection(data)
  //         })
  //       }
  //     },
  //     delete: async (directionId) => {
  //       toggleLoading('direction' + directionId)
  //       await deleteData(`/api/directions/${directionId}`, () =>
  //         deleteDirection(directionId)
  //       )
  //     },
  //   },
  // }
}

export default itemsFuncGenerator
