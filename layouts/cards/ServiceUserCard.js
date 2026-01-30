import CardButtons from '@components/CardButtons'
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
    >
      <div className={cn('flex flex-col w-full')}>
        <div className="flex w-full">
          <TextLinesLimiter
            className="flex-1 px-2 py-1 text-base font-bold tablet:text-lg text-general"
            lines={1}
            textCenter={false}
          >
            {service?.title ?? '[неизвестная услуга]'}
          </TextLinesLimiter>
          <CardButtons
            item={serviceUser}
            typeOfItem="serviceUser"
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
          <div className="flex-1 border-t border-gray-400">
            <UserItem item={user} userId={serviceUser.userId} />
          </div>
        )}
        <div className="flex gap-x-2 items-center py-0.5 px-1 h-10 border-t border-gray-400">
          {service && (
            <>
              <div className="flex-1 text-sm">
                {formatDateTime(serviceUser?.createdAt)}
              </div>
              {serviceUser.status === 'active' ? (
                <QuestionnaireAnswersFill
                  answers={serviceUser.answers}
                  questionnaireData={service.questionnaire?.data}
                  small
                />
              ) : serviceUser.status === 'closed' ? (
                <div className="font-bold text-success">ИСПОЛНЕНО</div>
              ) : (
                <div className="font-bold text-danger">ОТМЕНЕНО</div>
              )}
              {user && (
                <PriceDiscount item={service} priceForStatus={user.status} />
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
