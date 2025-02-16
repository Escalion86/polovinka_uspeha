import cn from 'classnames'

const ContentHeader = ({ children, noBorder }) => {
  return (
    <div
      className={cn(
        'z-10 flex flex-wrap items-center justify-center gap-2 px-2 py-1 text-black bg-white',
        noBorder ? '' : 'border-b border-gray-700'
      )}
    >
      {children}
    </div>
  )
}

export default ContentHeader
