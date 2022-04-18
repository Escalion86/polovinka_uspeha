const SvgWave = ({ color = '#9563ff', className }) => (
  <svg
    viewBox="0 0 436 662"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M226 339C187.096 318.679 120.5 339 0 0V662H436C383 525.5 371.5 415 226 339Z"
      fill={color}
    />
    <path
      d="M226 339C187.096 318.679 120.5 339 0 0V662H436C383 525.5 371.5 415 226 339Z"
      opacity="0.2"
      fill="black"
    />
  </svg>
)

export default SvgWave
