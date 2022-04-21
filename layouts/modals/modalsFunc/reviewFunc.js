import CheckBox from '@components/CheckBox'
import Textarea from '@components/Textarea'
import Input from '@components/Input'
import { postData, putData } from '@helpers/CRUD'
import useErrors from '@helpers/useErrors'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import FormWrapper from '@components/FormWrapper'

const reviewFunc = (review) => {
  const isEditing = !!review

  const ReviewModal = ({ closeModal, setOnConfirmFunc, setOnDeclineFunc }) => {
    const [author, setAuthor] = useState(isEditing ? review.author : '')
    const [authorAge, setAuthorAge] = useState(isEditing ? review.authorAge : 0)
    const [reviewText, setReviewText] = useState(isEditing ? review.review : '')
    const [showOnSite, setShowOnSite] = useState(
      isEditing ? review.showOnSite : true
    )
    const [errors, addError, removeError, clearErrors] = useErrors()

    const router = useRouter()

    const refreshPage = () => {
      router.replace(router.asPath)
    }

    const onClickConfirm = async () => {
      let error = false
      if (!author) {
        addError({ author: 'Необходимо ввести имя автора' })
        error = true
      }
      if (!reviewText) {
        addError({ reviewText: 'Необходимо ввести текст отзыва' })
        error = true
      }
      if (!error) {
        if (isEditing) {
          await putData(
            `/api/reviews/${review._id}`,
            {
              author,
              authorAge,
              review: reviewText,
              showOnSite,
            },
            refreshPage
          )
        } else {
          await postData(
            `/api/reviews`,
            {
              author,
              authorAge,
              review: reviewText,
              showOnSite,
            },
            refreshPage
          )
        }
        closeModal()
      }
    }

    useEffect(() => {
      setOnConfirmFunc(onClickConfirm)
    }, [author, reviewText, authorAge])

    return (
      // <div className="flex flex-col gap-2">
      <FormWrapper>
        <Input
          label="Имя автора"
          type="text"
          value={author}
          onChange={(e) => {
            removeError('author')
            setAuthor(e.target.value)
          }}
          // labelClassName="w-40"
          error={errors.author}
          forGrid
        />
        <Input
          label="Возраст автора, лет"
          type="number"
          value={authorAge}
          onChange={(e) => {
            removeError('authorAge')
            setAuthorAge(e.target.value)
          }}
          // labelClassName="w-40"
          error={errors.authorAge}
          forGrid
        />
        <Textarea
          label="Отзыв"
          type="text"
          value={reviewText}
          onChange={(e) => {
            removeError('reviewText')
            setReviewText(e.target.value)
          }}
          // labelClassName="w-40"
          error={errors.reviewText}
          forGrid
        />
        <CheckBox
          checked={showOnSite}
          labelPos="left"
          // labelClassName="w-40"
          onClick={() => setShowOnSite((checked) => !checked)}
          label="Показывать на сайте"
          forGrid
        />
        {Object.values(errors).length > 0 && (
          <div className="flex flex-col text-red-500">
            {Object.values(errors).map((error) => (
              <div key={error}>{error}</div>
            ))}
          </div>
        )}
      </FormWrapper>
    )
  }

  return {
    title: `${isEditing ? 'Редактирование' : 'Создание'} отзыва`,
    confirmButtonName: isEditing ? 'Применить' : 'Создать',
    Children: ReviewModal,
  }
}

export default reviewFunc
