import cn from 'classnames'

const Divider = ({ type = 'horizontal', light = false, thin = false }) => {
  return type === 'horizontal' ? (
    <div
      className={cn('w-auto', thin ? 'my-1' : 'my-3')}
      style={{
        height: 1,
        borderTop: '1px solid ' + (light ? '#d1d7dc' : '#3e4143'),
      }}
    />
  ) : (
    <div
      className={cn('h-auto', thin ? 'mx-1' : 'mx-3')}
      style={{
        width: 1,
        borderLeft: '1px solid ' + (light ? '#d1d7dc' : '#3e4143'),
      }}
    />
  )
}

export default Divider
