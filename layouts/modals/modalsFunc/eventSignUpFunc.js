import React from 'react'

import { useRecoilValue } from 'recoil'
import eventSelector from '@state/selectors/eventSelector'

import ImageGallery from 'react-image-gallery'

import { P } from '@components/tags'
import Button from '@components/Button'

import formatAddress from '@helpers/formatAddress'
import formatDateTime from '@helpers/formatDateTime'
import getDaysFromNow from '@helpers/getDaysFromNow'

const eventSignUpFunc = (eventId, clone = false) => {
  const EventSignUpModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
  }) => {
    const event = useRecoilValue(eventSelector(eventId))
    // const router = useRouter()

    // const refreshPage = () => {
    //   // setEvent(data)
    //   // router.replace(router.asPath)
    // }

    // const onClickConfirm = async () => {
    //   let error = false
    //   if (!title) {
    //     addError({ title: 'Необходимо ввести название' })
    //     error = true
    //   }
    //   if (!description) {
    //     addError({ description: 'Необходимо ввести описание' })
    //     error = true
    //   }
    //   if (!error) {
    //     closeModal()
    //     if (event && !clone) {
    //       await putData(
    //         `/api/events/${event._id}`,
    //         {
    //           title,
    //           description,
    //           showOnSite,
    //         },
    //         refreshPage
    //       )
    //     } else {
    //       await postData(
    //         `/api/events`,
    //         {
    //           title,
    //           description,
    //           showOnSite,
    //         },
    //         refreshPage
    //       )
    //     }
    //   }
    // }

    // const images = [
    //   {
    //     original: 'https://picsum.photos/id/1018/1000/600/',
    //     // thumbnail: 'https://picsum.photos/id/1018/250/150/',
    //   },
    //   {
    //     original: 'https://picsum.photos/id/1015/1000/600/',
    //     // thumbnail: 'https://picsum.photos/id/1015/250/150/',
    //   },
    //   {
    //     original: 'https://picsum.photos/id/1019/1000/600/',
    //     // thumbnail: 'https://picsum.photos/id/1019/250/150/',
    //   },
    // ]

    const daysFromNow = getDaysFromNow(event.date, false, false)

    return (
      <div className="flex flex-col gap-y-2">
        {event?.images && event.images.length > 0 && (
          <div className="flex justify-center w-full border border-gray-400 h-60 laptop:h-80">
            <ImageGallery
              items={event.images.map((image) => {
                return {
                  original: image,
                  originalClass: 'object-contain max-h-60 laptop:max-h-80',
                  // sizes: '(max-width: 60px) 30px, (min-width: 60px) 60px',
                }
              })}
              showPlayButton={false}
              showFullscreenButton={false}
              additionalClass="w-full max-h-60 laptop:max-h-80 max-w-full"
            />
          </div>
        )}
        <div className="flex flex-col flex-1">
          <div className="flex flex-col flex-1 px-4 py-2">
            <div className="flex justify-center w-full text-3xl font-bold">
              {event.title}
            </div>
            <P className="flex-1">{event.description}</P>
            {event.address && (
              <div className="flex items-center gap-x-1">
                <span className="font-bold">Адрес:</span>{' '}
                {formatAddress(event.address)}
                {event.address?.town && event.address?.street && (
                  <>
                    <a
                      data-tip="Открыть адрес в 2ГИС"
                      href={`https://2gis.ru/search/${event.address.town},%20${event.address.street}%20${event.address.house}`}
                    >
                      <img
                        className="h-6"
                        src="/img/navigators/2gis.png"
                        alt="2gis"
                      />
                    </a>
                    <a
                      className="laptop:hidden"
                      data-tip="Открыть адрес в Яндекс Навигаторе"
                      href={`yandexnavi://map_search?text=${event.address.town},%20${event.address.street}%20${event.address.house}`}
                    >
                      <img
                        className="h-6"
                        src="/img/navigators/yandex.png"
                        alt="2gis"
                      />
                    </a>
                  </>
                )}
              </div>
            )}
          </div>
          <div className="flex flex-col items-end phoneH:flex-row">
            <div className="flex flex-wrap justify-center flex-1 px-4 text-lg font-bold gap-x-1 text-general">
              <div>{formatDateTime(event.date)}</div>
              <div className="font-normal">({getDaysFromNow(event.date)})</div>
            </div>
          </div>
          <div className="flex flex-col items-center w-full phoneH:justify-between phoneH:flex-row">
            {event.price ? (
              <div className="flex flex-wrap flex-1 px-4 text-lg font-bold gap-x-1 text-general">
                Стоимость мероприятия: {event.price / 100} ₽
              </div>
            ) : (
              <div className="px-4 text-lg font-bold text-general">
                Мероприятие бесплатное
              </div>
            )}
            <Button
              className="w-full px-4 py-1 text-white duration-300 border rounded phoneH:w-auto "
              name="Записаться"
              disabled={daysFromNow < 0}
            />
          </div>
        </div>
      </div>
    )
  }

  return {
    title: `Запись на мероприятие`,
    confirmButtonName: 'Записаться',
    Children: EventSignUpModal,
  }
}

export default eventSignUpFunc
