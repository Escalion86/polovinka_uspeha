const TopInfo = () => {
  return (
    <div className="fixed top-0 z-50 flex justify-center h-10 -translate-x-1/2 pointer-events-none w-28 group left-1/2">
      <div className="absolute top-0 flex items-center justify-center w-24 h-8 px-1 text-sm leading-3 text-center text-white transition-all duration-300 border-white group-hover:-top-8 border-r-1 border-l-1 border-b-1 bg-danger rounded-b-md">
        Режим разработчика
      </div>
    </div>
  )
}

export default TopInfo
