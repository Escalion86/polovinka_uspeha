import ServiceUserCardButtons from '@components/cardButtons/ServiceUserCardButtons'
import CardWrapper from '@components/CardWrapper'
import { UserItem } from '@components/ItemCards'
import PriceDiscount from '@components/PriceDiscount'
import QuestionnaireAnswersFill from '@components/QuestionnaireAnswersFill'
import TextLinesLimiter from '@components/TextLinesLimiter'
import formatDateTime from '@helpers/formatDateTime'
import modalsFuncAtom from '@state/modalsFuncAtom'
import errorAtom from '@state/atoms/errorAtom'
import itemsFuncAtom from '@state/itemsFuncAtom'
import loadingAtom from '@state/atoms/loadingAtom'
import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'
import loggedUserActiveRoleSelector from '@state/selectors/loggedUserActiveRoleSelector'
import serviceSelector from '@state/selectors/serviceSelector'
import servicesUsersSelector from '@state/selectors/servicesUsersSelector'
import userSelector from '@state/selectors/userSelector'
import cn from 'classnames'
import { useAtomValue } from 'jotai'

const ServiceUserCardView = ({
  serviceUser,
  user,
  serviceUserId,
  hidden = false,
  style,
  showUser,
}) => {
  const modalsFunc = useAtomValue(modalsFuncAtom)
  const loggedUserActiveRole = useAtomValue(loggedUserActiveRoleSelector)

  const servicesUsersEdit = loggedUserActiveRole?.servicesUsers?.edit

  const loggedUserActive = useAtomValue(loggedUserActiveAtom)

  if (!serviceUser) return null

  const loading = useAtomValue(loadingAtom('serviceUser' + serviceUserId))
  const error = useAtomValue(errorAtom('serviceUser' + serviceUserId))
  const itemsFunc = useAtomValue(itemsFuncAtom)
  const service = useAtomValue(serviceSelector(serviceUser.serviceId))

  return (
    <CardWrapper
      loading={loading}
      error={error}
      onClick={() => !loading && modalsFunc.serviceUser.view(serviceUserId)}
      gap={false}
      hidden={hidden}
      style={style}
      outerClassName="px-3 py-2"
      className="rounded-[24px] border border-[rgba(107,31,42,0.16)] shadow-[0_14px_28px_rgba(0,0,0,0.1)]"
      bgClassName="bg-white/95"
    >
      <div className={cn('flex flex-col w-full h-full overflow-hidden')}>
        <div className="flex items-center w-full px-4 py-2 bg-[linear-gradient(135deg,rgba(107,31,42,0.1),rgba(79,176,232,0.16))]">
          <TextLinesLimiter
            className="flex-1 text-base font-bold tablet:text-lg text-[#4b0f1c]"
            lines={1}
            textCenter={false}
          >
            {service?.title ?? '[неизвестная услуга]'}
          </TextLinesLimiter>
          <ServiceUserCardButtons
            item={serviceUser}
            onEditQuestionnaire={
              service &&
              (servicesUsersEdit ||
                loggedUserActive._id === serviceUser.userId) &&
              service.questionnaire &&
              serviceUser.status !== 'closed'
                ? () =>
                    modalsFunc.questionnaire.open(
                      service.questionnaire,
                      serviceUser.answers,
                      (answers) =>
                        itemsFunc.servicesUser.set({
                          _id: serviceUser._id,
                          answers,
                        })
                    )
                : undefined
            }
          />
        </div>

        {showUser && (
          <div className="flex-1 border-t border-[#f0e5ea]">
            <UserItem item={user} userId={serviceUser.userId} />
          </div>
        )}
        <div className="flex items-center justify-between px-3 py-2 border-t border-[#f0e5ea] gap-x-2">
          {service && (
            <>
              <div className="flex-1 text-xs font-semibold text-[#6b1f2a]/70">
                {formatDateTime(serviceUser?.createdAt)}
              </div>
              <div className="flex items-center gap-x-2">
                {serviceUser.status === 'active' ? (
                  <QuestionnaireAnswersFill
                    answers={serviceUser.answers}
                    questionnaireData={service.questionnaire?.data}
                    small
                  />
                ) : serviceUser.status === 'closed' ? (
                  <span className="inline-flex rounded-full bg-green-500/15 px-3 py-1 text-xs font-semibold text-green-700">
                    ИСПОЛНЕНО
                  </span>
                ) : (
                  <span className="inline-flex rounded-full bg-red-500/15 px-3 py-1 text-xs font-semibold text-red-700">
                    ОТМЕНЕНО
                  </span>
                )}
              </div>
              {user && (
                <div className="inline-flex rounded-full bg-[#f7f1f4] px-3 py-1">
                  <PriceDiscount item={service} priceForStatus={user.status} />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </CardWrapper>
  )
}

const ServiceUserCardFromStore = (props) => {
  const serviceUser = useAtomValue(servicesUsersSelector(props.serviceUserId))
  if (!serviceUser) return null
  const user = useAtomValue(userSelector(serviceUser.userId))
  return <ServiceUserCardView {...props} serviceUser={serviceUser} user={user} />
}

const ServiceUserCard = ({ serviceUser, user, ...props }) => {
  if (serviceUser) {
    return (
      <ServiceUserCardView
        {...props}
        serviceUser={serviceUser}
        serviceUserId={serviceUser._id}
        user={user ?? serviceUser.user}
      />
    )
  }
  return <ServiceUserCardFromStore {...props} />
}

export default ServiceUserCard
