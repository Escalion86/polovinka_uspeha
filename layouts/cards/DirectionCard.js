import CardButtons from '@components/CardButtons'
import { CardWrapper } from '@components/CardWrapper'
import TextInRing from '@components/TextInRing'
import { modalsFuncAtom } from '@state/atoms'
import directionsAtom from '@state/atoms/directionsAtom'
import itemsFuncAtom from '@state/atoms/itemsFuncAtom'
import loadingAtom from '@state/atoms/loadingAtom'
import directionSelector from '@state/selectors/directionSelector'
import { useRecoilValue } from 'recoil'

const DirectionCard = ({ directionId, hidden = false, style }) => {
  const modalsFunc = useRecoilValue(modalsFuncAtom)
  const direction = useRecoilValue(directionSelector(directionId))
  const loading = useRecoilValue(loadingAtom('direction' + directionId))
  const itemFunc = useRecoilValue(itemsFuncAtom)
  const directions = useRecoilValue(directionsAtom)

  const setUp = async () => {
    if (direction.index === 0) return

    var movedUp = false
    var movedDown = false
    const itemsToChange = directions.map((item) => {
      if (!item.index && item.index === 0)
        Object.keys(directions).reduce((key, v) =>
          directions[v] < directions[key] ? v : key
        )

      if (item.index === direction.index)
        if (!movedUp) {
          movedUp = true
          return { ...item, index: item.index - 1 }
        }

      if (item.index === direction.index - 1)
        if (!movedDown) {
          movedDown = true
          return { ...item, index: item.index + 1 }
        }
    })
    await Promise.all(
      itemsToChange.map(async (item) => {
        if (item)
          await itemFunc.direction.set({
            _id: item._id,
            index: item.index,
          })
      })
    )
  }

  const setDown = async () => {
    if (direction.index >= directions.length - 1) return

    var movedUp = false
    var movedDown = false
    const itemsToChange = directions.map((item) => {
      if (item.index === direction.index)
        if (!movedDown) {
          movedDown = true
          return { ...item, index: item.index + 1 }
        }
      if (item.index === direction.index + 1)
        if (!movedUp) {
          movedUp = true
          return { ...item, index: item.index - 1 }
        }
    })
    await Promise.all(
      itemsToChange.map(async (item) => {
        if (item)
          await itemFunc.direction.set({
            _id: item._id,
            index: item.index,
          })
      })
    )
  }

  return (
    <CardWrapper
      loading={loading}
      onClick={() => !loading && modalsFunc.direction.edit(direction._id)}
      showOnSite={direction.showOnSite}
      hidden={hidden}
      style={style}
    >
      {/* {direction?.image ? (
        <img
          className="object-cover h-full max-w-full tablet:w-48 tablet:max-w-48 max-h-60 tablet:max-h-72"
          src={direction.image}
          alt="direction"
          // width={48}
          // height={48}
        />
      ) : ( */}
      <div className="flex justify-center w-full laptop:w-auto">
        <TextInRing text={direction.title} />
      </div>
      {/* )} */}
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
            onUpClick={direction.index > 0 && setUp}
            onDownClick={direction.index < directions.length - 1 && setDown}
          />
        </div>
        <div className="px-2 py-1 text-sm whitespace-pre-wrap">
          {direction.shortDescription}
        </div>
      </div>
    </CardWrapper>
  )
}

export default DirectionCard
