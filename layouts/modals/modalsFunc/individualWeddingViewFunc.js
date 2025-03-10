import CheckBox from '@components/CheckBox'
import EditableTextarea from '@components/EditableTextarea'
import ErrorsList from '@components/ErrorsList'
import FormWrapper from '@components/FormWrapper'
import Input from '@components/Input'
// import InputImage from '@components/InputImage'
import Textarea from '@components/Textarea'
import { DEFAULT_DIRECTION } from '@helpers/constants'
import useErrors from '@helpers/useErrors'
import itemsFuncAtom from '@state/itemsFuncAtom'
import directionFullSelectorAsync from '@state/selectors/directionFullSelectorAsync'
import { useEffect, useMemo, useState } from 'react'
import { useAtomValue } from 'jotai'
import TabContext from '@components/Tabs/TabContext'
import TabPanel from '@components/Tabs/TabPanel'
import ComboBox from '@components/ComboBox'
import compareObjects from '@helpers/compareObjects'
import CardButtons from '@components/CardButtons'
import serviceSelector from '@state/selectors/serviceSelector'
import servicesUsersFullByServiceIdSelector from '@state/selectors/servicesUsersFullByServiceIdSelector'
import userSelector from '@state/selectors/userSelector'
import UsersFilter from '@components/Filter/UsersFilter'
import ContentHeader from '@components/ContentHeader'
import Note from '@components/Note'
import { getNounUsers } from '@helpers/getNoun'
import getUserFullName from '@helpers/getUserFullName'
import formatDate from '@helpers/formatDate'
import { postData } from '@helpers/CRUD'
import locationAtom from '@state/atoms/locationAtom'
import Latex from 'react-latex-next'
import InputWrapper from '@components/InputWrapper'
import modalsFuncAtom from '@state/modalsFuncAtom'
import { SelectUserList } from '@components/SelectItemList'
import individualWeddingsSelector from '@state/async/individualWeddingsSelector'
import { faIdCard } from '@fortawesome/free-regular-svg-icons/faIdCard'
import formatDateTime from '@helpers/formatDateTime'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMars, faVenus } from '@fortawesome/free-solid-svg-icons'
import Image from 'next/image'
import UserRelationshipIcon from '@components/UserRelationshipIcon'

const individualWeddingViewFunc = ({ individualWeddingId, title }) => {
  const IndividualWeddingViewModal = ({
    closeModal,
    setOnConfirmFunc,
    setOnDeclineFunc,
    setOnShowOnCloseConfirmDialog,
    setDisableConfirm,
    setDisableDecline,
    setTopLeftComponent,
  }) => {
    const modalsFunc = useAtomValue(modalsFuncAtom)
    const individualWedding = useAtomValue(
      individualWeddingsSelector(individualWeddingId)
    )
    const user = useAtomValue(userSelector(individualWedding?.userId))

    const serviceId = '6421df68fa505d8e86b92166'
    const servicesUsers = useAtomValue(
      servicesUsersFullByServiceIdSelector(serviceId)
    )

    //     userId
    // aiResponse
    // usersFilter
    // allCandidatesIds
    // chosenCandidatesIds

    const [filter, setFilter] = useState({
      gender: {
        male: user?.gender !== 'male',
        famale: user?.gender !== 'famale',
        // null: true,
      },
      status: {
        novice: true,
        member: true,
      },
      relationship: {
        havePartner: false,
        noPartner: true,
      },
    })

    return (
      <div>
        <div className="flex justify-center w-full">
          Дата подбора: {formatDateTime(individualWedding?.createdAt)}
        </div>
        <InputWrapper label="Фильтр" wrapperClassName="flex-col">
          <div className="flex gap-x-1">
            <div>Пол:</div>
            {individualWedding?.usersFilter?.gender?.male && (
              <FontAwesomeIcon
                icon={faMars}
                className="w-5 h-5 text-blue-600 laptop:w-6 laptop:h-6"
              />
            )}
            {individualWedding?.usersFilter?.gender?.famale && (
              <FontAwesomeIcon
                icon={faVenus}
                className="w-5 h-5 text-red-600 laptop:w-6 laptop:h-6"
              />
            )}
          </div>
          <div className="flex gap-x-1">
            <div>Статус:</div>
            {individualWedding?.usersFilter?.status?.novice && (
              <div className="w-5 h-5 grayscale brightness-150 contrast-75 ">
                <Image
                  alt="member"
                  src="/img/svg_icons/medal.svg"
                  width="20"
                  height="20"
                  style={{ width: 'auto', height: 'auto' }}
                />
              </div>
            )}
            {individualWedding?.usersFilter?.status?.member && (
              <div className="w-5 h-5">
                <Image
                  alt="member"
                  src="/img/svg_icons/medal.svg"
                  width="20"
                  height="20"
                  style={{ width: 'auto', height: 'auto' }}
                />
              </div>
            )}
          </div>
          <div className="flex gap-x-1">
            <div>Статус отношений:</div>
            {individualWedding?.usersFilter?.relationship?.noPartner && (
              <UserRelationshipIcon relationship={false} />
            )}
            {individualWedding?.usersFilter?.relationship?.havePartner && (
              <UserRelationshipIcon relationship />
            )}
          </div>
        </InputWrapper>
        <div>
          Всего кандидатов: {individualWedding?.allCandidatesIds?.length} чел.
        </div>
        {individualWedding?.chosenCandidatesIds?.length > 0 && (
          <InputWrapper
            label="Выбранные кандидаты"
            className="w-full"
            wrapperClassName="flex-col min-h-full w-full flex items-stretch"
          >
            <SelectUserList
              // key={id}
              readOnly
              showCounter={false}
              usersId={individualWedding.chosenCandidatesIds}
              buttons={[
                (id) => ({
                  onClick: () => {
                    const seriviceUser = servicesUsers.find(
                      ({ userId }) => userId === id
                    )
                    modalsFunc.serviceUser.view(
                      seriviceUser._id,
                      true,
                      `Анкета кандидата "${getUserFullName(seriviceUser.user)}"`
                    )
                    // modalsFunc.questionnaire.open(
                    //   service.questionnaire,
                    //   seriviceUser.answers,
                    //   undefined,
                    //   `Анкета кандидата "${getUserFullName(seriviceUser.user)}"`
                    // )
                  },
                  icon: faIdCard,
                  iconClassName: 'text-purple-600',
                  tooltip: 'Анкета',
                  // text,
                  // textClassName,
                  // thin,
                }),
              ]}
            />
          </InputWrapper>
        )}
        {individualWedding?.aiResponse && (
          <InputWrapper
            label="Результат"
            className="flex-1"
            wrapperClassName="flex-col"
          >
            <div className="w-full max-h-full">
              <Latex displayMode={true}>{individualWedding.aiResponse}</Latex>
            </div>
          </InputWrapper>
        )}
      </div>
    )
  }

  return {
    title: title ?? `Результат подбора кандидатов`,
    // confirmButtonName: 'Начать подбор',
    Children: IndividualWeddingViewModal,
  }
}

export default individualWeddingViewFunc
