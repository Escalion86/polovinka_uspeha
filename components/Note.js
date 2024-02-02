const Note = ({ children }) => (
  // <div className="relative pt-2.5 pb-2 px-2 mb-2 mt-4 text-base leading-4 bg-teal-100 border-2 border-teal-400 rounded-lg">
  //   <div className="absolute px-2 text-teal-700 bg-white rounded-md text-sm -top-[12px] left-2">
  //     <div className="absolute top-0 left-0 right-0 h-full px-1 border-t-2 border-b-2 border-l-2 border-r-2 border-teal-400 rounded-md font-semkibold" />
  //     Примечание
  //   </div>
  //   {children}
  // </div>
  <div className="text-teal-900 pt-2.5 pb-2 px-2 my-2 text-base leading-4 italic bg-teal-100 border-l-4 border-teal-400 rounded-[4px]">
    {children}
  </div>
)

export default Note
