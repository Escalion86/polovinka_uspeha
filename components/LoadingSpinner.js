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
      <div className="animate-spin">
        <img
          src="/img/UniPlatform.png"
          alt="logo"
          width={widthHeight}
          height={widthHeight}
        />
      </div>
      {text && <div className="text-lg font-bold">{text}</div>}
    </div>
  )
}

export default LoadingSpinner
