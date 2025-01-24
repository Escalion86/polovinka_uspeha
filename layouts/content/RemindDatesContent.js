'use client'

import Button from '@components/Button'
import LoadingSpinner from '@components/LoadingSpinner'
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash'
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { deleteData, getData, postData, putData } from '@helpers/CRUD'
import formatDate from '@helpers/formatDate'
import modalsFuncAtom from '@state/modalsFuncAtom'
import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'
import { useEffect, useState } from 'react'
import { useAtomValue } from 'jotai'
import useSnackbar from '@helpers/useSnackbar'
import locationAtom from '@state/atoms/locationAtom'

const RemindDatesContent = (props) => {
  const location = useAtomValue(locationAtom)
  const modalsFunc = useAtomValue(modalsFuncAtom)
  const loggedUserActive = useAtomValue(loggedUserActiveAtom)
  const snackbar = useSnackbar()

  const [dates, setDates] = useState([])

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadTemplates = async () => {
      const response = await getData(`/api/${location}/reminddates`)
      setDates(response)
      setIsLoading(false)
    }
    loadTemplates()
  }, [])

  if (isLoading) return <LoadingSpinner />

  const onClickAdd = async (data) => {
    modalsFunc.remindDate(data, async (remindDate) => {
      await postData(
        `/api/${location}/reminddates`,
        remindDate,
        (data) => {
          setDates((state) => [...state, data])
          snackbar.success('Дата добавлена')
          setIsLoading(false)
        },
        () => {
          snackbar.error('Ошибка добавления даты')
          setIsLoading(false)
        },
        false,
        loggedUserActive?._id
      )
    })
  }

  const onClickEdit = async (data) => {
    modalsFunc.remindDate(data, async (remindDate) => {
      await putData(
        `/api/${location}/reminddates/${data._id}`,
        remindDate,
        (data) => {
          setDates((state) =>
            state.map((remindDateOld) =>
              remindDateOld._id === data._id ? data : remindDateOld
            )
          )
          snackbar.success('Дата обновлена')
          setIsLoading(false)
        },
        () => {
          snackbar.error('Ошибка обновления даты')
          setIsLoading(false)
        },
        false,
        loggedUserActive?._id
      )
    })
  }

  const onClickDelete = async (remindDate) => {
    modalsFunc.add({
      title: 'Удаление даты события ПУ',
      text: `Вы действительно хотите удалить дату "${remindDate.name}"?`,
      onConfirm: async () =>
        await deleteData(
          `/api/${location}/reminddates/${remindDate._id}`,
          () => {
            snackbar.success('Дата удалена')
            setDates((state) =>
              state.filter(({ _id }) => remindDate._id !== _id)
            )
          },
          () => snackbar.error('Не удалось удалить дату')
        ),
    })
  }

  return (
    <div className="flex flex-col flex-1 h-screen px-1 my-1">
      {dates.map((remindDate) => (
        <div
          className="flex p-1 gap-x-1 cursor-pointer hover:bg-blue-200 items-center not-first:border-t border-gray-500"
          onClick={() => onClickEdit(remindDate)}
        >
          <div className="flex-1 text-general">{remindDate.name}</div>
          <div>{formatDate(remindDate.date)}</div>
          {/* <div className="flex items-center justify-center gap-x-1"> */}
          {/* <FontAwesomeIcon
              className="h-6 p-1 text-orange-500 duration-300 cursor-pointer hover:scale-125"
              icon={faPencilAlt}
              onClick={() => onClickEdit(remindDate)}
            /> */}
          <FontAwesomeIcon
            className="h-5 p-1 text-red-700 duration-300 cursor-pointer hover:scale-125"
            icon={faTrash}
            onClick={(e) => {
              e.stopPropagation()
              onClickDelete(remindDate)
            }}
          />
          {/* </div> */}
        </div>
      ))}
      <Button name="Добавить" icon={faPlus} onClick={() => onClickAdd()} />
    </div>
  )
}

export default RemindDatesContent
