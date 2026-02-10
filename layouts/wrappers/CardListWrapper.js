import cn from 'classnames'
import ListWrapper from './ListWrapper'

const CardListWrapper = ({ children, className }) => {
  return (
    <ListWrapper wrapperClassName={cn('bg-general/15', className)}>
      {children}
    </ListWrapper>
  )
}

export default CardListWrapper
