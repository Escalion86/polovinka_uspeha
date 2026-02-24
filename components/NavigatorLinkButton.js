import cn from 'classnames'
import PropTypes from 'prop-types'

const NavigatorLinkButton = ({
  href,
  title,
  imgSrc,
  imgAlt,
  children,
  className,
}) => (
  <a
    data-tip={title}
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={cn(
      'flex gap-x-2 items-center rounded-lg border border-[#f0e2e8] p-1 transition hover:bg-[#f7f1f4]',
      className
    )}
  >
    <img
      className="object-contain w-6 h-6 min-w-6 min-h-6"
      src={imgSrc}
      alt={imgAlt}
    />
    <div>{children}</div>
  </a>
)

NavigatorLinkButton.propTypes = {
  href: PropTypes.string,
  title: PropTypes.string,
  imgSrc: PropTypes.string,
  imgAlt: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
}

export default NavigatorLinkButton
