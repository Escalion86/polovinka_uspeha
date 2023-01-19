import { useRecoilValue } from 'recoil'
import { modalsFuncAtom } from '@state/atoms'
import directionsAtom from '@state/atoms/directionsAtom'
import isLoggedUserAdminSelector from '@state/selectors/isLoggedUserAdminSelector'

import ContentHeader from '@components/ContentHeader'
import AddButton from '@components/IconToggleButtons/AddButton'
import { getNounDirections } from '@helpers/getNoun'
import DirectionCard from '@layouts/cards/DirectionCard'
import CardListWrapper from '@layouts/wrappers/CardListWrapper'

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
