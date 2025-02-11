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

const DirectionCard = ({ directionId, hidden = false, style }) => {
  const modalsFunc = useAtomValue(modalsFuncAtom)
  const direction = useAtomValue(directionFullSelectorAsync(directionId))
  const loading = useAtomValue(loadingAtom('direction' + directionId))
  const itemFunc = useAtomValue(itemsFuncAtom)
  const directions = useAtomValue(directionsAtom)
  const snackbar = useAtomValue(snackbarAtom)

  const setUp = async () => {
    if (direction.index === 0) return

    var movedUp = false
    var movedDown = false
    const itemsToChange = directions
      .map((item) => {
        // if (!item.index && item.index === 0)
        //   Object.keys(directions).reduce((key, v) =>
        //     directions[v] < directions[key] ? v : key
        //   )

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
      .filter((item) => item)
    const result = await Promise.all(
      itemsToChange.map(
        async (item) =>
          await itemFunc.direction.set(
            {
              _id: item._id,
              index: item.index,
            },
            false,
            true
          )
      )
    )
    if (result.filter((item) => item).length === itemsToChange.length)
      snackbar.success(`Направление "${direction.title}" перемещено выше`)
    else
      snackbar.error(`Не удеалось переместить направление "${direction.title}"`)
  }

  const setDown = async () => {
    if (direction.index >= directions.length - 1) return

    var movedUp = false
    var movedDown = false
    const itemsToChange = directions
      .map((item) => {
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
      .filter((item) => item)
    const result = await Promise.all(
      itemsToChange.map(
        async (item) =>
          await itemFunc.direction.set(
            {
              _id: item._id,
              index: item.index,
            },
            false,
            true
          )
      )
    )
    if (result.filter((item) => item).length === itemsToChange.length)
      snackbar.success(`Направление "${direction.title}" перемещено ниже`)
    else
      snackbar.error(`Не удеалось переместить направление "${direction.title}"`)
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
          <div className="font-bold text-blue-600">{direction.index}</div>
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
