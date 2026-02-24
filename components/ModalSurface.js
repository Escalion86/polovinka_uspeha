import cn from 'classnames'
import PropTypes from 'prop-types'

const TONE_CLASSNAME = {
  plain:
    'rounded-2xl border border-[#f0e2e8] bg-white shadow-[0_6px_16px_rgba(0,0,0,0.05)]',
  accent:
    'rounded-2xl border border-[#ead7de] bg-[linear-gradient(135deg,#fff,#f9f2f5)] shadow-[0_8px_24px_rgba(107,31,42,0.08)]',
  media: 'overflow-hidden rounded-2xl border border-[#ead7de] shadow-[0_12px_28px_rgba(0,0,0,0.2)]',
}

const ModalSurface = ({
  children,
  className,
  tone = 'plain',
  paddingClassName = 'p-4',
  noPadding = false,
}) => (
  <div
    className={cn(
      TONE_CLASSNAME[tone] ?? TONE_CLASSNAME.plain,
      !noPadding && paddingClassName,
      className
    )}
  >
    {children}
  </div>
)

ModalSurface.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  tone: PropTypes.oneOf(['plain', 'accent', 'media']),
  paddingClassName: PropTypes.string,
  noPadding: PropTypes.bool,
}

export default ModalSurface
