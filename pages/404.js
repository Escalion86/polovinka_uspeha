import SvgWave from '@svg/SvgWave'

export function Error404() {
  return (
    <div className="box-border flex flex-col items-center justify-center w-full h-screen overflow-y-auto">
      {/* <Wave /> */}
      {/* <Image src="/public/img/login/wave.svg" width={174} height={84} /> */}
      <SvgWave
        color="#ffd6d6"
        className="fixed bottom-0 left-0 z-10 h-[40%] laptop:h-[50%] laptop:block"
      />
      <SvgWave
        color="#ffd6d6"
        className="fixed top-0 right-0 z-10 laptop:block -scale-100 h-[40%] laptop:h-[50%]"
      />
      <h1 className="text-5xl text-general">Ошибка 404</h1>
      <p>Страница не найдена</p>
    </div>
  )
}

export default Error404
