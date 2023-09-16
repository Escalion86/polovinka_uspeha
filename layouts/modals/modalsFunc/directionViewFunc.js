import React, { useEffect } from 'react'
import { useRecoilValue } from 'recoil'

import directionSelector from '@state/selectors/directionSelector'
import sanitize from '@helpers/sanitize'
import ImageGallery from '@components/ImageGallery'

const directionViewFunc = (directionId) => {
  const DirectionViewModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
    setTopLeftComponent,
  }) => {
    const direction = useRecoilValue(directionSelector(directionId))

    if (!directionId || !direction)
      return (
        <div className="flex justify-center w-full text-lg ">
          ОШИБКА! Направление не найдено!
        </div>
      )

    return (
      <div className="flex flex-col">
        {/* {direction?.image && <ImageGallery images={[direction.image]} />} */}
        <div className="px-3 text-lg font-bold leading-4 text-center text-general laptop:text-xl laptop:leading-5">
          {direction.title}
        </div>
        <div className="flex flex-col flex-1">
          <div className="flex flex-col flex-1 w-full max-w-full px-2 py-2 gap-y-1">
            <div
              className="w-full max-w-full overflow-hidden list-disc textarea"
              dangerouslySetInnerHTML={{
                __html: sanitize(direction?.description),
              }}
            />
          </div>
        </div>
      </div>
    )
  }

  return {
    title: `Направление`,
    confirmButtonName: 'Закрыть',
    showDecline: false,
    showConfirm: true,
    Children: DirectionViewModal,
    // declineButtonName: 'Закрыть',
    // TopLeftComponent: () => (
    //   <CardButtons
    //     item={{ _id: eventId }}
    //     typeOfItem="event"
    //     forForm
    //   />
    // ),
  }
}

export default directionViewFunc