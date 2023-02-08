import { modalsFuncAtom } from '@state/atoms'
import { useRecoilValue } from 'recoil'
import additionalBlockSelector from '@state/selectors/additionalBlockSelector'
import loadingAtom from '@state/atoms/loadingAtom'
import itemsFuncAtom from '@state/atoms/itemsFuncAtom'
import additionalBlocksAtom from '@state/atoms/additionalBlocksAtom'

import CardButtons from '@components/CardButtons'
import { CardWrapper } from '@components/CardWrapper'
import sanitize from '@helpers/sanitize'

const AdditionalBlockCard = ({ additionalBlockId, hidden = false, style }) => {
  const modalsFunc = useRecoilValue(modalsFuncAtom)
  const additionalBlock = useRecoilValue(
    additionalBlockSelector(additionalBlockId)
  )
  const loading = useRecoilValue(
    loadingAtom('additionalBlock' + additionalBlockId)
  )
  const itemFunc = useRecoilValue(itemsFuncAtom)

  const additionalBlocks = useRecoilValue(additionalBlocksAtom)

  const setUp = async () => {
    if (additionalBlock.index === 0) return

    var movedUp = false
    var movedDown = false
    const itemsToChange = additionalBlocks.map((item) => {
      if (!item.index && item.index === 0)
        Object.keys(additionalBlocks).reduce((key, v) =>
          additionalBlocks[v] < additionalBlocks[key] ? v : key
        )

      if (item.index === additionalBlock.index)
        if (!movedUp) {
          movedUp = true
          return { ...item, index: item.index - 1 }
        }

      if (item.index === additionalBlock.index - 1)
        if (!movedDown) {
          movedDown = true
          return { ...item, index: item.index + 1 }
        }
    })
    await Promise.all(
      itemsToChange.map(async (item) => {
        if (item)
          await itemFunc.additionalBlock.set({
            _id: item._id,
            index: item.index,
          })
      })
    )
  }

  const setDown = async () => {
    if (additionalBlock.index >= additionalBlocks.length - 1) return

    var movedUp = false
    var movedDown = false
    const itemsToChange = additionalBlocks.map((item) => {
      if (item.index === additionalBlock.index)
        if (!movedDown) {
          movedDown = true
          return { ...item, index: item.index + 1 }
        }
      if (item.index === additionalBlock.index + 1)
        if (!movedUp) {
          movedUp = true
          return { ...item, index: item.index - 1 }
        }
    })
    await Promise.all(
      itemsToChange.map(async (item) => {
        if (item)
          await itemFunc.additionalBlock.set({
            _id: item._id,
            index: item.index,
          })
      })
    )
  }

  return (
    <CardWrapper
      loading={loading}
      onClick={() => modalsFunc.additionalBlock.edit(additionalBlock._id)}
      showOnSite={additionalBlock.showOnSite}
      hidden={hidden}
      style={style}
    >
      {additionalBlock?.image && (
        // <div className="flex justify-center w-full tablet:w-auto">
        <img
          className="object-cover h-full w-36 tablet:w-48 max-h-60 tablet:max-h-72"
          src={additionalBlock.image}
          alt="additionalBlock"
          // width={48}
          // height={48}
        />
        // </div>
      )}
      <div className="w-full">
        <div className="flex">
          <div className="flex-1 px-2 py-1 text-xl font-bold ">
            {additionalBlock.title}
          </div>
          <CardButtons
            item={additionalBlock}
            typeOfItem="additionalBlock"
            showOnSiteOnClick={() => {
              itemFunc.additionalBlock.set({
                _id: additionalBlock._id,
                showOnSite: !additionalBlock.showOnSite,
              })
            }}
            onUpClick={additionalBlock.index > 0 && setUp}
            onDownClick={
              additionalBlock.index < additionalBlocks.length - 1 && setDown
            }
          />
        </div>
        {/* <div>{direction.description}</div> */}
        <div
          className="px-2 py-1 text-sm w-full max-w-full overflow-hidden textarea"
          dangerouslySetInnerHTML={{
            __html: sanitize(additionalBlock.description),
          }}
        />
      </div>
    </CardWrapper>
  )
}

export default AdditionalBlockCard
