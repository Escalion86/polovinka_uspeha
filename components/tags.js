import cn from 'classnames'

export const H1 = ({ className, style, children, bold = true }) => (
  <h1
    className={cn(
      'text-3xl text-center tablet:text-4xl',
      { 'font-bold': bold },
      className
    )}
    style={style}
  >
    {children}
  </h1>
)

export const H2 = ({ className, style, children, bold = true }) => (
  <h2
    className={cn(
      'text-2xl text-center tablet:text-3xl',
      { 'font-bold': bold },
      className
    )}
    style={style}
  >
    {children}
  </h2>
)

export const H3 = ({ className, style, children, bold = true }) => (
  <h3
    className={cn(
      'text-lg text-center tablet:text-2xl',
      { 'font-bold': bold },
      className
    )}
    style={style}
  >
    {children}
  </h3>
)

export const H4 = ({ className, style, children, bold = true }) => (
  <h4
    className={cn('text-lg text-center', { 'font-bold': bold }, className)}
    style={style}
  >
    {children}
  </h4>
)

export const P = ({ className, style, children, bold = false }) => (
  <p
    className={cn('text-base laptop:text-xl', { 'font-bold': bold }, className)}
    style={style}
  >
    {children}
  </p>
)
