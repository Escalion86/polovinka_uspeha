import { postData, putData, deleteData } from '@helpers/CRUD'

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

const itemsFuncGenerator = (
  props,
  array = ['event', 'direction', 'additionalBlock', 'user', 'review', 'payment']
) => {
  const { toggleLoading } = props

  const obj = {}
  array?.length > 0 &&
    array.forEach((itemName) => {
      obj[itemName] = {
        set: async (item, clone) => {
          if (item?._id && !clone) {
            toggleLoading(itemName + item._id)
            return await putData(
              `/api/${itemName}s/${item._id}`,
              item,
              (data) => {
                toggleLoading(itemName + item._id)
                props['set' + capitalizeFirstLetter(itemName)](data)
                // setEvent(data)
              }
            )
          } else {
            const clearedItem = { ...item }
            delete clearedItem._id
            return await postData(`/api/${itemName}s`, clearedItem, (data) => {
              props['set' + capitalizeFirstLetter(itemName)](data)
              // setEvent(data)
            })
          }
        },
        delete: async (itemId) => {
          toggleLoading(itemName + itemId)
          return await deleteData(
            `/api/${itemName}s/${itemId}`,
            () => props['delete' + capitalizeFirstLetter(itemName)](itemId)
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
    toggleLoading('event' + eventId)
    return await putData(
      `/api/events/${eventId}`,
      { status: 'canceled' },
      (data) => {
        toggleLoading('event' + eventId)
        props.setEvent(data)
      }
    )
  }

  obj.event.uncancel = async (eventId) => {
    toggleLoading('event' + eventId)
    return await putData(
      `/api/events/${eventId}`,
      { status: 'active' },
      (data) => {
        toggleLoading('event' + eventId)
        props.setEvent(data)
      }
    )
  }

  obj.event.signUp = async (eventId, userId) => {
    toggleLoading('event' + eventId)
    return await postData(
      `/api/eventsusers`,
      { eventId, userId },
      (data) => {
        toggleLoading('event' + eventId)
        props.setEventsUsers(data)
      }

      // () => props['setAdditionalBlock'](itemId)
      //  deleteEvent(itemId)
    )
  }

  obj.event.signOut = async (eventId, userId) => {
    toggleLoading('event' + eventId)
    return await deleteData(
      `/api/eventsusers`,
      (data) => {
        toggleLoading('event' + eventId)
        props.deleteEventsUsers(data._id)
      },
      null,
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
    toggleLoading('event' + eventId)
    return await postData(
      `/api/eventsusers`,
      { eventId, eventUsersStatuses },
      (data) => {
        toggleLoading('event' + eventId)
        props.deleteEventsUsersByEventId(eventId)
        props.setEventsUsers(data)
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
