'use client'

import Button from '@components/Button'
import ErrorsList from '@components/ErrorsList'
import FormWrapper from '@components/FormWrapper'
import LoadingSpinner from '@components/LoadingSpinner'
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus'
import { getData, postData } from '@helpers/CRUD'
import formatDate from '@helpers/formatDate'
import { modalsFuncAtom } from '@state/atoms'
import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'
import { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'

const RemindDatesContent = (props) => {
  const modalsFunc = useRecoilValue(modalsFuncAtom)
  const loggedUserActive = useRecoilValue(loggedUserActiveAtom)

  const [dates, setDates] = useState([])

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadTemplates = async () => {
      const response = await getData('/api/reminddates')
      setDates(response)
      setIsLoading(false)
    }
    loadTemplates()
  }, [])

  if (isLoading) return <LoadingSpinner />

  const onClickAdd = async (name, date) => {
    modalsFunc.remindDate({ name, date }, async (remindDate) => {
      await postData(
        `/api/reminddates`,
        remindDate,
        (data) => {
          setDates((state) => [...state, data])
          setIsLoading(false)
        },
        () => {
          setIsLoading(false)
        },
        false,
        loggedUserActive?._id
      )
    })
  }

  return (
    <div className="flex flex-col flex-1 h-screen px-1 my-1">
      {dates.map(({ name, date }) => (
        <div className="flex p-1 cursor-pointer hover:bg-blue-200 items-center [&:not(:first-child)]:border-t border-gray-500">
          <div className="flex-1 text-general">{name}</div>
          <div>{formatDate(date)}</div>
        </div>
      ))}
      <Button name="Добавить" icon={faPlus} onClick={() => onClickAdd()} />
    </div>
  )
}

export default RemindDatesContent
