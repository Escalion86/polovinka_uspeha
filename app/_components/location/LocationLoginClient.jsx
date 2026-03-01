'use client'

import PropTypes from 'prop-types'
import Link from 'next/link'
import { getSession, signIn } from 'next-auth/react'
import { InputMask, format } from '@react-input/mask'
import useRouter from '@utils/useRouter'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  normalizePhoneMaskState,
  PHONE_MASK,
  PHONE_REPLACEMENT,
  normalizePhoneValue,
} from '@helpers/phoneUtils'
import { captureAttributionFromBrowser } from '@helpers/attribution'
import VkIdOneTapAuth from './VkIdOneTapAuth'
import CityAccessLoading from '@components/CityAccessLoading'
import CityAccessUnavailable from '@components/CityAccessUnavailable'
import AuthPageFrame from '@components/AuthPageFrame'
import AuthSplitLayout from '@components/AuthSplitLayout'
import AuthField from '@components/AuthField'
import AuthInput, { AUTH_INPUT_CLASS } from '@components/AuthInput'
import AuthButton from '@components/AuthButton'
import useCityAccess from '@hooks/useCityAccess'
import useVkAuthAvailability from '@hooks/useVkAuthAvailability'

const routeAfterLogin = (router, location) => {
  if (router.query?.page) {
    return router.push(`/${location}/cabinet/${router.query?.page}`, '', {
      shallow: true,
    })
  }

  if (router.query?.event) {
    return router.push(
      {
        pathname: `/${location}/cabinet/eventsCalendar`,
        query: { event: router.query?.event },
      },
      '',
      { shallow: true }
    )
  }

  if (router.query?.service) {
    return router.push(`/${location}/service/${router.query?.service}`, '', {
      shallow: true,
    })
  }

  return router.push(`/${location}/cabinet`, '', { shallow: true })
}

const waitForSessionReady = async (attempts = 6, delayMs = 150) => {
  for (let i = 0; i < attempts; i += 1) {
    const session = await getSession()
    if (session?.user?._id || session?.user?.name) return true
    await new Promise((resolve) => setTimeout(resolve, delayMs))
  }
  return false
}

