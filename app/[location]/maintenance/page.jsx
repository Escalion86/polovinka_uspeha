import Link from 'next/link'

export const metadata = {
  title: 'Технические работы - Половинка успеха',
}

export default async function LocationMaintenancePage({ params }) {
  const { location } = await params

  return (
    <main className="min-h-screen bg-[#f6ecef] text-[#2b1b21]">
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center px-6 text-center">
        <h1 className="font-lora text-[clamp(32px,6vw,56px)] font-bold leading-tight">
          На сайте ведутся технические работы
        </h1>
        <p className="mt-6 max-w-2xl text-[18px] leading-relaxed text-[#5b4850]">
          Мы обновляем сервис и скоро вернемся. Спасибо за понимание.
        </p>
        <div className="mt-10">
          <Link
            prefetch={false}
            href={`/${location}/logindev`}
            className="rounded-xl border border-[#6b1f2a] px-4 py-2 text-sm font-semibold text-[#6b1f2a] hover:bg-[#6b1f2a] hover:text-white"
          >
            Вход для разработчика
          </Link>
        </div>
      </div>
    </main>
  )
}
