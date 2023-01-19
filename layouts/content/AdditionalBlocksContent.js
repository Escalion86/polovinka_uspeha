import { modalsFuncAtom } from '@state/atoms'
import { useRecoilValue } from 'recoil'
import additionalBlocksAtom from '@state/atoms/additionalBlocksAtom'
import isLoggedUserAdminSelector from '@state/selectors/isLoggedUserAdminSelector'

import CardListWrapper from '@layouts/wrappers/CardListWrapper'
import ContentHeader from '@components/ContentHeader'
import { getNounAdditionalBlocks } from '@helpers/getNoun'
import AddButton from '@components/IconToggleButtons/AddButton'
import AdditionalBlockCard from '@layouts/cards/AdditionalBlockCard'

const AdditionalBlocksContent = () => {
  const modalsFunc = useRecoilValue(modalsFuncAtom)
  const additionalBlocks = useRecoilValue(additionalBlocksAtom)
  const isLoggedUserAdmin = useRecoilValue(isLoggedUserAdminSelector)
  // const sortedAdditionalBlocks = additionalBlocks
  // .sort((a, b) => (a.index < b.index ? -1 : 1))

  return (
    <>
      <ContentHeader>
        <div className="flex items-center justify-end flex-1 flex-nowrap gap-x-2">
          <div className="text-lg font-bold whitespace-nowrap">
            {getNounAdditionalBlocks(additionalBlocks.length)}
          </div>
          {isLoggedUserAdmin && (
            <AddButton onClick={() => modalsFunc.additionalBlock.edit()} />
          )}
        </div>
      </ContentHeader>
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
          <div className="flex justify-center p-2">
            Нет дополнительных блоков
          </div>
        )}
        {/* <Fab onClick={() => modalsFunc.additionalBlock.edit()} show /> */}
      </CardListWrapper>
    </>
  )
}

export default AdditionalBlocksContent
