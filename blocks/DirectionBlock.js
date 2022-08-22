import BlockContainer from '@components/BlockContainer'
import { H3 } from '@components/tags'
import sanitize from '@helpers/sanitize'
import cn from 'classnames'

const DirectionBlock = ({
  className,
  image,
  title,
  inverse = false,
  description,
  id,
}) => {
  return (
    <BlockContainer className={className} altBg={inverse} id={id}>
      <div
        className={cn(
          'flex flex-col gap-4 w-full',
          inverse ? 'laptop:flex-row-reverse' : 'laptop:flex-row'
        )}
      >
        {(title || image) && (
          <div className="flex items-center flex-1 gap-x-4">
            {title && (
              <H3
                className={cn(
                  'hidden tablet:block laptop:hidden',
                  image ? 'w-1/2' : 'w-full'
                )}
              >
                {title}
              </H3>
            )}
            {image && (
              <img
                className="object-contain w-full h-full max-h-100 laptop:max-h-full laptop:h-full tablet:h-60 tablet:w-1/2 laptop:w-full"
                src={image}
                alt="direction"
                // width={48}
                // height={48}
              />
            )}
          </div>
        )}

        <div className="flex-1">
          {title && (
            <H3 className="mb-4 tablet:hidden laptop:block">{title}</H3>
          )}
          <div
            className="textarea"
            dangerouslySetInnerHTML={{ __html: sanitize(description) }}
          />
        </div>
      </div>
    </BlockContainer>
  )
}

export default DirectionBlock
