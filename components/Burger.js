import menuOpenAtom from '@state/atoms/menuOpen'
import cn from 'classnames'
import { useAtom } from 'jotai'

const Burger = () => {
  const [menuOpen, setMenuOpen] = useAtom(menuOpenAtom)
  return (
    <div
      className={'menu-btn' + (menuOpen ? ' open' : '')}
      onClick={() => setMenuOpen((state) => !state)}
    >
      <div
        className={cn(
          'after:bg-white before:bg-white menu-btn__burger after:shadow-large before:shadow-large',
          !menuOpen ? 'bg-white shadow-large' : ''
        )}
      />
    </div>
  )
}

export default Burger
