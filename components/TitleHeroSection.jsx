'use client'

import PropTypes from 'prop-types'
import cn from 'classnames'
import ImagesMarquee from '@components/ImagesMarquee'

const TitleHeroSection = ({
  sectionClassName,
  gridClassName,
  leftClassName,
  rightClassName,
  leftContent,
  images,
  imageClassName = 'object-cover opacity-85',
  durationSec = 30,
  overlayClassName = 'bg-black/35',
  logoSrc = '/img/logo_new.png',
  logoAlt = 'Половинка успеха',
  logoClassName = 'w-[min(220px,60%)] drop-shadow-[0_12px_30px_rgba(0,0,0,0.5)]',
  afterGridContent,
}) => (
  <section className={sectionClassName}>
    <div className={gridClassName}>
      <div className={leftClassName}>{leftContent}</div>

      <div
        className={cn(
          'relative min-h-[260px] overflow-hidden rounded-[28px] bg-black',
          rightClassName
        )}
      >
        <div className="absolute inset-0 overflow-hidden">
          <ImagesMarquee
            images={images}
            heightClassName="h-full"
            itemWidthClassName="w-auto"
            imageClassName={imageClassName}
            durationSec={durationSec}
            pauseOnHover={false}
            enableLightbox={false}
          />
        </div>
        <div
          className={cn('absolute inset-0 z-[1]', overlayClassName)}
          aria-hidden
        />
        <div className="pointer-events-none relative z-10 grid h-full min-h-[260px] place-items-center">
          <img src={logoSrc} alt={logoAlt} className={logoClassName} />
        </div>
      </div>
    </div>
    {afterGridContent}
  </section>
)

TitleHeroSection.propTypes = {
  sectionClassName: PropTypes.string,
  gridClassName: PropTypes.string,
  leftClassName: PropTypes.string,
  rightClassName: PropTypes.string,
  leftContent: PropTypes.node.isRequired,
  images: PropTypes.arrayOf(PropTypes.string),
  imageClassName: PropTypes.string,
  durationSec: PropTypes.number,
  overlayClassName: PropTypes.string,
  logoSrc: PropTypes.string,
  logoAlt: PropTypes.string,
  logoClassName: PropTypes.string,
  afterGridContent: PropTypes.node,
}

TitleHeroSection.defaultProps = {
  sectionClassName: '',
  gridClassName:
    'grid min-h-[60vh] gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]',
  leftClassName:
    'order-last flex flex-col justify-center overflow-hidden rounded-[28px] bg-[linear-gradient(160deg,#4b101b,#6b1f2a)] p-10 text-white lg:order-none',
  rightClassName: 'order-first lg:order-none',
  images: [],
  imageClassName: 'object-cover opacity-85',
  durationSec: 45,
  overlayClassName: 'bg-black/35',
  logoSrc: '/img/logo_new.png',
  logoAlt: 'Половинка успеха',
  logoClassName: 'w-[min(220px,60%)] drop-shadow-[0_12px_30px_rgba(0,0,0,0.5)]',
  afterGridContent: null,
}

export default TitleHeroSection
