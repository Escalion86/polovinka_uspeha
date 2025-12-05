import Skeleton from 'react-loading-skeleton'
import cn from 'classnames'
import ItemContainer from '@components/ItemContainer'
// itemSize={widthNum > 3 ? 165 : widthNum === 3 ? 176 : 224}
// itemSize={widthNum > 2 ? 98 : 101}

const UserItemSkeleton = ({
  hideGender,
  className,
  noBorder,
  style,
  nameFieldWrapperClassName,
}) => {
  return (
    <ItemContainer
      noPadding
      className={cn('flex h-[42px]', className)}
      noBorder={noBorder}
      style={style}
    >
      {!hideGender && (
        <div className="flex flex-col items-center justify-center w-6 h-full tablet:w-7 min-w-6 tablet:min-w-7 gap-y-1">
          <Skeleton
            count={1}
            height="100%"
            width="100%"
            borderRadius={0}
            containerClassName="w-[26px] h-[42px] -mt-2"
          />
        </div>
      )}
      <Skeleton
        count={1}
        height="100%"
        borderRadius={0}
        containerClassName="h-[42px] aspect-1 -mt-1"
      />
      <div className="relative flex-1 flex items-center py-0.5 px-1 gap-x-0.5">
        <div className="flex items-center flex-1 max-h-full">
          <div
            className={cn(
              'flex flex-col flex-1 max-h-full text-xs text-gray-800 phoneH:text-sm tablet:text-base gap-x-1',
              nameFieldWrapperClassName
            )}
          >
            <Skeleton
              count={1}
              height="100%"
              borderRadius={0}
              containerClassName="w-[200px] max-w-full"
            />
          </div>
          <Skeleton
            count={1}
            height="100%"
            borderRadius={0}
            containerClassName="h-[24px] aspect-1 w-[24px] -mt-2"
          />
        </div>
      </div>
    </ItemContainer>
  )
}

export default UserItemSkeleton
