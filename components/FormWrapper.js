import cn from 'classnames'

const FormWrapper = ({ children, twoColumns = false, className }) => (
  <div
    className={cn(
      'grid w-full col-span-2 gap-2 grid-cols-form',
      { 'tablet:grid-cols-form2': twoColumns },
      className
    )}
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
