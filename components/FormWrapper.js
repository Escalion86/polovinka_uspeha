const FormWrapper = ({ children, twoColumns = false }) => (
  <div
    className={`grid w-full col-span-2 gap-2 grid-cols-form ${
      twoColumns ? 'tablet:grid-cols-form2' : ''
    }`}
    // style={{
    //   gridTemplateColumns: twoColumns
    //     ? 'minmax(min-content, 20%) 1fr minmax(min-content, 20%) 1fr'
    //     : `minmax(min-content, 20%) 1fr`,
    // }}
  >
    {children}
  </div>
)

export default FormWrapper
