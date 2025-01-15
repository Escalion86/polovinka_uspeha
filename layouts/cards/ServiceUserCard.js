import CardButtons from '@components/CardButtons'
import { CardWrapper } from '@components/CardWrapper'
import { UserItem } from '@components/ItemCards'
import PriceDiscount from '@components/PriceDiscount'
import QuestionnaireAnswersFill from '@components/QuestionnaireAnswersFill'
import TextLinesLimiter from '@components/TextLinesLimiter'
import formatDateTime from '@helpers/formatDateTime'
import modalsFuncAtom from '@state/atoms/modalsFuncAtom'
import errorAtom from '@state/atoms/errorAtom'
import itemsFuncAtom from '@state/atoms/itemsFuncAtom'
import loadingAtom from '@state/atoms/loadingAtom'
import loggedUserActiveAtom from '@state/atoms/loggedUserActiveAtom'
import loggedUserActiveRoleSelector from '@state/selectors/loggedUserActiveRoleSelector'
import serviceSelector from '@state/selectors/serviceSelector'
import servicesUsersSelector from '@state/selectors/servicesUsersSelector'
import userSelector from '@state/selectors/userSelector'
import cn from 'classnames'
import { useAtomValue } from 'jotai'

const ServiceUserCard = ({
  serviceUserId,
  hidden = false,
  style,
  showUser,
}) => {
  const modalsFunc = useAtomValue(modalsFuncAtom)
  const loggedUserActiveRole = useAtomValue(loggedUserActiveRoleSelector)

  const servicesUsersEdit = loggedUserActiveRole?.servicesUsers?.edit

  const loggedUserActive = useAtomValue(loggedUserActiveAtom)

  const serviceUser = useAtomValue(servicesUsersSelector(serviceUserId))
  if (!serviceUser) return null

  const loading = useAtomValue(loadingAtom('serviceUser' + serviceUserId))
  const error = useAtomValue(errorAtom('serviceUser' + serviceUserId))
  const itemsFunc = useAtomValue(itemsFuncAtom)
  const user = useAtomValue(userSelector(serviceUser.userId))
  const service = useAtomValue(serviceSelector(serviceUser.serviceId))

  return (
    <CardWrapper
      loading={loading}
      error={error}
      onClick={() => !loading && modalsFunc.serviceUser.view(serviceUserId)}
      // showOnSite={event.showOnSite}
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
          {/* <div className="flex-1 px-2 py-1 text-lg font-bold text-general">
            {service?.title ?? '[услуга не найдена]'}
          </div> */}
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
            <UserItem item={user} />
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
              <PriceDiscount item={service} priceForStatus={user.status} />
            </>
          )}
        </div>
      </div>
    </CardWrapper>
  )
}

export default ServiceUserCard
