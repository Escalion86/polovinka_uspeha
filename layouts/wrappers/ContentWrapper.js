import SideBar from '@layouts/SideBar'
import cn from 'classnames'

const ContentWrapper = ({ children, className, user, page }) => {
  return (
    <div
      className="relative flex h-[calc(100vh-4rem)] max-h-[calc(100vh-4rem)]"
      style={{ gridArea: 'content' }}
    >
      <SideBar user={user} page={page} />
      <div className="flex flex-col flex-1">{children}</div>
    </div>
  )
}

export default ContentWrapper
