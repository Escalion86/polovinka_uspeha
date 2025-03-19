import CardButtons from '@components/CardButtons'
import CardWrapper from '@components/CardWrapper'
import TextLinesLimiter from '@components/TextLinesLimiter'
import formatDateTime from '@helpers/formatDateTime'
import { getNounMessages } from '@helpers/getNoun'
import modalsFuncAtom from '@state/modalsFuncAtom'
import newsletterCutedSelector from '@state/selectors/newsletterCutedSelector'
import { useAtomValue } from 'jotai'
// import serverSettingsAtom from '@state/atoms/serverSettingsAtom'
// import { useAtomValue } from 'jotai'
// import { Suspense } from 'react'
// import UserCardSkeleton from './Skeletons/UserCardSkeleton'

const NewsletterCard = ({ newsletterId, style }) => {
  // const serverDate = new Date(useAtomValue(serverSettingsAtom)?.dateTime)
  const modalsFunc = useAtomValue(modalsFuncAtom)
  const newsletter = useAtomValue(newsletterCutedSelector(newsletterId))

  return (
    <CardWrapper
      // loading={loading}
      onClick={() => modalsFunc.newsletter.view(newsletter._id)}
      // hidden={hidden}
      style={style}
      className="flex items-center px-1"
      flex={false}
    >
      <div className="flex-1">
        <div className="flex items-center justify-between w-full min-w-full">
          <TextLinesLimiter
            className="flex w-full font-bold text-general"
            textCenter={false}
          >
            {newsletter.name || '[без названия]'}
          </TextLinesLimiter>
        </div>
        <div className="flex items-center justify-between w-full min-w-full">
          <div className="w-full">
            Отправлено: {getNounMessages(newsletter.newsletters?.length || 0)}
          </div>{' '}
          <div className="text-sm leading-4 whitespace-nowrap">
            {formatDateTime(
              newsletter.createdAt,
              false,
              false,
              true,
              false,
              false,
              true,
              true
            )}
          </div>
        </div>
      </div>
      <CardButtons
        item={newsletter}
        typeOfItem="newsletter"
        alwaysCompact
        // {...cardButtonsProps}
      />
    </CardWrapper>
  )
}

// const NewsletterCardWrapper = (props) => (
//   <Suspense fallback={<UserCardSkeleton {...props} />}>
//     <NewsletterCardWrapper {...props} />
//   </Suspense>
// )

export default NewsletterCard
