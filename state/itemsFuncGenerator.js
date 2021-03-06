import { postData, putData, deleteData } from '@helpers/CRUD'

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

const itemsFuncGenerator = (props) => {
  const { toggleLoading } = props

  const array = [
    'event',
    'direction',
    'additionalBlock',
    'user',
    'review',
    'payment',
  ]
  const obj = {}
  array.forEach((itemName) => {
    obj[itemName] = {
      set: async (item, clone) => {
        if (item?._id && !clone) {
          toggleLoading(itemName + item._id)
          await putData(`/api/${itemName}s/${item._id}`, item, (data) => {
            toggleLoading(itemName + item._id)
            props['set' + capitalizeFirstLetter(itemName)](data)
            // setEvent(data)
          })
        } else {
          const clearedItem = { ...item }
          delete clearedItem._id
          await postData(`/api/${itemName}s`, clearedItem, (data) => {
            props['set' + capitalizeFirstLetter(itemName)](data)
            // setEvent(data)
          })
        }
      },
      delete: async (itemId) => {
        toggleLoading(itemName + itemId)
        await deleteData(
          `/api/${itemName}s/${itemId}`,
          () => props['delete' + capitalizeFirstLetter(itemName)](itemId)
          //  deleteEvent(itemId)
        )
      },
    }
  })

  obj['additionalBlock'].up = async (itemId) => {
    // Сначала получаем список элементов которые можно поднять
    toggleLoading('additionalBlock' + itemId)
    await putData(
      `/api/additionalBlocks/${itemId}`,
      () => props['setAdditionalBlock'](itemId)
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
