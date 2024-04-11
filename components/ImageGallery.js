import cn from 'classnames'
import Image from 'next/image'
import ReactImageGallery from 'react-image-gallery'
import Zoom from 'react-medium-image-zoom'

const ImageGallery = ({ images, noImage, className }) => {
  if (images?.length === 0 && !noImage) return null

  return (
    <div className="flex justify-center w-full border border-gray-400 h-60 laptop:h-80">
      {images?.length > 0 ? (
        <ReactImageGallery
          items={images.map((image) => ({
            original: image,
            originalClass:
              'object-contain h-60 laptop:h-80 max-h-60 laptop:max-h-80 w-full',
          }))}
          renderItem={(e) => (
            <Zoom zoomMargin={20}>
              <Image
                alt="image"
                src={e.original}
                width="0"
                height="0"
                sizes="100vw"
                className={e.originalClass}
              />
            </Zoom>
          )}
          showPlayButton={false}
          showFullscreenButton={false}
          additionalClass={cn(
            'w-full max-h-60 laptop:max-h-80 max-w-full',
            className
          )}
        />
      ) : (
        <Zoom zoomMargin={20}>
          <Image
            alt="noImage"
            src={noImage}
            width="0"
            height="0"
            sizes="100vw"
            className={className}
          />
        </Zoom>
      )}
    </div>
  )
}

export default ImageGallery
