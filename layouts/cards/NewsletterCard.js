import CardButtons from '@components/CardButtons'
import CardWrapper from '@components/CardWrapper'
import TextLinesLimiter from '@components/TextLinesLimiter'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import formatDateTime from '@helpers/formatDateTime'
// import { getNounMessages } from '@helpers/getNoun'
import loadingAtom from '@state/atoms/loadingAtom'
import modalsFuncAtom from '@state/modalsFuncAtom'
import { useAtomValue } from 'jotai'
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck'
// import { faCheckDouble } from '@fortawesome/free-solid-svg-icons/faCheckDouble'
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes'
import { faClock } from '@fortawesome/free-regular-svg-icons/faClock'
import SvgSigma from '@svg/SvgSigma'
import LoadingSpinner from '@components/LoadingSpinner'
import { useMemo } from 'react'
import {
  NEWSLETTER_SEND_MODES,
  NEWSLETTER_SENDING_STATUS_LABELS,
  NEWSLETTER_SENDING_STATUSES,
} from '@helpers/constantsNewsletters'
// import serverSettingsAtom from '@state/atoms/serverSettingsAtom'
// import { useAtomValue } from 'jotai'
// import { Suspense } from 'react'
// import UserCardSkeleton from './Skeletons/UserCardSkeleton'

const STATUS_BADGE_CLASSES = {
  [NEWSLETTER_SENDING_STATUSES.DRAFT]: 'bg-yellow-100 text-yellow-800',
  [NEWSLETTER_SENDING_STATUSES.WAITING]: 'bg-blue-100 text-blue-800',
  [NEWSLETTER_SENDING_STATUSES.SENT]: 'bg-green-100 text-green-800',
}

const NewsletterCard = ({ newsletter, style }) => {
  // const serverDate = new Date(useAtomValue(serverSettingsAtom)?.dateTime)
  const modalsFunc = useAtomValue(modalsFuncAtom)
  const newsletterId = newsletter?._id
  const loading = useAtomValue(loadingAtom('newsletter' + newsletterId))
  const loadingStatusMessages = useAtomValue(
    loadingAtom('newsletterStatusMessages' + newsletterId)
  )

  if (!newsletter) return null

  const sendTypeTitles = {
    both: 'Whatsapp и Telegram',
    'telegram-first': 'Сначала Telegram, если ошибка — Whatsapp',
    'whatsapp-only': 'Только Whatsapp',
    'telegram-only': 'Только Telegram',
  }

  const sendType = newsletter.sendType || 'whatsapp-only'

  const statuses = useMemo(() => {
    const temp = {}
    newsletter.newsletters.forEach(({ whatsappStatus, telegramSuccess }) => {
      if (sendType !== 'whatsapp-only' && telegramSuccess) {
        temp.read = temp.read ? temp.read + 1 : 1
      } else if (
        ['read', 'sent', 'delivered', 'pending'].includes(whatsappStatus)
      ) {
        temp[whatsappStatus] ? temp[whatsappStatus] + 1 : 1
      } else if (!whatsappStatus) {
        temp.pending = temp.pending ? temp.pending + 1 : 1
      } else {
        temp.other = temp.other ? temp.other + 1 : 1
      }
    })
    return temp
  }, [newsletter.newsletters])

  const sendingStatusValue =
    newsletter.sendingStatus ||
    (newsletter.status === 'active' ? NEWSLETTER_SENDING_STATUSES.SENT : null)
  const sendingStatusLabel =
    sendingStatusValue && NEWSLETTER_SENDING_STATUS_LABELS[sendingStatusValue]
  const sendingStatusClass =
    STATUS_BADGE_CLASSES[sendingStatusValue] || 'bg-gray-100 text-gray-600'

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
        <div className="flex items-center justify-between w-full min-w-full gap-2">
          <TextLinesLimiter
            className="flex flex-1 font-bold text-general"
            textCenter={false}
          >
            {newsletter.name || '[без названия]'}
          </TextLinesLimiter>
          {sendingStatusLabel && (
            <span
              className={`px-2 py-0.5 text-xs font-semibold rounded-full whitespace-nowrap ${sendingStatusClass}`}
            >
              {sendingStatusLabel}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between w-full min-w-full">
          <div className="text-sm text-gray-600">
            {sendTypeTitles[sendType] || 'Тип не указан'}
          </div>
          <div className="text-sm leading-4 whitespace-nowrap">
            <span className="text-gray-600">Дата отправки: </span>
            {formatDateTime(
              newsletter.sendMode === NEWSLETTER_SEND_MODES.SCHEDULED
                ? newsletter.plannedSendDate + ' ' + newsletter.plannedSendTime
                : newsletter.createdAt,
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
        {/* {newsletter.sendMode === NEWSLETTER_SEND_MODES.SCHEDULED && (
          <div className="text-xs text-gray-500">
            План: {newsletter.plannedSendDate || '-'}{' '}
            {newsletter.plannedSendTime || ''}
          </div>
        )} */}
        <div className="flex flex-wrap items-center gap-x-5">
          <div className="flex items-center gap-x-1">
            <FontAwesomeIcon className="w-5 h-5 text-success" icon={faCheck} />
            {loadingStatusMessages ? (
              <LoadingSpinner size="xxs" />
            ) : (
              (statuses.read || 0) +
              (statuses.delivered || 0) +
              (statuses.sent || 0)
            )}
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
            {loadingStatusMessages ? (
              <LoadingSpinner size="xxs" />
            ) : (
              statuses.other || '0'
            )}
          </div>
          {statuses.pending && (
            <div className="flex items-center gap-x-1">
              <FontAwesomeIcon
                className="w-5 h-5 text-gray-600"
                icon={faClock}
              />
              {loadingStatusMessages ? (
                <LoadingSpinner size="xxs" />
              ) : (
                statuses.pending
              )}
            </div>
          )}
          <div className="flex items-center gap-x-1">
            <div className="w-5 h-5 min-w-5">
              <SvgSigma className="fill-general" />
            </div>
            {loadingStatusMessages ? (
              <LoadingSpinner size="xxs" />
            ) : (
              newsletter.newsletters?.length || '0'
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
