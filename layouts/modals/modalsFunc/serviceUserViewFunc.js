import React from 'react'
import { useRecoilValue } from 'recoil'
import userSelector from '@state/selectors/userSelector'
import { modalsFuncAtom } from '@state/atoms'
import serviceSelector from '@state/selectors/serviceSelector'
import servicesUsersSelector from '@state/selectors/servicesUsersSelector'

import formatDateTime from '@helpers/formatDateTime'
import UserName from '@components/UserName'
import PriceDiscount from '@components/PriceDiscount'

import TextLine from '@components/TextLine'
import InputWrapper from '@components/InputWrapper'
import CardButton from '@components/CardButton'
import { faEye } from '@fortawesome/free-regular-svg-icons'
import cn from 'classnames'
import ImageGallery from '@components/ImageGallery'
import isObject from '@helpers/isObject'

const serviceUserViewFunc = (serviceUserId) => {
  const ServiceUserViewModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
    setTopLeftComponent,
  }) => {
    const serviceUser = useRecoilValue(servicesUsersSelector(serviceUserId))

    const modalsFunc = useRecoilValue(modalsFuncAtom)
    const user = useRecoilValue(userSelector(serviceUser.userId))
    const service = useRecoilValue(serviceSelector(serviceUser.serviceId))

    if (!serviceUser || !serviceUserId)
      return (
        <div className="flex justify-center w-full text-lg ">
          ОШИБКА! Заявка на услугу не найдена!
        </div>
      )

    return (
      <div className="flex flex-col gap-y-1">
        <TextLine label="Услуга">
          {service.title}
          <CardButton
            icon={faEye}
            color="orange"
            onClick={() => modalsFunc.service.view(service._id)}
            paddingY={false}
          />
        </TextLine>
        <TextLine label="Стоимсоть">
          <PriceDiscount item={service} priceForStatus={user.status} />
        </TextLine>
        <TextLine label="Покупатель">
          <UserName user={user} noWrap />
          <CardButton
            icon={faEye}
            color="orange"
            onClick={() => modalsFunc.user.view(user._id)}
            paddingY={false}
          />
        </TextLine>
        {service.questionnaire && (
          <InputWrapper label={`Анкета "${service.questionnaire.title}"`}>
            <div className="flex flex-col w-full gap-y-1">
              {service.questionnaire.data.map(
                ({ type, label, key, show, required, params }) => {
                  if (!show) return null
                  const userAnswer = serviceUser.answers[key]
                  var formatedAnswer
                  if (type === 'dateTime')
                    formatedAnswer = formatDateTime(
                      userAnswer,
                      true,
                      false,
                      false,
                      false,
                      false
                    )
                  else if (isObject(userAnswer)) {
                    formatedAnswer = userAnswer.join(', ')
                  } else formatedAnswer = userAnswer
                  // const { list } = params
                  // formatedAnswer =
                  // isObject(state)
                  //   ? list
                  //       .filter((item) => userAnswer.includes(item))
                  //       .join(', ')
                  //   :
                  // userAnswer
                  // } else
                  // formatedAnswer = userAnswer
                  return (
                    <div
                      className={cn(
                        'flex flex-col gap-x-1',
                        formatedAnswer ? '' : 'text-gray-400',
                        type === 'images' ? 'flex-col' : ''
                      )}
                      key={key}
                    >
                      <div className={cn('font-bold')}>
                        {label}
                        {required ? '*' : ''}
                      </div>
                      {type === 'images' ? (
                        <ImageGallery images={userAnswer} />
                      ) : (
                        <div>{formatedAnswer ? formatedAnswer : '-'}</div>
                      )}
                    </div>
                  )
                }
              )}
            </div>
          </InputWrapper>
        )}
      </div>
    )
  }

  return {
    title: `Заявка на услугу`,
    // confirmButtonName: 'Подать заявку',
    Children: ServiceUserViewModal,
  }
}

export default serviceUserViewFunc
