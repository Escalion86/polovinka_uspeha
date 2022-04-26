import SideBar from '@layouts/SideBar'
import cn from 'classnames'

const ContentWrapper = ({ children, className, user, page }) => {
  return (
    <div className="flex" style={{ gridArea: 'content' }}>
      <SideBar user={user} page={page} />
      <div
        className={cn(
          'flex-1 flex flex-col w-full overflow-scroll overflow-x-hidden py-1 bg-opacity-15 gap-y-2 bg-general',
          className
        )}
      >
        {children}
      </div>
    </div>
  )
}

export default ContentWrapper
