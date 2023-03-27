import React, { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import loggedUserAtom from '@state/atoms/loggedUserAtom'
import itemsFuncAtom from '@state/atoms/itemsFuncAtom'
import serviceSelector from '@state/selectors/serviceSelector'
import { modalsFuncAtom } from '@state/atoms'

import QuestionnaireAnswersFill from '@components/QuestionnaireAnswersFill'
import { faIdCard } from '@fortawesome/free-regular-svg-icons'
import ValueItem from '@components/ValuePicker/ValueItem'

const serviceApplyFunc = (serviceId) => {
  const ServiceApplyModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
  }) => {
    const loggedUser = useRecoilValue(loggedUserAtom)
    const service = useRecoilValue(serviceSelector(serviceId))
    const itemsFunc = useRecoilValue(itemsFuncAtom)
    const modalsFunc = useRecoilValue(modalsFuncAtom)

    const [answers, setAnswers] = useState({})

    const onClickConfirm = async () => {
      closeModal()
      itemsFunc.servicesUser.set(
        {
          serviceId,
          userId: loggedUser?._id,
          // status,
          // userStatus: loggedUser.status,
          // eventSubtypeNum,
          answers,
          // comment,
        }
        // (data) => {
        // if (data.error === 'мероприятие закрыто') {
        //   fixEventStatus(eventId, 'closed')
        // }
        // if (data.error === 'мероприятие отменено') {
        //   fixEventStatus(eventId, 'canceled')
        // }
        // if (data.solution === 'reserve') {
        //   event_signUpToReserveAfterError(eventId, data.error)
        // }
        // }
      )
    }

    useEffect(() => {
      setOnConfirmFunc(onClickConfirm)
      setDisableConfirm(
        service.questionnaire &&
          service.questionnaire.data.length > 0 &&
          Object.keys(answers).length === 0
      )
    }, [Object.keys(answers).length])

    return service.questionnaire && service.questionnaire.data.length > 0 ? (
      <div className="flex flex-col">
        <div>{`Для подачи заявки на услугу необходимо заполнить анкету`}</div>
        <div className="flex items-center gap-x-2">
          {/* <Button
            name={answers ? 'Редактировать анкету' : 'Заполнить анкету'}
            onClick={() =>
              modalsFunc.questionnaire.open(
                service.questionnaire,
                answers,
                setAnswers
              )
            }
          /> */}
          <ValueItem
            name={answers ? 'Редактировать анкету' : 'Заполнить анкету'}
            color="purple-500"
            icon={faIdCard}
            hoverable
            onClick={() =>
              modalsFunc.questionnaire.open(
                service.questionnaire,
                answers,
                setAnswers
              )
            }
          />
          <QuestionnaireAnswersFill
            answers={answers}
            questionnaireData={service.questionnaire?.data}
          />
        </div>
      </div>
    ) : (
      <div>{'Вы уверены что хотите оставить заявку на услугу?'}</div>
    )
  }

  // const postfixStatus = status === 'reserve' ? ' в резерв' : ''

  return {
    title: `Заявка на услугу`,
    // text: `Для подачи заявки на услугу необходимо заполнить анкету`,
    confirmButtonName: `Отправить анкету`,
    Children: ServiceApplyModal,
  }
}

export default serviceApplyFunc
