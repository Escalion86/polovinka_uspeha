import ErrorsList from '@components/ErrorsList'
import FormWrapper from '@components/FormWrapper'
import InputWrapper from '@components/InputWrapper'
import QuestionnaireAnswersFill from '@components/QuestionnaireAnswersFill'
import { SelectService, SelectUser } from '@components/SelectItem'
import ValueItem from '@components/ValuePicker/ValueItem'
import { faIdCard } from '@fortawesome/free-regular-svg-icons/faIdCard'
import compareObjects from '@helpers/compareObjects'
import { DEFAULT_SERVICE_USER } from '@helpers/constants'
import useErrors from '@helpers/useErrors'
import modalsFuncAtom from '@state/modalsFuncAtom'
import itemsFuncAtom from '@state/itemsFuncAtom'
import serviceSelector from '@state/selectors/serviceSelector'
import servicesUsersSelector from '@state/selectors/servicesUsersSelector'
import { useEffect, useState } from 'react'
import { useAtomValue } from 'jotai'

const serviceUserFunc = (serviceUserId, clone = false, props) => {
  const ServiceUserModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
    setOnlyCloseButtonShow,
  }) => {
    const serviceUser = useAtomValue(servicesUsersSelector(serviceUserId))
    const setServiceUser = useAtomValue(itemsFuncAtom).servicesUser.set
    const service = useAtomValue(serviceSelector(serviceUser?.serviceId))
    const modalsFunc = useAtomValue(modalsFuncAtom)

    const [userId, setUserId] = useState(
      props?.userId ?? serviceUser?.userId ?? DEFAULT_SERVICE_USER.userId
    )
    const [serviceId, setServiceId] = useState(
      props?.serviceId ??
        serviceUser?.serviceId ??
        DEFAULT_SERVICE_USER.serviceId
    )
    const [answers, setAnswers] = useState(
      props?.answers ?? serviceUser?.answers ?? DEFAULT_SERVICE_USER.answers
    )

    const [errors, checkErrors, addError, removeError, clearErrors] =
      useErrors()

    const onClickConfirm = async () => {
      const toCheck = {
        serviceId,
        userId,
      }
      if (!checkErrors(toCheck)) {
        closeModal()
        setServiceUser(
          {
            _id: serviceUser?._id,
            userId,
            serviceId,
            answers,
          },
          clone
        )
      }
    }

    useEffect(() => {
      const isFormChanged =
        (props?.userId ?? serviceUser?.userId) !== userId ||
        (props?.serviceId ?? serviceUser?.serviceId) !== serviceId ||
        !compareObjects(props?.answers ?? serviceUser?.answers, answers)

      setOnConfirmFunc(onClickConfirm)
      setOnShowOnCloseConfirmDialog(isFormChanged)
      setDisableConfirm(!isFormChanged)
      // if (isEventClosed) setOnlyCloseButtonShow(true)
    }, [userId, serviceId, answers])

    return (
      <FormWrapper>
        <SelectService
          label="Услуга"
          selectedId={serviceId}
          onChange={(id) => {
            removeError('serviceId')
            setServiceId(id)
          }}
          // onDelete={(e) => console.log('e', e)}
          required
          // readOnly={isEventClosed}
          error={errors.serviceId}
        />
        <SelectUser
          label="Покупатель"
          selectedId={userId}
          onChange={(id) => {
            removeError('userId')
            setUserId(id)
          }}
          // onDelete={(e) => console.log('e', e)}
          required
          // readOnly={isEventClosed}
          error={errors.userId}
        />
        {serviceUserId && service.questionnaire && (
          <InputWrapper
            label={`Анкета "${service.questionnaire.title}"`}
            paddingY={false}
          >
            <div className="flex items-center py-1 gap-x-2">
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
          </InputWrapper>
        )}
        {/* <div className="flex items-center gap-x-2">
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
        </div> */}

        {/* <SelectEvent
          label="Мероприятие"
          selectedId={eventId}
          onChange={isEventClosed ? null : (eventId) => setEventId(eventId)}
          // required
          showEventUsersButton
          showPaymentsButton
          showEditButton
          clearButton={!isEventClosed}
          // readOnly={isEventClosed}
        /> */}
        {/* <DateTimePicker
          value={payAt}
          onChange={(date) => {
            removeError('payAt')
            setPayAt(date)
          }}
          label="Дата проведения"
          required
          error={errors.payAt}
          disabled={isEventClosed}
          className="w-52"
        /> */}

        {/* <Input
          label="Комментарий"
          type="text"
          value={comment}
          onChange={setComment}
          disabled={isEventClosed}
        /> */}
        <ErrorsList errors={errors} />
      </FormWrapper>
    )
  }

  return {
    title: `${
      serviceUserId && !clone ? 'Редактирование' : 'Создание'
    } заявки на услугу`,
    confirmButtonName: serviceUserId && !clone ? 'Применить' : 'Создать',
    Children: ServiceUserModal,
  }
}

export default serviceUserFunc
