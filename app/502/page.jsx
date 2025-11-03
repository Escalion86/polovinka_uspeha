import SvgLove from '@svg/SvgLove'

export const metadata = {
  title: 'Сайт обновляется - Половинка успеха',
}

export default function Page502() {
  const generalColor = '#7a5151'

  return (
    <div className="box-border w-screen h-screen overflow-y-auto">
      <div className="flex w-full h-full gap-2 px-2 bg-transparent">
        <div className="items-center justify-center flex-1 hidden pl-4 text-center laptop:flex">
          <SvgLove color={generalColor} className="w-124" />
        </div>
        <div className="flex items-center justify-center flex-1 text-center">
          <div className="flex flex-col items-center justify-center w-full">
            <img
              className="rounded-full h-1/6"
              src="/img/logo.webp"
              alt="logo"
            />
            <div className="text-4xl font-bold text-general">САЙТ ОБНОВЛЯЕТСЯ</div>
            <div>Обычно это занимает несколько минут</div>
          </div>
        </div>
      </div>
    </div>
  )
}
