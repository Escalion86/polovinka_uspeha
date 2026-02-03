'use client'

import Link from 'next/link'

export default function LocationLogin3Page() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f7f7fb] text-[#1d1b1f]">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(160deg,#f8f9fb_0%,#eef3f8_100%)]" />
        <div className="absolute -left-20 top-28 h-84 w-84 rounded-full bg-[radial-gradient(circle,rgba(141,207,242,0.7),rgba(141,207,242,0.1))] login3-orb login3-orb--blue" />
        <div className="absolute -right-16 bottom-4 h-76 w-76 rounded-full bg-[radial-gradient(circle,rgba(107,31,42,0.55),rgba(107,31,42,0.08))] login3-orb login3-orb--burgundy" />
        <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(107,31,42,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(107,31,42,0.04)_1px,transparent_1px)] [background-size:80px_80px]" />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-8 py-12">
        <div className="grid w-full max-w-[980px] gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div className="flex-col justify-center hidden gap-6 lg:flex">
            {/* <div className="flex items-center gap-3">
              <img
                src="/img/logo_horizontal.png"
                alt="Половинка успеха"
                className="object-contain h-16 w-36"
              />
            </div> */}
            <h1 className="font-bold font-lora text-[clamp(28px,3vw,44px)] leading-tight text-[#2b1b21]">
              Войдите в пространство живых встреч
            </h1>
            <p className="max-w-[520px] text-[16px] leading-relaxed text-[#3a2c33]">
              Личный кабинет помогает быстро записываться на мероприятия,
              следить за статусом заявок и получать персональные рекомендации.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-[rgba(107,31,42,0.15)] bg-white/80 p-4 shadow-[0_12px_24px_rgba(0,0,0,0.06)]">
                <div className="text-sm font-semibold text-[#6b1f2a]">
                  Живые встречи
                </div>
                <div className="mt-2 text-sm text-[#3a2c33]">
                  Настоящие эмоции без ожиданий и масок.
                </div>
              </div>
              <div className="rounded-2xl border border-[rgba(107,31,42,0.15)] bg-white/80 p-4 shadow-[0_12px_24px_rgba(0,0,0,0.06)]">
                <div className="text-sm font-semibold text-[#6b1f2a]">
                  Удобный доступ
                </div>
                <div className="mt-2 text-sm text-[#3a2c33]">
                  Всё в одном месте: события, заявки и новости.
                </div>
              </div>
            </div>
          </div>

          <div className="w-full max-w-[450px] justify-self-center rounded-[28px] border border-[rgba(107,31,42,0.12)] bg-white/25 p-8 shadow-[0_24px_48px_rgba(15,23,42,0.15)] backdrop-blur">
            <div className="flex flex-col items-center gap-4">
              <img
                src="/img/logo.webp"
                alt="Половинка успеха"
                className="object-contain rounded-full w-30 h-30"
              />
              <div className="text-center">
                <div className="text-2xl font-bold text-[#2b1b21]">
                  Авторизация
                </div>
                <div className="text-sm text-[#5d4a52]">
                  Введите телефон и пароль
                </div>
              </div>
            </div>

            <div className="grid gap-4 mt-6">
              <label className="grid gap-2 text-sm font-semibold text-[#6b1f2a]">
                Телефон
                <input
                  type="tel"
                  placeholder="+7 (___) ___-__-__"
                  className="h-12 rounded-full border border-[rgba(107,31,42,0.2)] bg-white px-4 text-sm text-[#2b1b21] shadow-[0_10px_18px_rgba(15,23,42,0.08)] focus:outline-none focus:ring-2 focus:ring-[rgba(141,207,242,0.7)]"
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-[#6b1f2a]">
                Пароль
                <input
                  type="password"
                  placeholder="Введите пароль"
                  className="h-12 rounded-full border border-[rgba(107,31,42,0.2)] bg-white px-4 text-sm text-[#2b1b21] shadow-[0_10px_18px_rgba(15,23,42,0.08)] focus:outline-none focus:ring-2 focus:ring-[rgba(141,207,242,0.7)]"
                />
              </label>
              <button
                type="button"
                className="h-12 rounded-full bg-[linear-gradient(135deg,#6b1f2a,#8a3a45)] text-sm font-semibold uppercase tracking-[0.08em] text-white shadow-[0_14px_30px_rgba(107,31,42,0.25)]"
              >
                Войти
              </button>
              <button
                type="button"
                className="h-12 rounded-full border border-[rgba(107,31,42,0.2)] bg-white text-sm font-semibold uppercase tracking-[0.08em] text-[#6b1f2a]"
              >
                Зарегистрироваться
              </button>
            </div>

            <div className="mt-6 text-center text-sm text-[#5d4a52]">
              Забыли пароль?{' '}
              <Link href="/login" className="font-semibold text-[#6b1f2a]">
                Восстановить
              </Link>
            </div>
          </div>
        </div>
      </div>
      <style jsx global>{`
        .login3-orb {
          animation: login3-float 8s ease-in-out infinite;
        }
        .login3-orb--burgundy {
          animation-delay: 2.5s;
        }
        @keyframes login3-float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-125px);
          }
        }
      `}</style>
    </div>
  )
}
