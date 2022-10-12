import cn from 'classnames'
import ListWrapper from './ListWrapper'

const CardListWrapper = ({ children, className }) => {
  return (
    <ListWrapper className={cn('bg-opacity-15 bg-general', className)}>
      {children}
    </ListWrapper>
  )
}

export default CardListWrapper
