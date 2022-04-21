import { modalsFuncAtom } from '@state/atoms'
import { useRecoilValue } from 'recoil'

const DirectionsContent = ({ user, events, directions, reviews }) => {
  const modalsFunc = useRecoilValue(modalsFuncAtom)
  return (
    // <div className="flex flex-col w-full h-full py-1 bg-opacity-15 gap-y-2 bg-general">
    directions ? (
      directions.map((direction) => (
        <div
          key={direction._id}
          className="px-2 py-1 duration-300 bg-white border-t border-b border-gray-400 shadow-sm cursor-pointer hover:shadow-medium-active"
          onClick={() => modalsFunc.direction(direction)}
        >
          <div className="text-xl font-bold">{direction.title}</div>
          {/* <div>{direction.description}</div> */}
          <div
            className="text-sm"
            dangerouslySetInnerHTML={{ __html: direction.description }}
          />
        </div>
      ))
    ) : (
      <div className="flex justify-center p-2">Нет направлений</div>
    )
  )
}

export default DirectionsContent
