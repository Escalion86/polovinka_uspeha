import CardButtons from '@components/CardButtons'
import { CardWrapper } from '@components/CardWrapper'
import Fab from '@components/Fab'
import TextInRing from '@components/TextInRing'
import { GRADIENT_COLORS } from '@helpers/constants'
import sanitize from '@helpers/sanitize'
import CardListWrapper from '@layouts/wrappers/CardListWrapper'

import { modalsFuncAtom } from '@state/atoms'
import directionsAtom from '@state/atoms/directionsAtom'
import itemsFuncAtom from '@state/atoms/itemsFuncAtom'
import loadingAtom from '@state/atoms/loadingAtom'
import directionSelector from '@state/selectors/directionSelector'
import Image from 'next/image'
import { useRecoilValue } from 'recoil'

const DirectionCard = ({ directionId }) => {
  const modalsFunc = useRecoilValue(modalsFuncAtom)
  const direction = useRecoilValue(directionSelector(directionId))
  const loading = useRecoilValue(loadingAtom('direction' + directionId))
  const itemFunc = useRecoilValue(itemsFuncAtom)

  return (
    <CardWrapper
      loading={loading}
      onClick={() => !loading && modalsFunc.direction.edit(direction._id)}
      showOnSite={direction.showOnSite}
    >
      {direction?.image ? (
        // <div className="flex justify-center w-full tablet:w-auto">
        <img
          className="object-cover h-full max-w-full tablet:w-48 tablet:max-w-48 max-h-60 tablet:max-h-72"
          src={direction.image}
          alt="direction"
          // width={48}
          // height={48}
        />
      ) : (
        // </div>
        <div className="flex justify-center w-full laptop:w-auto">
          <TextInRing text={direction.title} />
        </div>
      )}
      <div className="w-full">
        <div className="flex">
          <div className="flex-1 px-2 py-1 text-xl font-bold ">
            {direction.title}
          </div>
          <CardButtons
            item={direction}
            typeOfItem="direction"
            showOnSiteOnClick={() => {
              itemFunc.direction.set({
                _id: direction._id,
                showOnSite: !direction.showOnSite,
              })
            }}
          />
        </div>
        {/* <div>{direction.description}</div> */}
        <div
          className="px-2 py-1 text-sm textarea"
          dangerouslySetInnerHTML={{ __html: sanitize(direction.description) }}
        />
      </div>
    </CardWrapper>
  )
}

const DirectionsContent = () => {
  const modalsFunc = useRecoilValue(modalsFuncAtom)
  const directions = useRecoilValue(directionsAtom)

  return (
    <CardListWrapper>
      {directions?.length > 0 ? (
        directions.map((direction) => (
          <DirectionCard key={direction._id} directionId={direction._id} />
        ))
      ) : (
        <div className="flex justify-center p-2">Нет направлений</div>
      )}
      <Fab onClick={() => modalsFunc.direction.edit()} show />
    </CardListWrapper>
  )
}

export default DirectionsContent
