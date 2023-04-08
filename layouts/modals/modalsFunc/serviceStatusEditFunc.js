import React, { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import itemsFuncAtom from '@state/atoms/itemsFuncAtom'
import servicesUsersSelector from '@state/selectors/servicesUsersSelector'

import { DEFAULT_SERVICE_USER } from '@helpers/constants'
import ServiceUserStatusPicker from '@components/ValuePicker/ServiceUserStatusPicker'

const serviceUserStatusEditFunc = (serviceUserId) => {
  const ServiceUserStatusEditModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
    setTopLeftComponent,
  }) => {
    const serviceUser = useRecoilValue(servicesUsersSelector(serviceUserId))
    const setServiceUser = useRecoilValue(itemsFuncAtom).servicesUser.set
    // const isEventExpired = isEventExpiredFunc(event)

    // const totalIncome = useRecoilValue(totalIncomeOfEventSelector(eventId))
    // const expectedIncome = useRecoilValue(
    //   expectedIncomeOfEventSelector(eventId)
    // )
    // const canSetClosed = totalIncome >= expectedIncome && isEventExpired

    const [status, setStatus] = useState(
      serviceUser?.status ?? DEFAULT_SERVICE_USER.status
    )

    if (!serviceUser || !serviceUserId)
      return (
        <div className="flex justify-center w-full text-lg ">
          ОШИБКА! Заявка не найдена!
        </div>
      )

    const onClickConfirm = async () => {
      closeModal()
      setServiceUser({
        _id: serviceUser?._id,
        status,
      })
    }

    useEffect(() => {
      const isFormChanged = serviceUser?.status !== status
      setDisableConfirm(!isFormChanged)
      setOnConfirmFunc(onClickConfirm)
    }, [status])

    return (
      <div className="flex flex-col gap-y-2">
        <ServiceUserStatusPicker
          required
          status={status}
          onChange={setStatus}
          // disabledValues={canSetClosed ? [] : ['closed']}
        />
        {/* {!canSetClosed && (
          <>
            <div className="text-red-500">
              Закрытие мероприятия не доступно так как:
            </div>
            <ul className="ml-4 -mt-2 list-disc">
              {totalIncome < expectedIncome && (
                <li className="text-red-500">
                  финансы мероприятия не полностью заполнены
                </li>
              )}
              {!isEventExpired && (
                <li className="text-red-500">мероприятие не завершено</li>
              )}
            </ul>
          </>
        )} */}
      </div>
    )
  }

  return {
    title: `Редактирование статуса заявки`,
    confirmButtonName: 'Применить',
    Children: ServiceUserStatusEditModal,
    // TopLeftComponent: () => (
    //   <CardButtons
    //     item={{ _id: eventId }}
    //     typeOfItem="event"
    //     forForm
    //     direction="right"
    //   />
    // ),
  }
}

export default serviceUserStatusEditFunc