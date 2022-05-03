import { modalsFuncAtom } from '@state/atoms'
import { useRecoilValue } from 'recoil'
import Fab from '@components/Fab'
import CardButtons from '@components/CardButtons'

const AdditionalBlocksContent = (props) => {
  const { additionalBlocks } = props
  const modalsFunc = useRecoilValue(modalsFuncAtom)

  return (
    <>
      {additionalBlocks?.length > 0 ? (
        additionalBlocks.map((additionalBlock) => {
          return (
            <div
              key={additionalBlock._id}
              className="flex duration-300 bg-white border-t border-b border-gray-400 shadow-sm cursor-pointer hover:shadow-medium-active"
              onClick={() => modalsFunc.additionalBlock.edit(additionalBlock)}
            >
              {additionalBlock.image && (
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
                  />
                </div>
                {/* <div>{direction.description}</div> */}
                <div
                  className="px-2 py-1 text-sm "
                  dangerouslySetInnerHTML={{
                    __html: additionalBlock.description,
                  }}
                />
              </div>
            </div>
          )
        })
      ) : (
        <div className="flex justify-center p-2">Нет дополнительных блоков</div>
      )}
      <Fab onClick={() => modalsFunc.additionalBlock.edit()} show />
    </>
  )
}

export default AdditionalBlocksContent
