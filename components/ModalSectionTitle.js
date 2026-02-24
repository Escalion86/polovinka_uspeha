import cn from 'classnames'
import PropTypes from 'prop-types'

const ModalSectionTitle = ({ children, className }) => (
  <h3
    className={cn(
      'mb-2 text-sm font-bold uppercase tracking-[0.08em] text-[#6b1f2a]',
      className
    )}
  >
    {children}
  </h3>
)

ModalSectionTitle.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
}

export default ModalSectionTitle
