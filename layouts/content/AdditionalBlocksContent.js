import { modalsFuncAtom } from '@state/atoms'
import { useRecoilValue } from 'recoil'
import Fab from '@components/Fab'
import CardButtons from '@components/CardButtons'
import additionalBlockSelector from '@state/selectors/additionalBlockSelector'
import loadingAtom from '@state/atoms/loadingAtom'
import itemsFuncAtom from '@state/atoms/itemsFuncAtom'
import { CardWrapper } from '@components/CardWrapper'
import additionalBlocksAtom from '@state/atoms/additionalBlocksAtom'
import sanitize from '@helpers/sanitize'
import CardListWrapper from '@layouts/wrappers/CardListWrapper'

const AdditionalBlockCard = ({ additionalBlockId }) => {
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

    const itemsToChange = additionalBlocks.map((item) => {
      if (item.index === additionalBlock.index)
        return { ...item, index: item.index - 1 }
      if (item.index === additionalBlock.index - 1)
        return { ...item, index: item.index + 1 }
    })
    await Promise.all(
      itemsToChange.map(async (item) => {
        await itemFunc.additionalBlock.set({
          _id: item._id,
          index: item.index,
        })
      })
    )
  }

  const setDown = async () => {
    if (additionalBlock.index >= additionalBlocks.length - 1) return

    const itemsToChange = additionalBlocks.map((item) => {
      if (item.index === additionalBlock.index)
        return { ...item, index: item.index + 1 }
      if (item.index === additionalBlock.index + 1)
        return { ...item, index: item.index - 1 }
    })
    await Promise.all(
      itemsToChange.map(async (item) => {
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
          className="px-2 py-1 text-sm textarea"
          dangerouslySetInnerHTML={{
            __html: sanitize(additionalBlock.description),
          }}
        />
      </div>
    </CardWrapper>
  )
}

const AdditionalBlocksContent = () => {
  const modalsFunc = useRecoilValue(modalsFuncAtom)
  const additionalBlocks = useRecoilValue(additionalBlocksAtom)
  // const sortedAdditionalBlocks = additionalBlocks
  // .sort((a, b) => (a.index < b.index ? -1 : 1))

  return (
    <CardListWrapper>
      {additionalBlocks?.length > 0 ? (
        [...additionalBlocks]
          .sort((a, b) => (a.index < b.index ? -1 : 1))
          .map((additionalBlock) => (
            <AdditionalBlockCard
              key={additionalBlock._id}
              additionalBlockId={additionalBlock._id}
            />
          ))
      ) : (
        <div className="flex justify-center p-2">Нет дополнительных блоков</div>
      )}
      <Fab onClick={() => modalsFunc.additionalBlock.edit()} show />
    </CardListWrapper>
  )
}

export default AdditionalBlocksContent
