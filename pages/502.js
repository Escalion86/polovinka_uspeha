// import SvgWave from 'svg/SvgWave'
import SvgLove from 'svg/SvgLove'
import tailwindConfig from 'tailwind.config.js'
import resolveConfig from 'tailwindcss/resolveConfig'

const Page502 = (props) => {
  const fullConfig = resolveConfig(tailwindConfig)
  const generalColor = fullConfig.theme.colors.general

  return (
    <div className="box-border w-screen h-screen overflow-y-auto">
      {/* <SvgWave
        color={generalColor}
        className="fixed top-0 left-0 hidden w-auto h-full laptop:block -z-10"
      /> */}
      <div className="flex w-full h-full gap-2 px-2 bg-transparent">
        <div className="items-center justify-center flex-1 hidden pl-4 text-center laptop:flex">
          <SvgLove color={generalColor} className="w-124" />
        </div>
        <div className="flex items-center justify-center flex-1 text-center">
          <div className="flex flex-col items-center justify-center w-full">
            {/* <SvgAvatar color={generalColor} className="w-24" /> */}
            <img
              className="rounded-full h-1/6"
              src={'/img/logo.webp'}
              alt="logo"
              // width={48}
              // height={48}
            />
            <div className="text-4xl font-bold text-general">
              САЙТ ОБНОВЛЯЕТСЯ
            </div>
            <div>Обычно это занимает несколько минут</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page502
