import cn from 'classnames'

export const H1 = ({ className, style, children }) => (
  <h1
    className={cn('text-4xl font-bold text-center tablet:text-5xl', className)}
    style={style}
  >
    {children}
  </h1>
)

export const H2 = ({ className, style, children }) => (
  <h2
    className={cn('text-xl font-bold text-center tablet:text-2xl', className)}
    style={style}
  >
    {children}
  </h2>
)

export const H3 = ({ className, style, children }) => (
  <h3
    className={cn('text-3xl font-bold text-center tablet:text-4xl', className)}
    style={style}
  >
    {children}
  </h3>
)

export const H4 = ({ className, style, children }) => (
  <h4 className={cn('text-xl font-bold text-center', className)} style={style}>
    {children}
  </h4>
)

export const P = ({ className, style, children }) => (
  <p className={cn('text-lg laptop:text-xl', className)} style={style}>
    {children}
  </p>
)
