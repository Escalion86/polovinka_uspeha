import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import { faPlus, faQuestion } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import cn from 'classnames'

const FabItem = ({
  href,
  text,
  onClick,
  icon = faPlus,
  bgClass = 'bg-general',
}) => {
  const Wrapper = (props) =>
    href ? (
      <a {...props} href={href} target="_blank" />
    ) : (
      <div {...props} onClick={onClick} />
    )

  return (
    <Wrapper className="flex flex-row-reverse items-center pb-4 duration-300 cursor-pointer hover:brightness-125 min-w-[48px]">
      <div
        className={cn(
          'z-10 scale-0 group-hover:scale-100 group-hover:delay-0 duration-300 delay-300 relative flex items-center justify-center rounded-full fab w-[48px] h-[48px] group max-h-[48px] max-w-[48px] min-w-[48px] min-h-[48px]',
          bgClass
        )}
      >
        <FontAwesomeIcon
          className="z-10 w-6 h-6 text-white max-w-6 max-h-6"
          icon={icon}
        />
      </div>
      <div className="-mr-6 overflow-hidden duration-300 group-hover:delay-200 max-w-0 group-hover:max-w-full">
        <div className="flex w-full max-w-full bg-white border border-general flex-nowrap rounded-l-md">
          <div className="pl-2 font-bold whitespace-nowrap text-general">
            {text}
          </div>
          <div className="bg-white min-w-8" />
        </div>
      </div>
    </Wrapper>
  )
}

const fabs = [
  {
    text: 'Сложности с записью',
    icon: faWhatsapp,
    bgClass: 'bg-green-700',
    href: 'https://wa.me/79504280891',
  },
  {
    text: 'Вопросы по мероприятиям',
    icon: faWhatsapp,
    bgClass: 'bg-green-700',
    href: 'https://wa.me/79504280891',
  },
  {
    text: 'Технические проблемы',
    icon: faWhatsapp,
    bgClass: 'bg-green-700',
    href: 'https://wa.me/79138370020',
  },
]

const FabMenu = ({ show = true, ping = true }) => {
  return (
    <div
      className={cn(
        'select-none z-10 transition duration-300 flex flex-col justify-end fixed right-7 group',
        show
          ? // 'fab-top'
            'bottom-10'
          : '-bottom-20'
      )}
    >
      <div className="flex flex-col items-end justify-end max-w-12">
        <div className="h-0 overflow-hidden transition-all delay-700 group-hover:h-full group-hover:delay-0">
          {fabs.map((props) => (
            <FabItem {...props} />
          ))}
        </div>
        <div
          className={cn(
            'relative flex items-center justify-center rounded-full cursor-pointer fab w-[48px] h-[48px] group max-h-[48px] max-w-[48px] bg-general'
          )}
          // onClick={onClick}
          // ref={wrapperRef}
        >
          <FontAwesomeIcon
            className="z-10 w-6 h-6 text-white duration-200 max-w-6 max-h-6 group-hover:scale-125"
            icon={faQuestion}
          />
        </div>
        {ping && (
          <div
            className={cn(
              'absolute animate-ping w-[48px] h-[48px] max-h-[48px] max-w-[48px] rounded-full bg-general'
            )}
          />
        )}
      </div>
    </div>
  )
}

export default FabMenu
