const CabinetWrapper = ({ children }) => {
  return (
    <div
      className="grid w-full h-screen max-h-screen overflow-hidden"
      style={{
        gridTemplateRows: 'auto 1fr',
        gridTemplateColumns: '64px 1fr',
        gridTemplateAreas: `
          'burger header'
          'content content'
        `,
      }}
    >
      {children}
    </div>
  )
}

export default CabinetWrapper
