import cn from 'classnames'

const FormWrapper = ({
  children,
  twoColumns = false,
  grid = true,
  flex = false,
  className,
  title,
}) => (
  <div className="flex flex-col w-full col-span-2">
    {title && <div className="text-lg font-bold text-center">{title}</div>}
    <div
      className={cn(
        'flex-1 gap-2',
        { flex: flex },
        { 'tablet:grid tablet:grid-cols-form': grid && !flex },
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
  </div>
)

export default FormWrapper
