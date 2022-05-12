// import CheckBox from '@components/CheckBox'
// import Input from '@components/Input'
// import { MODES } from '@helpers/constants'
// import { postData } from '@helpers/CRUD'
// import emailValidator from '@helpers/emailValidator'
// import { useEffect, useState } from 'react'
// import useErrors from '@helpers/useErrors'
// import { modalsFuncAtom } from '@state/atoms'
// import { useRecoilValue } from 'recoil'

import reviewFunc from './modalsFunc/reviewFunc'
import directionFunc from './modalsFunc/directionFunc'
import eventFunc from './modalsFunc/eventFunc'
import userFunc from './modalsFunc/userFunc'
import additionalBlockFunc from './modalsFunc/additionalBlockFunc'

import { deleteData } from '@helpers/CRUD'
import eventSignUpFunc from './modalsFunc/eventSignUpFunc'

const modalsFuncGenerator = (setModals) => {
  // const modalsFunc = useRecoilValue(modalsFuncAtom)
  const addModal = (props) => setModals((modals) => [...modals, props])

  return {
    add: addModal,
    confirm: ({
      title = 'Отмена изменений',
      text = 'Вы уверены, что хотите закрыть окно без сохранения изменений?',
      onConfirm,
    }) => {
      addModal({
        title,
        text,
        onConfirm,
      })
    },
    custom: ({ title, text, onConfirm, Children }) => {
      addModal({
        title,
        text,
        onConfirm,
        Children,
      })
    },
    review: {
      add: (review) => addModal(reviewFunc(review, true)),
      edit: (review) => addModal(reviewFunc(review)),
      delete: (review) =>
        addModal({
          title: 'Удаление отзыва',
          text: 'Вы уверены, что хотите удалить отзыв?',
          onConfirm: async (refreshPage) =>
            await deleteData(`/api/reviews/${review._id}`, refreshPage),
        }),
    },
    direction: {
      add: (direction) => addModal(directionFunc(direction, true)),
      edit: (direction) => addModal(directionFunc(direction)),
      delete: (direction) =>
        addModal({
          title: 'Удаление направления',
          text: 'Вы уверены, что хотите удалить направление?',
          onConfirm: async (refreshPage) =>
            await deleteData(`/api/directions/${direction._id}`, refreshPage),
        }),
    },
    event: {
      add: (event) => addModal(eventFunc(event, true)),
      edit: (event) => addModal(eventFunc(event)),
      delete: (event) =>
        addModal({
          title: 'Удаление события',
          text: 'Вы уверены, что хотите удалить событие?',
          onConfirm: async (refreshPage) =>
            await deleteData(`/api/events/${event._id}`, refreshPage),
        }),
      signUp: (event) => addModal(eventSignUpFunc(event)),
    },
    user: {
      add: (user) => addModal(userFunc(user, true)),
      edit: (user) => addModal(userFunc(user)),
      delete: (user) =>
        addModal({
          title: 'Удаление пользователя',
          text: 'Вы уверены, что хотите удалить пользователя?',
          onConfirm: async (refreshPage) =>
            await deleteData(`/api/users/${user._id}`, refreshPage),
        }),
    },
    additionalBlock: {
      add: (additionalBlock) =>
        addModal(additionalBlockFunc(additionalBlock, true)),
      edit: (additionalBlock) => addModal(additionalBlockFunc(additionalBlock)),
      delete: (additionalBlock) =>
        addModal({
          title: 'Удаление дополнительного блока',
          text: 'Вы уверены, что хотите удалить дополнительный блок?',
          onConfirm: async (refreshPage) =>
            await deleteData(
              `/api/additionalblocks/${additionalBlock._id}`,
              refreshPage
            ),
        }),
    },
    // addUserToCourse: ({ course }) =>
    //   addModal({
    //     title: `Приглашение пользователя на курс\n"${course.title}"`,
    //     confirmButtonName: 'Пригласить',
    //     Children: ({ closeModal, setOnConfirmFunc, setOnDeclineFunc }) => {
    //       const [email, setEmail] = useState('')
    //       const [role, setRole] = useState(MODES.STUDENT)
    //       const [checked, setChecked] = useState(true)
    //       const [errors, addError, removeError, clearErrors] = useErrors()

    //       const isEmailValid = emailValidator(email)

    //       const onClickConfirm = async () => {
    //         if (isEmailValid) {
    //           // TODO сделать проверку на то что приглашение уже существует
    //           await postData(`/api/emailinvitationcourses`, {
    //             email,
    //             courseId: course._id,
    //             role,
    //             sendEmail: checked,
    //           })
    //           closeModal()
    //         } else addError({ email: 'EMail введен неверно' })
    //       }

    //       useEffect(() => {
    //         setOnConfirmFunc(onClickConfirm)
    //       }, [email, role, checked])

    //       return (
    //         <div className="flex flex-col gap-2">
    //           <Input
    //             label="EMail пользователя"
    //             type="text"
    //             value={email}
    //             onChange={(e) => {
    //               removeError('email')
    //               setEmail(e.target.value)
    //             }}
    //             labelClassName="w-40"
    //             error={errors.email}
    //           />
    //           <ComboBoxRoles
    //             labelClassName="w-40"
    //             value={role}
    //             onChange={setRole}
    //           />
    //           <CheckBox
    //             checked={checked}
    //             onClick={() => setChecked((checked) => !checked)}
    //             label="Отправить пирглашение на курс по email"
    //           />
    //           {Object.values(errors).length > 0 && (
    //             <div className="text-red-500">
    //               {Object.values(errors).map((error) => (
    //                 <span key={error}>{error}</span>
    //               ))}
    //             </div>
    //           )}
    //         </div>
    //       )
    //     },
    //   }),
    // deleteChapter: (id) => {
    //   modalsFunc.confirm({
    //     title: 'Удаление раздела',
    //     text: 'Вы уверены, что хотите удалить раздел?',
    //     onConfirm,
    //   })

    //   setLoading(true)
    //   await deleteData(`/api/chapters/${id}`)
    //   if (id === activeChapterId) {
    //     if (chapters.length <= 1) {
    //       goToCurseGeneralPage()
    //     } else {
    //       const existingChapter = chapters.find((chapter) => chapter._id !== id)
    //       const existingLecture = lectures.find(
    //         (lecture) => existingChapter._id === lecture.chapterId
    //       )
    //       if (existingLecture) refreshPage(existingLecture._id)
    //       else goToCurseGeneralPage()
    //     }
    //   } else {
    //     refreshPage()
    //   }
    // },
  }
}

export default modalsFuncGenerator
