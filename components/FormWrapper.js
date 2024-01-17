import cn from 'classnames'

const FormWrapper = ({ children, className, title }) => {
  if (!title) return <div className={cn(`w-full`, className)}>{children}</div>

  return (
    <div className="flex flex-col w-full">
      {title && <div className="text-lg font-bold text-center">{title}</div>}
      <div className={cn(`flex flex-col w-full`, className)}>{children}</div>
    </div>
  )
}

export default FormWrapper
