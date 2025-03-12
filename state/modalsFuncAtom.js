'use client'

// import modalsFuncGenerator from '@layouts/modals/modalsFuncGenerator'
import { atom } from 'jotai'
import { withAtomEffect } from 'jotai-effect'

import isUserQuestionnaireFilled from '@helpers/isUserQuestionnaireFilled'
import addModalSelector from '@state/selectors/addModalSelector'
import itemsFuncAtom from '@state/itemsFuncAtom'
import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'
import routerAtom from './atoms/routerAtom'

const modalsFuncGenerator = (get, set) => {
  const itemsFunc = get(itemsFuncAtom)

  if (!itemsFunc) return () => {}

  const loggedUser = get(loggedUserActiveAtom)
  const router = get(routerAtom)

  const addModal = (value) => set(addModalSelector, value)

  const fixEventStatus = (eventId, status) => {
    itemsFunc.event.set({ _id: eventId, status }, false, true)
  }

  const checkLoggedUser = (forWhat = 'Для записи на мероприятие', query) => {
    if (!loggedUser?._id) {
      addModal({
        title: 'Необходимо зарегистрироваться и авторизироваться',
        text: `${forWhat}, необходимо сначала зарегистрироваться, а затем авторизироваться на сайте`,
        confirmButtonName: 'Авторизироваться',
        confirmButtonName2: 'Зарегистрироваться',
        onConfirm: () =>
          router.push(`/login${query ? `?${query}` : ''}`, '', {
            shallow: true,
          }),
        onConfirm2: () =>
          router.push(`/login?registration=true`, '', {
            shallow: true,
          }),
      })
      return false
    } else if (!isUserQuestionnaireFilled(loggedUser)) {
      addModal({
        title: 'Необходимо заполнить профиль',
        text: `${forWhat}, необходимо сначала заполнить профиль`,
        confirmButtonName: 'Заполнить',
        onConfirm: () =>
          router.push(`/cabinet/questionnaire`, '', { shallow: true }),
      })
      return false
    }
    return true
  }

  return {
    add: addModal,
    confirm: ({
      title = 'Отмена изменений',
      text = 'Вы уверены, что хотите закрыть окно без сохранения изменений?',
      onConfirm,
    }) =>
      addModal({
        title,
        text,
        onConfirm,
      }),
    minimalSize: () =>
      addModal({
        title: 'Маленький размер фотографии',
        text: 'Фотография слишком маленькая. Размер должен быть не менее 100x100',
        confirmButtonName: `Понятно`,
        onConfirm: true,
        showDecline: false,
      }),
    copyLink: (data) =>
      addModal(
        require('../layouts/modals/modalsFunc/copyLinkFunc').default(data)
      ),
    browserUpdate: (url) =>
      addModal({
        title: 'Устаревшая версия браузера',
        text: `Необходимо обновить браузер. Некоторые функции сайта могут не работать. Пожалуйста обновите браузер.\n\nТекущая версия браузера: ${navigator.userAgent}`,
        confirmButtonName: `Обновить`,
        onConfirm: true,
        showDecline: true,
        onConfirm: () => router.push(url, ''),
      }),
    custom: addModal,
    cropImage: (...data) =>
      addModal(
        require('../layouts/modals/modalsFunc/cropImageFunc').default(...data)
      ),
    error: (data) =>
      addModal(require('../layouts/modals/modalsFunc/errorFunc').default(data)),
    json: (data) =>
      addModal(require('../layouts/modals/modalsFunc/jsonFunc').default(data)),
    selectSvgFrame: (itemId, onChange) =>
      addModal(
        require('../layouts/modals/modalsFunc/selectSvgFrameFunc').default(
          itemId,
          onChange
        )
      ),
    selectImage: (directory, aspect, onSelect) =>
      addModal(
        require('../layouts/modals/modalsFunc/selectImageFunc').default(
          directory,
          aspect,
          onSelect
        )
      ),
    selectEvents: (
      itemsId,
      filterRules,
      onChange,
      exceptedIds,
      acceptedIds,
      maxEvents,
      canSelectNone,
      modalTitle,
      showCountNumber
    ) =>
      addModal(
        require('../layouts/modals/modalsFunc/selectEventsFunc').default(
          itemsId,
          filterRules,
          onChange,
          exceptedIds,
          acceptedIds,
          maxEvents,
          canSelectNone,
          modalTitle,
          showCountNumber
        )
      ),
    selectUsers: (
      items,
      filterRules,
      onChange,
      exceptedIds,
      acceptedIds,
      maxUsers,
      canSelectNone,
      modalTitle,
      getFullUsers
    ) =>
      addModal(
        require('../layouts/modals/modalsFunc/selectUsersFunc').default(
          items,
          filterRules,
          onChange,
          exceptedIds,
          acceptedIds,
          maxUsers,
          canSelectNone,
          modalTitle,
          getFullUsers
        )
      ),
    selectUsersByStatusesFromEvent: (eventId, onSelect) =>
      addModal(
        require('../layouts/modals/modalsFunc/selectUsersByFilterFromSelectedEventFunc').default(
          eventId,
          onSelect
        )
      ),
    selectUsersByStatusesFromService: (serviceId, onSelect) =>
      addModal(
        require('../layouts/modals/modalsFunc/selectUsersByFilterFromSelectedServiceFunc').default(
          serviceId,
          onSelect
        )
      ),
    selectDirections: (
      itemsId,
      filterRules,
      onChange,
      exceptedIds,
      acceptedIds,
      maxDirections,
      canSelectNone,
      modalTitle,
      showCountNumber
    ) =>
      addModal(
        require('../layouts/modals/modalsFunc/selectDirectionsFunc').default(
          itemsId,
          filterRules,
          onChange,
          exceptedIds,
          acceptedIds,
          maxDirections,
          canSelectNone,
          modalTitle,
          showCountNumber
        )
      ),
    selectServices: (
      itemsId,
      filterRules,
      onChange,
      exceptedIds,
      acceptedIds,
      maxServices,
      canSelectNone,
      modalTitle,
      showCountNumber
    ) =>
      addModal(
        require('../layouts/modals/modalsFunc/selectServicesFunc').default(
          itemsId,
          filterRules,
          onChange,
          exceptedIds,
          acceptedIds,
          maxServices,
          canSelectNone,
          modalTitle,
          showCountNumber
        )
      ),
    selectPayments: (
      itemsId,
      filterRules,
      onChange,
      exceptedIds,
      acceptedIds,
      maxPayments,
      canSelectNone,
      modalTitle,
      showCountNumber
    ) =>
      addModal(
        require('../layouts/modals/modalsFunc/selectPaymentsFunc').default(
          itemsId,
          filterRules,
          onChange,
          exceptedIds,
          acceptedIds,
          maxPayments,
          canSelectNone,
          modalTitle,
          showCountNumber
        )
      ),
    review: {
      add: (reviewId) =>
        addModal(
          require('../layouts/modals/modalsFunc/reviewFunc').default(
            reviewId,
            true
          )
        ),
      edit: (reviewId) =>
        addModal(
          require('../layouts/modals/modalsFunc/reviewFunc').default(reviewId)
        ),
      delete: (reviewId) =>
        addModal({
          title: 'Удаление отзыва',
          text: 'Вы уверены, что хотите удалить отзыв?',
          onConfirm: async () => itemsFunc.review.delete(reviewId),
        }),
    },
    direction: {
      add: (directionId) =>
        addModal(
          require('../layouts/modals/modalsFunc/directionFunc').default(
            directionId,
            true
          )
        ),
      edit: (directionId) =>
        addModal(
          require('../layouts/modals/modalsFunc/directionFunc').default(
            directionId
          )
        ),
      delete: (directionId) =>
        addModal({
          title: 'Удаление направления',
          text: 'Вы уверены, что хотите удалить направление?',
          onConfirm: async () => itemsFunc.direction.delete(directionId),
        }),
      view: (directionId) =>
        addModal(
          require('../layouts/modals/modalsFunc/directionViewFunc').default(
            directionId
          )
        ),
    },
    eventsTags: {
      edit: () =>
        addModal(
          require('../layouts/modals/modalsFunc/eventsTagsFunc').default()
        ),
    },
    event: {
      add: (eventId, props) =>
        addModal(
          require('../layouts/modals/modalsFunc/eventFunc').default(
            eventId,
            true,
            props
          )
        ),
      edit: (eventId) =>
        addModal(
          require('../layouts/modals/modalsFunc/eventFunc').default(eventId)
        ),
      subEventEdit: (props, onChange, rules) =>
        addModal(
          require('../layouts/modals/modalsFunc/subEventFunc').default(
            props,
            onChange,
            rules
          )
        ),
      users: (eventId) =>
        addModal(
          require('../layouts/modals/modalsFunc/eventUsersFunc').default(
            eventId
          )
        ),
      history: (eventId) =>
        addModal(
          require('../layouts/modals/modalsFunc/eventHistoryFunc').default(
            eventId
          )
        ),
      statusEdit: (eventId) =>
        addModal(
          require('../layouts/modals/modalsFunc/eventStatusEditFunc').default(
            eventId
          )
        ),
      historyEventUsers: (eventId) =>
        addModal(
          require('../layouts/modals/modalsFunc/eventUsersHistoryFunc').default(
            eventId
          )
        ),
      payments: (eventId) =>
        addModal(
          require('../layouts/modals/modalsFunc/eventUsersPaymentsFunc').default(
            eventId
          )
        ),
      close: (eventId) =>
        addModal({
          title: 'Закрытие мероприятия',
          text: 'Вы уверены, что хотите закрыть мероприятие?',
          onConfirm: async () => itemsFunc.event.close(eventId),
        }),
      cancel: (eventId) =>
        addModal({
          title: 'Отмена мероприятия',
          text: 'Вы уверены, что хотите отменить мероприятие (это не удалит мероприятие, а лишь изменит его статус на отмененное)?',
          onConfirm: async () => itemsFunc.event.cancel(eventId),
        }),
      uncancel: (eventId) =>
        addModal({
          title: 'Возобновление мероприятия',
          text: 'Вы уверены, что хотите возобновить мероприятие?',
          onConfirm: async () => itemsFunc.event.uncancel(eventId),
        }),
      delete: (eventId) =>
        addModal(
          require('../layouts/modals/modalsFunc/eventDeleteFunc').default(
            eventId
          )
        ),

      // addModal({
      //   title: 'Удаление мероприятия',
      //   text: 'Вы уверены, что хотите удалить мероприятие?',
      //   onConfirm: async () => itemsFunc.event.delete(eventId),
      // }),
      view: (eventId) =>
        addModal(
          require('../layouts/modals/modalsFunc/eventViewFunc').default(eventId)
        ),
      // editLikes: (eventId) => addModal(require('../layouts/modals/modalsFunc/likesEditFunc').default(eventId)),
      viewLikes: (eventId) =>
        addModal(
          require('../layouts/modals/modalsFunc/likesViewFunc').default(eventId)
        ),
      copyUsersList: (eventId) =>
        addModal(
          require('../layouts/modals/modalsFunc/copyEventUserListFunc').default(
            eventId
          )
        ),
      notificateAboutEvent: (eventId) =>
        addModal(
          require('../layouts/modals/modalsFunc/notificateAboutEventTelegramFunc').default(
            eventId
          )
        ),
      signUp: (event, status = 'participant', comment) => {
        if (checkLoggedUser('Для записи на мероприятие', `event=${event._id}`))
          addModal(
            require('../layouts/modals/modalsFunc/eventSignUpFunc').default(
              event,
              status,
              comment,
              fixEventStatus,
              (event, error, comment, subEventId) =>
                addModal(
                  require('../layouts/modals/modalsFunc/eventSignUpToReserveAfterError').default(
                    event,
                    error,
                    comment,
                    subEventId
                  )
                ),
              (event, status, comment, subEventId) =>
                addModal(
                  require('../layouts/modals/modalsFunc/eventAfterSignUpMessageFunc').default(
                    event,
                    status,
                    comment,
                    subEventId
                  )
                )
            )
          )
      },
      signOut: (event, activeStatus) => {
        const postfixStatus = activeStatus === 'reserve' ? ' в резерв' : ''
        addModal({
          title: `Отмена записи${postfixStatus} на мероприятие`,
          text: `Вы уверены что хотите отменить запись${postfixStatus} на мероприятие?`,
          confirmButtonName: `Отменить запись${postfixStatus}`,
          onConfirm: () => {
            itemsFunc.event.signOut(event._id, loggedUser?._id, activeStatus)
          },
        })
        // }
      },
      cantSignUp: () =>
        addModal({
          title: 'Запись на мероприятие невозможна',
          text: 'Ваша учетная запись заблокирована, поэтому вы не можете записываться на мероприятия. Пожалуйста обратитесь к администратору.',
          confirmButtonName: `Понятно`,
          onConfirm: true,
          showDecline: false,
        }),
    },
    eventUser: {
      editStatus: (eventUser) =>
        addModal(
          require('../layouts/modals/modalsFunc/eventUserStatusChangeFunc').default(
            eventUser
          )
        ),
      editSubEvent: (eventUser, onConfirm, selectedSubEventId) =>
        addModal(
          require('../layouts/modals/modalsFunc/eventUserSubEventChangeFunc').default(
            eventUser,
            onConfirm,
            selectedSubEventId
          )
        ),
      editLike: (eventUser, adminView) =>
        addModal(
          require('../layouts/modals/modalsFunc/likeEditFunc').default(
            eventUser,
            adminView
          )
        ),
      likesResult: (eventUser) =>
        addModal(
          require('../layouts/modals/modalsFunc/likeEditFunc').default(
            eventUser
          )
        ),
    },
    payment: {
      add: (paymentId, props) =>
        addModal(
          require('../layouts/modals/modalsFunc/paymentFunc').default(
            paymentId,
            true,
            props
          )
        ),
      edit: (paymentId) =>
        addModal(
          require('../layouts/modals/modalsFunc/paymentFunc').default(paymentId)
        ),
      history: (paymentId) =>
        addModal(
          require('../layouts/modals/modalsFunc/paymentHistoryFunc').default(
            paymentId
          )
        ),
      autoFill: (eventId) =>
        addModal(
          require('../layouts/modals/modalsFunc/paymentsAutoFillFunc').default(
            eventId
          )
        ),
      delete: (paymentId) =>
        addModal({
          title: 'Удаление транзакции',
          text: 'Вы уверены, что хотите удалить транзакцию?',
          onConfirm: async () => itemsFunc.payment.delete(paymentId),
        }),
      userEvent: (userId, eventId) =>
        addModal(
          require('../layouts/modals/modalsFunc/userPaymentsForEventFunc').default(
            userId,
            eventId
          )
        ),
    },
    user: {
      add: (userId) =>
        addModal(
          require('../layouts/modals/modalsFunc/userFunc').default(userId, true)
        ),
      edit: (userId) =>
        addModal(
          require('../layouts/modals/modalsFunc/userFunc').default(userId)
        ),
      history: (userId) =>
        addModal(
          require('../layouts/modals/modalsFunc/userHistoryFunc').default(
            userId
          )
        ),
      historyActions: (userId) =>
        addModal(
          require('../layouts/modals/modalsFunc/userActionsHistoryFunc').default(
            userId
          )
        ),
      editPersonalStatus: (userId) =>
        addModal(
          require('../layouts/modals/modalsFunc/userPersonalStatusEditFunc').default(
            userId
          )
        ),
      delete: (userId) =>
        addModal(
          require('../layouts/modals/modalsFunc/userDeleteFunc').default(userId)
          //   {
          //   title: 'Удаление пользователя',
          //   text: 'Вы уверены, что хотите удалить пользователя?',
          //   onConfirm: async () => itemsFunc.user.delete(userId),
          // }
        ),
      view: (userId, params) =>
        addModal(
          require('../layouts/modals/modalsFunc/userViewFunc').default(
            userId,
            params
          )
        ),
      events: (userId) =>
        addModal(
          require('../layouts/modals/modalsFunc/userSignedUpEventsFunc').default(
            userId
          )
        ),
      payments: (userId) =>
        addModal(
          require('../layouts/modals/modalsFunc/userPaymentsFunc').default(
            userId
          )
        ),
      setPassword: (userId) =>
        addModal(
          require('../layouts/modals/modalsFunc/userSetPasswordFunc').default(
            userId
          )
        ),
    },
    questionnaire: {
      // add: (questionnaireId) =>
      //   addModal(require('../layouts/modals/modalsFunc/questionnaireConstructorFunc').default(questionnaireId, true)),
      open: (questionnaire, value, onConfirm, title) =>
        addModal(
          require('../layouts/modals/modalsFunc/userQuestionnaireFunc').default(
            questionnaire,
            value,
            onConfirm,
            title
          )
        ),
      constructor: (questionnaire, onConfirm) =>
        addModal(
          require('../layouts/modals/modalsFunc/questionnaireConstructorFunc').default(
            questionnaire,
            onConfirm
          )
        ),
    },
    additionalBlock: {
      add: (additionalBlockId) =>
        addModal(
          require('../layouts/modals/modalsFunc/additionalBlockFunc').default(
            additionalBlockId,
            true
          )
        ),
      edit: (additionalBlockId) =>
        addModal(
          require('../layouts/modals/modalsFunc/additionalBlockFunc').default(
            additionalBlockId
          )
        ),
      delete: (additionalBlockId) =>
        addModal({
          title: 'Удаление дополнительного блока',
          text: 'Вы уверены, что хотите удалить дополнительный блок?',
          onConfirm: async () =>
            itemsFunc.additionalBlock.delete(additionalBlockId),
        }),
    },
    service: {
      add: (serviceId) =>
        addModal(
          require('../layouts/modals/modalsFunc/serviceFunc').default(
            serviceId,
            true
          )
        ),
      edit: (serviceId) =>
        addModal(
          require('../layouts/modals/modalsFunc/serviceFunc').default(serviceId)
        ),
      view: (serviceId) =>
        addModal(
          require('../layouts/modals/modalsFunc/serviceViewFunc').default(
            serviceId
          )
        ),
      apply: (serviceId) => {
        if (!loggedUser?._id) {
          addModal({
            title: 'Необходимо зарегистрироваться и авторизироваться',
            text: 'Для покупки услуги, необходимо сначала зарегистрироваться, а затем авторизироваться на сайте',
            confirmButtonName: 'Авторизироваться',
            confirmButtonName2: 'Зарегистрироваться',
            onConfirm: () =>
              router.push(`/login?service=${serviceId}`, '', { shallow: true }),
            onConfirm2: () =>
              router.push(`/login?registration=true`, '', {
                shallow: true,
              }),
          })
        } else if (!isUserQuestionnaireFilled(loggedUser))
          addModal({
            title: 'Необходимо заполнить профиль',
            text: 'Для покупки услуги, необходимо сначала заполнить профиль',
            confirmButtonName: 'Заполнить',
            onConfirm: () =>
              router.push(`/cabinet/questionnaire`, '', { shallow: true }),
          })
        else
          addModal(
            require('../layouts/modals/modalsFunc/serviceApplyFunc').default(
              serviceId
            )
          )
      },
      delete: (serviceId) =>
        addModal({
          title: 'Удаление услуги',
          text: 'Вы уверены, что хотите удалить услугу?',
          onConfirm: async () => itemsFunc.service.delete(serviceId),
        }),
      buy: (serviceId, userId) =>
        addModal({
          title: 'Покупка услуги',
          text: 'Вы уверены, что хотите приобрести услугу?',
          onConfirm: async () => {
            itemsFunc.service.buy(serviceId, userId)
            addModal({
              title: 'Покупка услуги',
              text: 'Заявка на покупку услуги отправлена! Администратор свяжется с вами в ближайшее время.',
            })
          },
        }),
    },
    serviceUser: {
      add: (serviceId) =>
        addModal(
          require('../layouts/modals/modalsFunc/serviceUserFunc').default(
            serviceId,
            true
          )
        ),
      edit: (serviceId) =>
        addModal(
          require('../layouts/modals/modalsFunc/serviceUserFunc').default(
            serviceId
          )
        ),
      view: (serviceUserId, showQuestionnaireOnly, title) =>
        addModal(
          require('../layouts/modals/modalsFunc/serviceUserViewFunc').default(
            serviceUserId,
            showQuestionnaireOnly,
            title
          )
        ),
      delete: (serviceUserId) =>
        addModal({
          title: 'Удаление заявки на услугу',
          text: 'Вы уверены, что хотите удалить заявку на услугу?',
          onConfirm: async () => itemsFunc.servicesUser.delete(serviceUserId),
        }),
      statusEdit: (serviceUserId) =>
        addModal(
          require('../layouts/modals/modalsFunc/serviceUserStatusEditFunc').default(
            serviceUserId
          )
        ),
    },
    notifications: {
      telegram: {
        activate: (onStartActivate, onCancel) =>
          addModal(
            require('../layouts/modals/modalsFunc/notificationsTelegramFunc').default(
              onStartActivate,
              onCancel
            )
          ),
        deactivate: (onSuccess) =>
          addModal(
            require('../layouts/modals/modalsFunc/notificationsDeativateTelegramFunc').default(
              onSuccess
            )
          ),
      },
    },
    loginHistory: {
      user: (userId) =>
        addModal(
          require('../layouts/modals/modalsFunc/userLoginHistoryFunc').default(
            userId
          )
        ),
    },
    role: {
      add: (onConfirm) =>
        addModal(
          require('../layouts/modals/modalsFunc/roleFunc').default(
            undefined,
            onConfirm
          )
        ),
      edit: (role, onConfirm) =>
        addModal(
          require('../layouts/modals/modalsFunc/roleFunc').default(
            role,
            onConfirm
          )
        ),
    },
    newsletter: {
      add: (props) =>
        addModal(
          require('../layouts/modals/modalsFunc/newsletterFunc').default(
            props || {}
          )
        ),
      view: (newsletterId) =>
        addModal(
          require('../layouts/modals/modalsFunc/newsletterViewFunc').default(
            newsletterId
          )
        ),
    },
    individualWedding: {
      add: (props) =>
        addModal(
          require('../layouts/modals/modalsFunc/individualWeddingFunc').default(
            props || {}
          )
        ),
      view: (props) =>
        addModal(
          require('../layouts/modals/modalsFunc/individualWeddingViewFunc').default(
            props
          )
        ),
    },
    template: {
      select: (tool, aspect, onSelect) =>
        addModal(
          require('../layouts/modals/modalsFunc/selectTemplateFunc').default(
            tool,
            aspect,
            onSelect
          )
        ),
      save: (tool, template, onSave, aspect) => {
        addModal(
          require('../layouts/modals/modalsFunc/saveTemplateFunc').default(
            tool,
            template,
            onSave,
            aspect
          )
        )
      },
      add: (tool, template, onSave) => {
        addModal(
          require('../layouts/modals/modalsFunc/newTemplateFunc').default(
            tool,
            template,
            onSave
          )
        )
      },
      rename: (templateId, oldName, onSuccess) => {
        addModal(
          require('../layouts/modals/modalsFunc/renameTemplateFunc').default(
            templateId,
            oldName,
            onSuccess
          )
        )
      },
    },
    browseLocation: () =>
      addModal(
        require('../layouts/modals/modalsFunc/browseLocationFunc').default()
      ),
    remindDate: (remindDate, onAdd) =>
      addModal(
        require('../layouts/modals/modalsFunc/remindDateFunc').default(
          remindDate,
          onAdd
        )
      ),
    external: {
      qrCodeGenerator: ({ type, id, title }) =>
        addModal(
          require('../layouts/modals/modalsFunc/qrCodeGeneratorFunc').default({
            type,
            id,
            title,
          })
        ),
      ai: () =>
        addModal(require('../layouts/modals/modalsFunc/aiFunc').default()),
    },
  }
}

const modalsFuncAtom = withAtomEffect(atom(null), (get, set) => {
  const func = modalsFuncGenerator(get, set)
  set(modalsFuncAtom, func)
})

export default modalsFuncAtom