export default function LocationLoginClient({
  location,
  forceDisableVkAuth = false,
}) {
  const router = useRouter()
  const [phone, setPhone] = useState('')
  const [phoneFocused, setPhoneFocused] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const {
    accessLoading,
    isAllowed: isLoginAllowed,
    currentCityTitle,
    currentCityStatus,
    alternativeCities: alternativeLoginCities,
  } = useCityAccess({
    location,
    allowField: 'allowLogin',
    alternativesField: 'availableForLogin',
  })
  const isVkAuthEnabled = useVkAuthAvailability(location) && !forceDisableVkAuth
  const shouldShowTransferNotice =
    currentCityStatus !== 'active' && alternativeLoginCities.length > 0

  const rawPhoneValue = phone ? String(phone) : ''
  const displayDigits = rawPhoneValue || (phoneFocused ? '7' : '')
  const phoneDisplayValue = displayDigits
    ? format(displayDigits, {
        mask: PHONE_MASK,
        replacement: PHONE_REPLACEMENT,
      })
    : ''

  const baseQuery = useMemo(() => {
    const nextQuery = { ...router.query }
    delete nextQuery.location
    delete nextQuery.registration
    return nextQuery
  }, [router.query])

  useEffect(() => {
    captureAttributionFromBrowser()
  }, [])

  const handleSubmit = useCallback(
    async (event) => {
      event?.preventDefault()
      if (loading) return

      if (!isLoginAllowed) {
        setError(
          `Авторизация в городе ${currentCityTitle || location} временно приостановлена`
        )
        return
      }

      const normalizedPhone = normalizePhoneValue(phone)
      const trimmedPassword = String(password || '').trim()

      if (!normalizedPhone || normalizedPhone.length < 11) {
        setError('Введите корректный номер телефона')
        return
      }

      if (!trimmedPassword) {
        setError('Введите пароль')
        return
      }

      setError('')
      setLoading(true)

      const result = await signIn('credentials', {
        redirect: false,
        phone: normalizedPhone,
        password: trimmedPassword,
        location,
      })

      if (result?.error === 'CredentialsSignin') {
        setPassword('')
        setError('Телефон или пароль не верны')
        setLoading(false)
        return
      }

      if (result?.error) {
        setError('Не удалось выполнить вход. Попробуйте еще раз.')
        setLoading(false)
        return
      }

      await waitForSessionReady()
      await routeAfterLogin(router, location)
    },
    [
      loading,
      isLoginAllowed,
      currentCityTitle,
      phone,
      password,
      location,
      router,
    ]
  )

  const handleRegistration = useCallback(() => {
    router.push(
      {
        pathname: `/${location}/register`,
        query: { ...baseQuery },
      },
      '',
      { shallow: false }
    )
  }, [router, location, baseQuery])

  const handlePhoneChange = useCallback((event) => {
    setPhone(normalizePhoneMaskState(event.target.value))
  }, [])

  if (accessLoading) {
    return (
      <AuthPageFrame>
        <CityAccessLoading message="Проверяем доступность входа..." />
      </AuthPageFrame>
    )
  }

  if (!isLoginAllowed) {
    return (
      <AuthPageFrame>
        <CityAccessUnavailable
          heading="Авторизация приостановлена"
          description="авторизация временно приостановлена. Вы можете перейти в другой город, где вход сейчас доступен."
          cityTitle={currentCityTitle}
          location={location}
          cities={alternativeLoginCities}
          buildCityHref={(slug) => `/${slug}/login`}
          emptyMessage="Сейчас нет других публичных городов с доступной авторизацией."
        />
      </AuthPageFrame>
    )
  }

  return (
    <AuthSplitLayout
      leftPanel={
        <>
          <h1 className="font-bold font-lora text-[clamp(28px,3vw,44px)] leading-tight text-[#2b1b21]">
            Войдите в пространство живых встреч
          </h1>
          <p className="max-w-[520px] text-[18px] leading-relaxed text-[#3a2c33]">
            Личный кабинет помогает быстро записываться на мероприятия, следить
            за статусом заявок и получать персональные рекомендации.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-[rgba(107,31,42,0.15)] bg-white/80 p-4 shadow-[0_12px_24px_rgba(0,0,0,0.06)]">
              <div className="text-[16px] font-semibold text-[#6b1f2a]">
                Живые встречи
              </div>
              <div className="mt-2 text-[16px] text-[#3a2c33]">
                Настоящие эмоции без ожиданий и масок.
              </div>
            </div>
            <div className="rounded-2xl border border-[rgba(107,31,42,0.15)] bg-white/80 p-4 shadow-[0_12px_24px_rgba(0,0,0,0.06)]">
              <div className="text-[16px] font-semibold text-[#6b1f2a]">
                Удобный доступ
              </div>
              <div className="mt-2 text-[16px] text-[#3a2c33]">
                Всё в одном месте: события, заявки и новости.
              </div>
            </div>
          </div>
        </>
      }
      rightPanel={
        <>
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

          <div className="mt-6 grid gap-4">
            {shouldShowTransferNotice ? (
              <div className="rounded-2xl border border-[rgba(107,31,42,0.18)] bg-[#fff8fa] p-4 shadow-[0_10px_18px_rgba(107,31,42,0.08)]">
                <div className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6b1f2a]">
                  Город в режиме закрытия
                </div>
                <div className="mt-2 text-sm leading-relaxed text-[#3a2c33]">
                  В городе {currentCityTitle || location} личный кабинет доступен
                  только в ограниченном режиме. Для новых действий перейдите в
                  активный город:
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {alternativeLoginCities.map((city) => (
                    <Link
                      key={city.slug}
                      href={`/${city.slug}/login`}
                      className="rounded-full border border-[rgba(107,31,42,0.18)] bg-white px-4 py-1.5 text-xs font-semibold text-[#6b1f2a] transition hover:-translate-y-0.5 hover:shadow-[0_8px_16px_rgba(107,31,42,0.12)]"
                    >
                      {city.title}
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}

            {isVkAuthEnabled ? (
              <>
                <VkIdOneTapAuth
                  location={location}
                  mode="login"
                  onSuccess={async () => {
                    await routeAfterLogin(router, location)
                  }}
                  onError={(message) => {
                    setError(message || 'Не удалось выполнить вход через VK ID')
                  }}
                />
                <div className="text-center text-xs uppercase tracking-[0.1em] text-[#6b1f2a]/55">
                  или войдите по номеру телефона
                </div>
                {/* <div className="-mt-2 text-center text-[11px] leading-relaxed text-[#5d4a52]">
                    При входе через VK ID используются данные вашего VK-профиля.
                  </div> */}
              </>
            ) : null}
          </div>

          <form className="grid gap-4 mt-4" onSubmit={handleSubmit}>

            <AuthField label="Телефон">
              <InputMask
                name="phone"
                type="tel"
                mask={PHONE_MASK}
                replacement={PHONE_REPLACEMENT}
                showMask={phoneFocused}
                value={phoneDisplayValue}
                onFocus={() => setPhoneFocused(true)}
                onBlur={() => setPhoneFocused(false)}
                onChange={handlePhoneChange}
                placeholder="+7 (___) ___-__-__"
                className={AUTH_INPUT_CLASS}
              />
            </AuthField>
            <AuthField label="Пароль">
              <AuthInput
                type="password"
                placeholder="Введите пароль"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </AuthField>
            {error ? (
              <div className="text-sm text-[#b4232d]">{error}</div>
            ) : null}
            <AuthButton type="submit" disabled={loading} aria-busy={loading}>
              {loading ? 'Входим...' : 'Войти в пространство'}
            </AuthButton>
            <AuthButton
              type="button"
              variant="secondary"
              onClick={handleRegistration}
            >
              Присоединиться к нам
            </AuthButton>
          </form>

          <div className="mt-6 text-center text-sm text-[#5d4a52]">
            Забыли пароль?{' '}
            <Link
              href={`/${location}/recovery`}
              className="font-semibold text-[#6b1f2a]"
            >
              Восстановить
            </Link>
          </div>
          <div className="mt-3 text-center text-sm text-[#5d4a52]">
            <Link
              href={`/${location}`}
              className="font-semibold text-[#6b1f2a]"
            >
              Перейти на главную страницу
            </Link>
          </div>
        </>
      }
    />
  )
}

LocationLoginClient.propTypes = {
  location: PropTypes.string.isRequired,
  forceDisableVkAuth: PropTypes.bool,
}
