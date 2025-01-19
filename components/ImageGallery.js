import cn from 'classnames'
import Image from 'next/image'
import { useState } from 'react'
import ReactImageGallery from 'react-image-gallery'
import LoadingSpinner from './LoadingSpinner'
// import Zoom, {
//   Controlled as ControlledZoom,
//   RightNav,
// } from 'react-medium-image-zoom'

const ImageWithLoading = ({ original, originalClass }) => {
  // const [isLoaded, setIsLoaded] = useState(false)
  // const [isError, setIsError] = useState(false)

  return (
    <div className="flex items-center justify-center object-contain h-full max-h-screen min-w-full min-h-full">
      {/* {!isError ? ( */}
      <div className="relative min-h-full h-full aspect-[16/9]">
        <LoadingSpinner
          className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
          size="lg"
        />
        <Image
          alt="image"
          src={original}
          width="0"
          height="0"
          sizes="100vw"
          className={cn(originalClass, 'object-contain relative')}
          // onLoad={() => setIsLoaded(true)}
          // onError={() => setIsError(true)}
          priority
        />
      </div>
      {/* ) : (
        <div className="h-full aspect-[16/9] flex justify-center items-center">
          Ошибка загрузки фотографии
        </div>
      )}
      {!isLoaded && !isError ? (
        <div className="h-full aspect-[16/9]">
          <LoadingSpinner size="lg" />
        </div>
      ) : null} */}
    </div>
  )
}

const ImageGallery = ({ images, noImage, className }) => {
  // const [isZoomed, setIsZoomed] = useState(false)

  // const handleZoomChange = useCallback((shouldZoom) => {
  //   setIsZoomed(shouldZoom)
  // }, [])

  if (images?.length === 0 && !noImage) return null

  return (
    <div className="flex justify-center w-full">
      <div className="flex justify-center border border-gray-400 h-60 laptop:h-80 max-h-60 laptop:max-h-80 aspect-[16/9] rounded-2xl overflow-hidden shadow-sm">
        {/* // {images?.length > 0 ? (
          // <ControlledZoom
          //   zoomMargin={20}
          //   isZoomed={isZoomed}
          //   onZoomChange={handleZoomChange}
          // > */}
        <ReactImageGallery
          className="aspect-[16/9]"
          items={images.map((image) => ({
            original: image,
            originalClass: 'w-full min-h-full max-h-screen',
          }))}
          // renderRightNav={(onClick, disabled) => (
          //   <div
          //     onClick={onClick}
          //     disabled={disabled}
          //     className="absolute right-0 w-6 h-8 bg-blue-800 top-[50%]"
          //   />
          // )}
          // className="object-cover"
          renderItem={(e) => <ImageWithLoading {...e} />}
          showPlayButton={false}
          showFullscreenButton={true}
          useBrowserFullscreen={false}
          // additionalClass={cn(
          //   'w-full max-h-60 laptop:max-h-80 max-w-full',
          //   className
          // )}
        />
        {/* // ) : (
          // </ControlledZoom>
          // <Zoom zoomMargin={20}>
          //   <Image
          //     alt="noImage"
          //     src={noImage}
          //     width="0"
          //     height="0"
          //     sizes="100vw"
          //     className={className}
          //   />
          // </Zoom>
        // )} */}
      </div>
    </div>
  )
}

export default ImageGallery
