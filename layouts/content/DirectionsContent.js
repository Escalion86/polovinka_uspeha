import CardButtons from '@components/CardButtons'
import { CardWrapper } from '@components/CardWrapper'
import ContentHeader from '@components/ContentHeader'
// import Fab from '@components/Fab'
import AddButton from '@components/IconToggleButtons/AddButton'
import TextInRing from '@components/TextInRing'
import { getNounDirections } from '@helpers/getNoun'
import sanitize from '@helpers/sanitize'
import CardListWrapper from '@layouts/wrappers/CardListWrapper'

import { modalsFuncAtom } from '@state/atoms'
import directionsAtom from '@state/atoms/directionsAtom'
import itemsFuncAtom from '@state/atoms/itemsFuncAtom'
import loadingAtom from '@state/atoms/loadingAtom'
import directionSelector from '@state/selectors/directionSelector'
import isLoggedUserAdminSelector from '@state/selectors/isLoggedUserAdminSelector'
// import Image from 'next/image'
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
  const isLoggedUserAdmin = useRecoilValue(isLoggedUserAdminSelector)

  return (
    <>
      <ContentHeader>
        <div className="flex items-center justify-end flex-1 flex-nowrap gap-x-2">
          <div className="text-lg font-bold whitespace-nowrap">
            {getNounDirections(directions.length)}
          </div>
          {isLoggedUserAdmin && (
            <AddButton onClick={() => modalsFunc.direction.edit()} />
          )}
        </div>
      </ContentHeader>
      <CardListWrapper>
        {directions?.length > 0 ? (
          directions.map((direction) => (
            <DirectionCard key={direction._id} directionId={direction._id} />
          ))
        ) : (
          <div className="flex justify-center p-2">Нет направлений</div>
        )}
        {/* <Fab onClick={() => modalsFunc.direction.edit()} show /> */}
      </CardListWrapper>
    </>
  )
}

export default DirectionsContent
