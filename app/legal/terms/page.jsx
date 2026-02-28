import Link from 'next/link'

export const metadata = {
  title: 'Пользовательское соглашение',
}

export default function TermsPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8 text-[#2b1b21]">
      <h1 className="text-2xl font-bold">Пользовательское соглашение</h1>
      <div className="mt-4 space-y-4 text-sm leading-relaxed">
        <p>
          Настоящее Пользовательское соглашение регулирует условия использования
          платформы «Половинка успеха».
        </p>
        <h2 className="text-lg font-semibold">1. Общие положения</h2>
        <p>
          Используя платформу, пользователь подтверждает, что ознакомлен с
          условиями настоящего соглашения и принимает их в полном объеме.
        </p>
        <h2 className="text-lg font-semibold">2. Регистрация и аккаунт</h2>
        <p>
          Пользователь обязуется указывать достоверные данные при регистрации и
          обеспечивать сохранность доступа к своему аккаунту.
        </p>
        <h2 className="text-lg font-semibold">3. Правила использования</h2>
        <p>
          Запрещены действия, нарушающие законодательство РФ, права третьих лиц,
          нормы этики сообщества, а также попытки нарушения работоспособности
          платформы.
        </p>
        <h2 className="text-lg font-semibold">4. Мероприятия и коммуникации</h2>
        <p>
          Платформа предоставляет инструменты регистрации на мероприятия и
          коммуникации с организаторами. Администрация вправе модерировать
          контент, отменять или ограничивать доступ при нарушении правил.
        </p>
        <h2 className="text-lg font-semibold">5. Ограничение ответственности</h2>
        <p>
          Сервис предоставляется «как есть». Администрация предпринимает меры для
          стабильной работы, но не гарантирует абсолютную бесперебойность и не
          несет ответственности за обстоятельства вне разумного контроля.
        </p>
        <h2 className="text-lg font-semibold">6. Персональные данные</h2>
        <p>
          Обработка персональных данных осуществляется в соответствии с Политикой
          конфиденциальности:{' '}
          <Link
            href="/legal/privacy-policy"
            className="font-semibold underline text-[#6b1f2a] hover:text-[#8b2a38]"
          >
            /legal/privacy-policy
          </Link>
          .
        </p>
        <h2 className="text-lg font-semibold">7. Контакты</h2>
        <p>
          По вопросам, связанным с настоящим соглашением, можно обратиться по
          email:{' '}
          <a
            href="mailto:polovinka.krsk24@gmail.com"
            className="font-semibold underline text-[#6b1f2a] hover:text-[#8b2a38]"
          >
            polovinka.krsk24@gmail.com
          </a>
          .
        </p>
      </div>
    </main>
  )
}
