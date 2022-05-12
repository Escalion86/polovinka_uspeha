import CheckBox from '@components/CheckBox'
import Textarea from '@components/Textarea'
import Input from '@components/Input'
import { postData, putData } from '@helpers/CRUD'
import useErrors from '@helpers/useErrors'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import FormWrapper from '@components/FormWrapper'
import ErrorsList from '@components/ErrorsList'

const reviewFunc = (review, clone = false) => {
  const ReviewModal = ({ closeModal, setOnConfirmFunc, setOnDeclineFunc }) => {
    const [author, setAuthor] = useState(review ? review.author : '')
    const [authorAge, setAuthorAge] = useState(review ? review.authorAge : 0)
    const [reviewText, setReviewText] = useState(review ? review.review : '')
    const [showOnSite, setShowOnSite] = useState(
      review ? review.showOnSite : true
    )
    const [errors, addError, removeError, clearErrors] = useErrors()
    console.log('showOnSite', showOnSite)

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
        if (review && !clone) {
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
    }, [author, reviewText, authorAge, showOnSite])

    return (
      // <div className="flex flex-col gap-2">
      <FormWrapper>
        <Input
          label="Имя автора"
          type="text"
          value={author}
          onChange={(value) => {
            removeError('author')
            setAuthor(value)
          }}
          // labelClassName="w-40"
          error={errors.author}
          forGrid
        />
        <Input
          label="Возраст автора, лет"
          type="number"
          value={authorAge}
          onChange={(value) => {
            removeError('authorAge')
            setAuthorAge(value)
          }}
          // labelClassName="w-40"
          error={errors.authorAge}
          forGrid
        />
        <Textarea
          label="Отзыв"
          type="text"
          value={reviewText}
          onChange={(value) => {
            removeError('reviewText')
            setReviewText(value)
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
        <ErrorsList errors={errors} />
      </FormWrapper>
    )
  }

  return {
    title: `${review && !clone ? 'Редактирование' : 'Создание'} отзыва`,
    confirmButtonName: review && !clone ? 'Применить' : 'Создать',
    Children: ReviewModal,
  }
}

export default reviewFunc
