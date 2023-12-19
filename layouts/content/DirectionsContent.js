import ContentHeader from '@components/ContentHeader'
import AddButton from '@components/IconToggleButtons/AddButton'
import { getNounDirections } from '@helpers/getNoun'
import DirectionCard from '@layouts/cards/DirectionCard'
import CardListWrapper from '@layouts/wrappers/CardListWrapper'
import { modalsFuncAtom } from '@state/atoms'
import directionsAtom from '@state/atoms/directionsAtom'
import loggedUserActiveRoleSelector from '@state/selectors/loggedUserActiveRoleSelector'
import { useRecoilValue } from 'recoil'

const DirectionsContent = () => {
  const modalsFunc = useRecoilValue(modalsFuncAtom)
  const directions = useRecoilValue(directionsAtom)
  const loggedUserActiveRole = useRecoilValue(loggedUserActiveRoleSelector)
  const seeAddButton = loggedUserActiveRole?.generalPage?.directions

  return (
    <>
      <ContentHeader>
        <div className="flex items-center justify-end flex-1 flex-nowrap gap-x-2">
          <div className="text-lg font-bold whitespace-nowrap">
            {getNounDirections(directions.length)}
          </div>
          {seeAddButton && (
            <AddButton onClick={() => modalsFunc.direction.edit()} />
          )}
        </div>
      </ContentHeader>
      <CardListWrapper>
        {directions?.length > 0 ? (
          [...directions]
            .sort((a, b) => (a.index < b.index ? -1 : 1))
            .map((direction) => (
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
