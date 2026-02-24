import cn from 'classnames'
import PropTypes from 'prop-types'

const ModalPillPanel = ({ children, className, paddingClassName = 'px-4 py-3' }) => (
  <div
    className={cn(
      'rounded-[30px] border border-[#f0e5ea] bg-white/90 shadow-[0_10px_18px_rgba(0,0,0,0.06)]',
      paddingClassName,
      className
    )}
  >
    {children}
  </div>
)

ModalPillPanel.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  paddingClassName: PropTypes.string,
}

export default ModalPillPanel
