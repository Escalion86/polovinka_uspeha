import cn from 'classnames'

const FormWrapper = ({
  children,
  // twoColumns = false,
  // grid = true,
  // flex = false,
  className,
  title,
}) => {
  if (!title)
    return (
      <div
        className={cn(
          `w-full`,
          // { flex: flex },
          // { 'laptop:gap-2 laptop:grid laptop:grid-cols-form': grid && !flex },
          // { 'laptop:grid-cols-form2': twoColumns },
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

  return (
    <div className="flex flex-col w-full">
      {title && <div className="text-lg font-bold text-center">{title}</div>}
      <div
        className={cn(
          `flex flex-col w-full`,
          // { flex: flex },
          // { 'laptop:gap-2 laptop:grid laptop:grid-cols-form': grid && !flex },
          // { 'laptop:grid-cols-form2': twoColumns },
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
}

export default FormWrapper
