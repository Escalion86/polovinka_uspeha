'use client'

import PropTypes from 'prop-types'

const BASE_CLASS =
  'rounded-full font-semibold uppercase tracking-[0.08em] transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8dcff2] disabled:cursor-not-allowed disabled:opacity-70'

const VARIANT_CLASS = {
  primary:
    'bg-[linear-gradient(135deg,#6b1f2a,#8a3a45)] text-white shadow-[0_14px_30px_rgba(107,31,42,0.25)] hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(107,31,42,0.32)]',
  secondary:
    'border border-[rgba(107,31,42,0.2)] bg-white text-[#6b1f2a] hover:-translate-y-0.5 hover:border-[rgba(107,31,42,0.4)] hover:shadow-[0_12px_24px_rgba(107,31,42,0.12)]',
}

const SIZE_CLASS = {
  md: 'h-12 text-sm',
  sm: 'h-11 text-xs',
}

export default function AuthButton({
  variant,
  size,
  className,
  children,
  ...props
}) {
  const variantClass = VARIANT_CLASS[variant] || VARIANT_CLASS.primary
  const sizeClass = SIZE_CLASS[size] || SIZE_CLASS.md
  return (
    <button
      {...props}
      className={`${BASE_CLASS} ${variantClass} ${sizeClass} ${className}`.trim()}
    >
      {children}
    </button>
  )
}

AuthButton.propTypes = {
  variant: PropTypes.oneOf(['primary', 'secondary']),
  size: PropTypes.oneOf(['md', 'sm']),
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
}

AuthButton.defaultProps = {
  variant: 'primary',
  size: 'md',
  className: '',
}
