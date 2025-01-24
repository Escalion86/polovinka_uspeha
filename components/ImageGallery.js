import cn from 'classnames'
import Image from 'next/image'
// import { useState } from 'react'
import ReactImageGallery from 'react-image-gallery'
import LoadingSpinner from './LoadingSpinner'
// import Zoom, {
//   Controlled as ControlledZoom,
//   RightNav,
// } from 'react-medium-image-zoom'

const ImageWithLoading = ({ src }) => {
  // const [isLoaded, setIsLoaded] = useState(false)
  // const [isError, setIsError] = useState(false)

  return (
    <div className="relative flex items-center justify-center object-contain h-full max-h-screen min-w-full min-h-full">
      {/* {!isError ? ( */}
      {/* <div className="relative min-h-full h-full aspect-[16/9]"> */}
      <LoadingSpinner
        className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
        size="lg"
      />
      <img
        alt="image"
        src={src}
        width="0"
        height="0"
        sizes="100vw"
        className="relative object-contain w-full max-h-screen min-h-full"
        // onLoad={() => setIsLoaded(true)}
        // onError={() => setIsError(true)}
        // priority
      />
      {/* </div> */}
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

  // const PREFIX_URL =
  // "https://raw.githubusercontent.com/xiaolin/react-image-gallery/master/static/";
  // console.log('images', images)
  // const preparedImages = images.map((image) => ({
  //   original: image,
  //   thumbnail: image,
  //   // thumbnailWidth: 100,
  //   // thumbnailHeight: 50,
  // }))

  // console.log('preparedImages :>> ', preparedImages)

  // const preparedImages = [
  //   {
  //     thumbnail: `${PREFIX_URL}4v.jpg`,
  //     original: `${PREFIX_URL}4v.jpg`,
  //     embedUrl:
  //       "https://www.youtube.com/embed/4pSzhZ76GdM?autoplay=1&showinfo=0",
  //     description: "Render custom slides (such as videos)",
  //     // renderItem: this._renderVideo.bind(this),
  //   },
  //   {
  //     original: `${PREFIX_URL}1.jpg`,
  //     thumbnail: `${PREFIX_URL}1t.jpg`,
  //     originalClass: "featured-slide",
  //     thumbnailClass: "featured-thumb",
  //     description: "Custom class for slides & thumbnails",
  //   },
  // ]

  return (
    <div className="flex justify-center">
      <div
        // style={{ aspectRatio: 'auto 16/9' }}
        className="w-full aspect-[16/9] overflow-hidden border border-gray-400 shadow-sm phoneH:w-auto min-h-40 phoneH:h-60 laptop:h-80 phoneH:max-h-60 laptop:max-h-80 rounded-2xl"
      >
        {/* // {images?.length > 0 ? (
          // <ControlledZoom
          //   zoomMargin={20}
          //   isZoomed={isZoomed}
          //   onZoomChange={handleZoomChange}
          // > */}
        <ReactImageGallery
          // className="aspect-[16/9]"
          items={images}
          // items={preparedImages}
          // renderRightNav={(onClick, disabled) => (
          //   <div
          //     onClick={onClick}
          //     disabled={disabled}
          //     className="absolute right-0 w-6 h-8 bg-blue-800 top-[50%]"
          //   />
          // )}
          // className="object-cover"
          renderItem={(src) => <ImageWithLoading src={src} />}
          showPlayButton={false}
          showFullscreenButton={true}
          useBrowserFullscreen={false}
          additionalClass="aspect-[16/9]"
          // additionalClass={cn(
          //   'w-full max-h-60 laptop:max-h-80 max-w-full',
          //   className
          // )}
          // showThumbnails
          // showNav
          showBullets={images?.length > 1}
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
