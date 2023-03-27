import React from 'react'
import { modalsFuncAtom } from '@state/atoms'
import { useRecoilValue } from 'recoil'
import loadingAtom from '@state/atoms/loadingAtom'
import itemsFuncAtom from '@state/atoms/itemsFuncAtom'
import CardButtons from '@components/CardButtons'
import { CardWrapper } from '@components/CardWrapper'
import errorAtom from '@state/atoms/errorAtom'
import servicesUsersSelector from '@state/selectors/servicesUsersSelector'
import { UserItem } from '@components/ItemCards'
import userSelector from '@state/selectors/userSelector'
import serviceSelector from '@state/selectors/serviceSelector'
import QuestionnaireAnswersFill from '@components/QuestionnaireAnswersFill'

const ServiceUserCard = ({
  serviceUserId,
  noButtons,
  hidden = false,
  style,
}) => {
  const modalsFunc = useRecoilValue(modalsFuncAtom)
  const serviceUser = useRecoilValue(servicesUsersSelector(serviceUserId))
  if (!serviceUser) return null

  const loading = useRecoilValue(loadingAtom('serviceUser' + serviceUserId))
  const error = useRecoilValue(errorAtom('serviceUser' + serviceUserId))
  const itemsFunc = useRecoilValue(itemsFuncAtom)
  const user = useRecoilValue(userSelector(serviceUser.userId))
  const service = useRecoilValue(serviceSelector(serviceUser.serviceId))

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
      <div className="flex flex-col w-full">
        <div className="flex">
          <div className="flex-1 px-2 py-1 text-lg font-bold text-general">
            {service.title}
          </div>
          <CardButtons
            item={serviceUser}
            typeOfItem="serviceUser"
            onEditQuestionnaire={
              service.questionnaire && serviceUser.status !== 'closed'
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

        <div className="flex items-center pr-1 border-t border-gray-400">
          <div className="flex-1">
            <UserItem item={user} />
          </div>
          <QuestionnaireAnswersFill
            answers={serviceUser.answers}
            questionnaireData={service.questionnaire?.data}
            small
          />
        </div>
      </div>
    </CardWrapper>
  )
}

export default ServiceUserCard
