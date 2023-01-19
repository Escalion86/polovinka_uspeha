import React, { useEffect, useState } from 'react'
import useErrors from '@helpers/useErrors'
import { useRecoilValue } from 'recoil'
import itemsFuncAtom from '@state/atoms/itemsFuncAtom'
import reviewSelector from '@state/selectors/reviewSelector'

import CheckBox from '@components/CheckBox'
import Textarea from '@components/Textarea'
import Input from '@components/Input'
import FormWrapper from '@components/FormWrapper'
import ErrorsList from '@components/ErrorsList'
import { DEFAULT_REVIEW } from '@helpers/constants'

const reviewFunc = (reviewId, clone = false) => {
  const ReviewModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
  }) => {
    const review = useRecoilValue(reviewSelector(reviewId))
    const setReview = useRecoilValue(itemsFuncAtom).review.set

    const [author, setAuthor] = useState(
      review?.author ?? DEFAULT_REVIEW.author
    )
    const [authorAge, setAuthorAge] = useState(
      review?.authorAge ?? DEFAULT_REVIEW.authorAge
    )
    const [reviewText, setReviewText] = useState(
      review?.review ?? DEFAULT_REVIEW.review
    )
    const [showOnSite, setShowOnSite] = useState(
      review?.showOnSite ?? DEFAULT_REVIEW.showOnSite
    )
    const [errors, checkErrors, addError, removeError, clearErrors] =
      useErrors()

    // const router = useRouter()

    // const refreshPage = () => {
    //   router.replace(router.asPath)
    // }

    const onClickConfirm = async () => {
      if (!checkErrors({ author, reviewText })) {
        closeModal()
        setReview(
          {
            _id: review?._id,
            author,
            authorAge,
            review: reviewText,
            showOnSite,
          },
          clone
        )
        // if (review && !clone) {
        //   await putData(
        //     `/api/reviews/${review._id}`,
        //     {
        //       author,
        //       authorAge,
        //       review: reviewText,
        //       showOnSite,
        //     },
        //     refreshPage
        //   )
        // } else {
        //   await postData(
        //     `/api/reviews`,
        //     {
        //       author,
        //       authorAge,
        //       review: reviewText,
        //       showOnSite,
        //     },
        //     refreshPage
        //   )
        // }
      }
    }

    useEffect(() => {
      const isFormChanged =
        review?.author !== author ||
        review?.review !== reviewText ||
        review?.authorAge !== authorAge ||
        review?.showOnSite !== showOnSite

      setOnConfirmFunc(onClickConfirm)
      setOnShowOnCloseConfirmDialog(isFormChanged)
      setDisableConfirm(!isFormChanged)
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
        />
        {/* <EditableTextarea
                label="Отзыв"
                html={reviewText}
                uncontrolled={false}
                onChange={(value) => {
                  removeError('reviewText')
                  setReviewText(value)
                }}
                placeholder="Текст отзыва..."
                required
                error={errors.reviewText}
              /> */}
        <CheckBox
          checked={showOnSite}
          labelPos="left"
          // labelClassName="w-40"
          onClick={() => setShowOnSite((checked) => !checked)}
          label="Показывать на сайте"
        />
        <ErrorsList errors={errors} />
      </FormWrapper>
    )
  }

  return {
    title: `${reviewId && !clone ? 'Редактирование' : 'Создание'} отзыва`,
    confirmButtonName: reviewId && !clone ? 'Применить' : 'Создать',
    Children: ReviewModal,
  }
}

export default reviewFunc
