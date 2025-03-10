import CardButtons from '@components/CardButtons'
import CardWrapper from '@components/CardWrapper'
import TextInRing from '@components/TextInRing'
import modalsFuncAtom from '@state/modalsFuncAtom'
import directionsAtom from '@state/atoms/directionsAtom'
import itemsFuncAtom from '@state/itemsFuncAtom'
import loadingAtom from '@state/atoms/loadingAtom'
import directionFullSelectorAsync from '@state/selectors/directionFullSelectorAsync'
import { useAtomValue } from 'jotai'
import snackbarAtom from '@state/atoms/snackbarAtom'
import individualWeddingsSelector from '@state/async/individualWeddingsSelector'
import formatDateTime from '@helpers/formatDateTime'
import userSelector from '@state/selectors/userSelector'
import getUserFullName from '@helpers/getUserFullName'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMars, faVenus } from '@fortawesome/free-solid-svg-icons'
import UserRelationshipIcon from '@components/UserRelationshipIcon'

const IndividualWeddingCard = ({
  individualWeddingId,
  hidden = false,
  style,
  loading,
}) => {
  const modalsFunc = useAtomValue(modalsFuncAtom)
  const individualWedding = useAtomValue(
    individualWeddingsSelector(individualWeddingId)
  )
  const user = useAtomValue(userSelector(individualWedding?.userId))

  return (
    <CardWrapper
      flex={false}
      loading={loading}
      onClick={() =>
        !loading &&
        modalsFunc.individualWedding.view({
          individualWeddingId,
          title: `Результат подбора кандидатов для\n"${getUserFullName(user)}"`,
        })
      }
      hidden={hidden}
      style={style}
      className="flex items-center justify-between px-1 py-[1px] border-l border-r rounded-md"
    >
      <div className="text-sm tablet:text-base">
        {formatDateTime(individualWedding.createdAt)}
      </div>
      <div className="flex gap-x-1">
        <div className="flex mt-0.5 gap-x-0.5">
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
          {individualWedding?.usersFilter?.relationship?.noPartner && (
            <UserRelationshipIcon relationship={false} />
          )}
          {individualWedding?.usersFilter?.relationship?.havePartner && (
            <UserRelationshipIcon relationship />
          )}
        </div>
      </div>
    </CardWrapper>
  )
}

export default IndividualWeddingCard
