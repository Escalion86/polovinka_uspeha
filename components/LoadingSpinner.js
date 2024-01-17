import cn from 'classnames'
import { motion } from 'framer-motion'

export const LoadingSpinner = ({
  className,
  size = 'md',
  text = null,
  heightClassName = 'h-full',
}) => {
  const widthHeight =
    size === 'xxs'
      ? 24
      : size === 'xs'
      ? 30
      : size === 'sm'
      ? 40
      : size === 'md'
      ? 50
      : size === 'lg'
      ? 100
      : 60
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center max-h-full',
        heightClassName,
        className
      )}
    >
      <div
        className="relative flex flex-col items-center justify-center overflow-hidden"
        style={{
          height: widthHeight * 1.25,
          maxHeight: widthHeight * 1.25,
          width: widthHeight * 1.25,
          maxWidth: widthHeight * 1.25,
        }}
      >
        <div
          style={{
            height: widthHeight * 1.25,
            maxHeight: widthHeight * 1.25,
            width: widthHeight * 1.25,
            maxWidth: widthHeight * 1.25,
          }}
          className="absolute top-auto bottom-auto left-auto right-auto h-[95%] border-l-2 rounded-full aspect-1 border-general animate-spin"
        />
        <motion.div
          animate={{ scale: [1, 1, 1.15, 1.05, 1.15, 1] }}
          transition={{
            duration: 1.3,
            repeat: Infinity,
            times: [0, 0.6, 0.7, 0.8, 0.9, 1],
          }}
          className="flex items-center justify-center h-full"
        >
          <img
            className="object-contain max-h-[80%] aspect-1 h-[70%] w-[70%]"
            style={{ maxHeight: widthHeight, maxWidth: widthHeight }}
            src="/img/logo_heart.png"
            alt="logo"
          />
        </motion.div>
      </div>
      {text && <div className="text-lg font-bold animate-pulse">{text}</div>}
    </div>
  )
}

export default LoadingSpinner
