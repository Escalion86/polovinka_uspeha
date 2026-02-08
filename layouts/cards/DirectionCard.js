import CardButtons from '@components/CardButtons'
import CardWrapper from '@components/CardWrapper'
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
      snackbar.success(`Пространство "${direction.title}" перемещено выше`)
    else
      snackbar.error(
        `Не удеалось переместить Пространство "${direction.title}"`
      )
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
      snackbar.success(`Пространство "${direction.title}" перемещено ниже`)
    else
      snackbar.error(
        `Не удеалось переместить Пространство "${direction.title}"`
      )
  }

  return (
    <CardWrapper
      loading={loading}
      onClick={() => !loading && modalsFunc.direction.edit(direction._id)}
      showOnSite={direction.showOnSite}
      hidden={hidden}
      style={style}
      className="rounded-2xl"
    >
      <div className="relative w-full flex h-full flex-col rounded-2xl bg-white shadow-[0_16px_30px_rgba(0,0,0,0.08)]">
        <div
          className="absolute z-10 right-2 top-1"
          onClick={(event) => event.stopPropagation()}
        >
          <CardButtons
            item={direction}
            typeOfItem="direction"
            showOnSiteOnClick={() => {
              itemFunc.direction.set({
                _id: direction._id,
                showOnSite: !direction.showOnSite,
              })
            }}
            onUpClick={direction.index > 0 ? setUp : undefined}
            onDownClick={
              direction.index < directions.length - 1 ? setDown : undefined
            }
            alwaysCompact
            triggerClassName="text-white"
          />
        </div>
        <h3 className="py-2 text-center rounded-t-2xl font-bold text-[20px] bg-[#6b1f2a] text-white/85">
          {direction.title}
        </h3>
        <div className="flex flex-col h-full p-5 gap-y-1">
          <p className="text-[18px] text-[#4b3a40] whitespace-pre-line">
            {direction.shortDescription ||
              direction.description ||
              'Описание пространства пока не добавлено.'}
          </p>
        </div>
      </div>
    </CardWrapper>
  )
}

export default DirectionCard
