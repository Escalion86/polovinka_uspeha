import CheckBox from '@components/CheckBox'
import Input from '@components/Input'
import { postData, putData } from '@helpers/CRUD'
import useErrors from '@helpers/useErrors'
import React, { useEffect, useState } from 'react'
import EditableTextarea from '@components/EditableTextarea'
import { useRouter } from 'next/router'
import FormWrapper from '@components/FormWrapper'
import InputImage from '@components/InputImage'
import { H3, H4, P } from '@components/tags'
import formatDateTime from '@helpers/formatDateTime'
import ImageGallery from 'react-image-gallery'
import getDaysFromNow from '@helpers/getDaysFromNow'
import Button from '@components/Button'
import formatAddress from '@helpers/formatAddress'
import { useRecoilState, useRecoilValue } from 'recoil'
import eventSelector from '@state/selectors/eventSelector'

const eventSignUpFunc = (eventId, clone = false) => {
  const EventSignUpModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
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
        {event.image && (
          <div className="flex justify-center w-full">
            {/* <img
              className="object-contain w-full h-70 phoneH:h-80 tablet:h-60"
              src={event.image}
              alt="event"
              // width={48}
              // height={48}
            /> */}
            <div>
              <ImageGallery
                items={[{ original: event.image }]}
                showPlayButton={false}
                showFullscreenButton={false}
              />
            </div>
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
            <div className="flex flex-wrap flex-1 px-4 text-lg font-bold gap-x-1 text-general">
              <div>{formatDateTime(event.date)}</div>
              <div className="font-normal">({getDaysFromNow(event.date)})</div>
            </div>
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
