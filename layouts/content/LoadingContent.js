import { LoadingSpinner } from '@components/index'

const LoadingContent = () => {
  return (
    <div
      style={{ gridArea: 'loading' }}
      className="flex flex-col items-center justify-center w-full h-screen overflow-hidden"
    >
      <LoadingSpinner size="lg" text="Загрузка..." />
    </div>
  )
}

export default LoadingContent
