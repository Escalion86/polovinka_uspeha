import React from 'react'
import ReactImageGallery from 'react-image-gallery'
import Zoom from 'react-medium-image-zoom'
import cn from 'classnames'

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
            // sizes: '(max-width: 60px) 30px, (min-width: 60px) 60px',
          }))}
          renderItem={(e) => (
            <Zoom zoomMargin={20}>
              <img className={e.originalClass} src={e.original} alt="image" />
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
          <img className={className} src={noImage} alt="item_image" />
        </Zoom>
      )}
    </div>
  )
}

export default ImageGallery
