import { motion } from 'framer-motion'

export const LoadingSpinner = ({ size = 'md', text = null }) => {
  const widthHeight =
    size === 'xxs'
      ? 24
      : size === 'xs'
      ? 30
      : size === 'sm'
      ? 40
      : size === 'md'
      ? 50
      : 60
  return (
    <div className="flex flex-col items-center justify-center">
      <motion.div
        animate={{ scale: [1, 1, 1.15, 1.05, 1.15, 1] }}
        transition={{
          duration: 1.3,
          repeat: Infinity,
          times: [0, 0.6, 0.7, 0.8, 0.9, 1],
        }}
      >
        <img
          src="/img/logo_heart.png"
          alt="logo"
          width={widthHeight}
          height={widthHeight}
        />
      </motion.div>
      {text && <div className="text-lg font-bold animate-pulse">{text}</div>}
    </div>
  )
}

export default LoadingSpinner
