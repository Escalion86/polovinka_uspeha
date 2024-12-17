import cn from 'classnames'

const CountDownTimer = ({}) => {
  return (
    <div className="box-border relative h-[310px]">
      <div className="h-full mx-auto my-0">
        <div
          className="inline-flex flex-col rounded-[0.1em]"
          data-init-value="24"
        >
          <div
            className={cn(
              'relative bg-white text-[3rem] shadow-light rounded-[0.1em] text-black',
              'before:absolute before:text-black before:h-1/2 before:text-center before:w-full before:pt-[0.25em] before:bg-red-200'
            )}
            style={{ lineHeight: 1, content: '5' }}
          >
            <span
              style={{ lineHeight: 1 }}
              className={cn(
                'box-border overflow-hidden p-[0.25em] h-[0.75em] bg-[#f7f7f7] rounded-t-[0.1em] flex border-b-[1px] border-black/10'
              )}
            >
              2
            </span>
            <span
              style={{ lineHeight: 1 }}
              className="box-border overflow-hidden p-[0.25em] h-[0.75em] bg-white flex items-end rounded-b-[0.1em]"
            >
              2
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CountDownTimer
