import CardButtons from '@components/CardButtons'
import CardWrapper from '@components/CardWrapper'
import TextLinesLimiter from '@components/TextLinesLimiter'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import formatDateTime from '@helpers/formatDateTime'
// import { getNounMessages } from '@helpers/getNoun'
import loadingAtom from '@state/atoms/loadingAtom'
import modalsFuncAtom from '@state/modalsFuncAtom'
import newsletterCutedSelector from '@state/selectors/newsletterCutedSelector'
import { useAtomValue } from 'jotai'
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck'
// import { faCheckDouble } from '@fortawesome/free-solid-svg-icons/faCheckDouble'
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes'
import { faClock } from '@fortawesome/free-regular-svg-icons/faClock'
import SvgSigma from '@svg/SvgSigma'
// import serverSettingsAtom from '@state/atoms/serverSettingsAtom'
// import { useAtomValue } from 'jotai'
// import { Suspense } from 'react'
// import UserCardSkeleton from './Skeletons/UserCardSkeleton'

const NewsletterCard = ({ newsletterId, style }) => {
  // const serverDate = new Date(useAtomValue(serverSettingsAtom)?.dateTime)
  const modalsFunc = useAtomValue(modalsFuncAtom)
  const newsletter = useAtomValue(newsletterCutedSelector(newsletterId))
  const loading = useAtomValue(loadingAtom('newsletter' + newsletterId))

  const statuses = {}
  newsletter.newsletters.forEach(({ whatsappStatus }) => {
    if (['read', 'sent', 'delivered', 'pending'].includes(whatsappStatus)) {
      statuses[whatsappStatus] = statuses[whatsappStatus]
        ? statuses[whatsappStatus] + 1
        : 1
    } else if (!whatsappStatus) {
      statuses.pending = statuses.pending ? statuses.pending + 1 : 1
    } else {
      statuses.other = statuses.other ? statuses.other + 1 : 1
    }
  })

  return (
    <CardWrapper
      loading={loading}
      onClick={() => modalsFunc.newsletter.view(newsletter._id)}
      // hidden={hidden}
      style={style}
      className="flex items-center px-1"
      flex={false}
    >
      <div className="flex-1 flex flex-col gap-y-0.5">
        <div className="flex items-center justify-between w-full min-w-full">
          <TextLinesLimiter
            className="flex w-full font-bold text-general"
            textCenter={false}
          >
            {newsletter.name || '[без названия]'}
          </TextLinesLimiter>
        </div>
        <div className="flex items-center justify-between w-full min-w-full">
          {/* <div className="w-full">
            Отправлено: {getNounMessages(newsletter.newsletters?.length || 0)}
          </div>{' '} */}
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
        <div className="flex flex-wrap items-center gap-x-5">
          <div className="flex items-center gap-x-1">
            <FontAwesomeIcon className="w-5 h-5 text-success" icon={faCheck} />
            {(statuses.read || 0) +
              (statuses.delivered || 0) +
              (statuses.sent || 0)}
          </div>
          {/* <div className="flex items-center gap-x-1">
            <FontAwesomeIcon
              className="w-5 h-5 text-success"
              icon={faCheckDouble}
            />
            {statuses.read || '0'}
          </div> */}
          {/* <div className="flex items-center gap-x-1">
            <FontAwesomeIcon
              className="w-5 h-5 text-gray-600"
              icon={faCheckDouble}
            />
            {statuses.delivered || '0'}
          </div>
          <div className="flex items-center gap-x-1">
            <FontAwesomeIcon className="w-5 h-5 text-gray-600" icon={faCheck} />
            {statuses.sent || '0'}
          </div> */}

          <div className="flex items-center gap-x-1">
            <FontAwesomeIcon className="w-5 h-5 text-danger" icon={faTimes} />
            {statuses.other || '0'}
          </div>
          {statuses.pending && (
            <div className="flex items-center gap-x-1">
              <FontAwesomeIcon
                className="w-5 h-5 text-gray-600"
                icon={faClock}
              />
              {statuses.pending}
            </div>
          )}
          <div className="flex items-center gap-x-1">
            <div className="w-5 h-5 min-w-5">
              <SvgSigma className="fill-general" />
            </div>
            {newsletter.newsletters?.length || '0'}
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
