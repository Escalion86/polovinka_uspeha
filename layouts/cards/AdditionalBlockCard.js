import CardButtons from '@components/CardButtons'
import CardWrapper from '@components/CardWrapper'
import modalsFuncAtom from '@state/modalsFuncAtom'
import additionalBlocksAtom from '@state/atoms/additionalBlocksAtom'
import itemsFuncAtom from '@state/itemsFuncAtom'
import loadingAtom from '@state/atoms/loadingAtom'
import additionalBlockSelector from '@state/selectors/additionalBlockSelector'
import DOMPurify from 'isomorphic-dompurify'
import { useAtomValue } from 'jotai'

const AdditionalBlockCard = ({ additionalBlockId, hidden = false, style }) => {
  const modalsFunc = useAtomValue(modalsFuncAtom)
  const additionalBlock = useAtomValue(
    additionalBlockSelector(additionalBlockId)
  )
  const loading = useAtomValue(
    loadingAtom('additionalBlock' + additionalBlockId)
  )
  const itemFunc = useAtomValue(itemsFuncAtom)

  const additionalBlocks = useAtomValue(additionalBlocksAtom)

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
          className="w-full max-w-full px-2 py-1 overflow-hidden text-sm textarea ql"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(additionalBlock.description),
          }}
        />
      </div>
    </CardWrapper>
  )
}

export default AdditionalBlockCard
