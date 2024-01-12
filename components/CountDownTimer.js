import cn from 'classnames'

const CountDownTimer = ({}) => {
  return (
    <div className="box-border relative h-[310px]">
      <div className="h-full mx-auto my-0">
        <div
          className="inline-flex flex-col rounded-[0.1em]"
          data-init-value="24"
        >
          {/* <span className="mb-[15px] text-black uppercase">Hours</span> */}

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
                'box-border overflow-hidden p-[0.25em] h-[0.75em] bg-[#f7f7f7] rounded-t-[0.1em] flex border-b-[1px] border-black border-opacity-10'
              )}
            >
              2
            </span>
            {/* <span className="overflow-hidden h-1/2">
              <span>2</span>
            </span> */}
            <span
              style={{ lineHeight: 1 }}
              className="box-border overflow-hidden p-[0.25em] h-[0.75em] bg-white flex items-end rounded-b-[0.1em]"
            >
              2
            </span>
            {/* <span className="bottom-back">
              <span>2</span>
            </span> */}
          </div>
        </div>
        {/* 
        <div className="bloc-time min" data-init-value="0">
          <span className="count-title">Minutes</span>

          <div className="figure min min-1">
            <span className="top">0</span>
            <span className="top-back">
              <span>0</span>
            </span>
            <span className="bottom">0</span>
            <span className="bottom-back">
              <span>0</span>
            </span>
          </div>

          <div className="figure min min-2">
            <span className="top">0</span>
            <span className="top-back">
              <span>0</span>
            </span>
            <span className="bottom">0</span>
            <span className="bottom-back">
              <span>0</span>
            </span>
          </div>
        </div>

        <div className="bloc-time sec" data-init-value="0">
          <span className="count-title">Seconds</span>

          <div className="figure sec sec-1">
            <span className="top">0</span>
            <span className="top-back">
              <span>0</span>
            </span>
            <span className="bottom">0</span>
            <span className="bottom-back">
              <span>0</span>
            </span>
          </div>

          <div className="figure sec sec-2">
            <span className="top">0</span>
            <span className="top-back">
              <span>0</span>
            </span>
            <span className="bottom">0</span>
            <span className="bottom-back">
              <span>0</span>
            </span>
          </div>
        </div> */}
      </div>
    </div>
  )
}

export default CountDownTimer
