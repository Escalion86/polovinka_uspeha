const CabinetWrapper = ({ children }) => {
  return (
    <div
      className="grid w-full h-screen overflow-hidden"
      style={{
        gridTemplateRows: 'auto 1fr',
        gridTemplateColumns: 'auto 1fr',
        gridTemplateAreas: `
          'sidebar header'
          'sidebar content'
        `,
      }}
    >
      {children}
    </div>
  )
}

export default CabinetWrapper
