import BlockContainer from '@components/BlockContainer'
import { H2, H3 } from '@components/tags'
import TextInRing from '@components/TextInRing'
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
            {image ? (
              <>
                {title && (
                  <H2
                    className={cn(
                      'hidden flex-1 tablet:block laptop:hidden',
                      image ? 'w-1/2' : 'w-full'
                    )}
                  >
                    {title}
                  </H2>
                )}
                <img
                  className="flex-1 object-contain h-full max-h-100 laptop:max-h-full laptop:h-full tablet:h-60"
                  src={image}
                  alt="direction"
                  // width={48}
                  // height={48}
                />
              </>
            ) : (
              <TextInRing text={title} />
            )}
          </div>
        )}

        <div className="flex-1">
          {image && title && (
            <H2 className="mb-4 tablet:hidden laptop:block">{title}</H2>
          )}
          <div
            className="w-full max-w-full overflow-hidden textarea"
            dangerouslySetInnerHTML={{ __html: sanitize(description) }}
          />
        </div>
      </div>
    </BlockContainer>
  )
}

export default DirectionBlock
