import CardButtons from '@components/CardButtons'
import Fab from '@components/Fab'

import { putData } from '@helpers/CRUD'
import { modalsFuncAtom } from '@state/atoms'
import cn from 'classnames'
import { useRouter } from 'next/router'
import { useRecoilValue } from 'recoil'

const DirectionsContent = (props) => {
  const { directions } = props
  const modalsFunc = useRecoilValue(modalsFuncAtom)

  return (
    <>
      {directions ? (
        directions.map((direction) => (
          <div
            key={direction._id}
            className="flex duration-300 bg-white border-t border-b border-gray-400 shadow-sm cursor-pointer hover:shadow-medium-active"
            onClick={() => modalsFunc.direction.edit(direction)}
          >
            {direction.image && (
              // <div className="flex justify-center w-full tablet:w-auto">
              <img
                className="object-cover h-full w-36 tablet:w-48 max-h-60 tablet:max-h-72"
                src={direction.image}
                alt="direction"
                // width={48}
                // height={48}
              />
              // </div>
            )}
            <div className="w-full">
              <div className="flex">
                <div className="flex-1 px-2 py-1 text-xl font-bold ">
                  {direction.title}
                </div>
                <CardButtons item={direction} typeOfItem="direction" />
              </div>
              {/* <div>{direction.description}</div> */}
              <div
                className="px-2 py-1 text-sm "
                dangerouslySetInnerHTML={{ __html: direction.description }}
              />
            </div>
          </div>
        ))
      ) : (
        <div className="flex justify-center p-2">Нет направлений</div>
      )}
      <Fab onClick={() => modalsFunc.direction.edit()} show />
    </>
  )
}

export default DirectionsContent
