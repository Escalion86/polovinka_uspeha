export const metadata = {
  title: 'Технические работы - Половинка успеха',
}

export default function MaintenancePage() {
  return (
    <main className="min-h-screen bg-[#f6ecef] text-[#2b1b21]">
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center px-6 text-center">
        <h1 className="font-lora text-[clamp(32px,6vw,56px)] font-bold leading-tight">
          На сайте ведутся технические работы
        </h1>
        <p className="mt-6 max-w-2xl text-[18px] leading-relaxed text-[#5b4850]">
          Мы обновляем сервис и скоро вернемся. Спасибо за понимание.
        </p>
      </div>
    </main>
  )
}
