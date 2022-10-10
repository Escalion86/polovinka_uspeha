const TextLine = ({ label, children }) => (
  <div className="flex items-center leading-5 gap-x-1">
    <span className="font-bold">{label + ':'}</span>
    {children}
  </div>
)

export default TextLine
