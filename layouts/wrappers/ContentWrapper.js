import SideBar from '@layouts/SideBar'

const ContentWrapper = ({ children, page }) => {
  return (
    <div
      className="relative flex h-[calc(100vh-4rem)] max-h-[calc(100vh-4rem)] max-w-[100vw]"
      style={{ gridArea: 'content' }}
    >
      <SideBar page={page} />
      <div className="flex flex-col flex-1 max-w-[100vw] min-h-0 overflow-y-auto">
        {children}
      </div>
    </div>
  )
}

export default ContentWrapper
