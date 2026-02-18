'use client'

import PropTypes from 'prop-types'
import Link from 'next/link'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { InputMask, format } from '@react-input/mask'
import useRouter from '@utils/useRouter'
import { postData } from '@helpers/CRUD'
import phoneValidator from '@helpers/phoneValidator'
import passwordValidator from '@helpers/passwordValidator'
import {
  normalizePhoneMaskState,
  PHONE_MASK,
  PHONE_REPLACEMENT,
  normalizePhoneValue,
} from '@helpers/phoneUtils'
import { captureAttributionFromBrowser } from '@helpers/attribution'

const buildMaskedPhone = (phone, focused) => {
  const rawPhoneValue = phone ? String(phone) : ''
  const displayDigits = rawPhoneValue || (focused ? '7' : '')
  const maskedValue = displayDigits
    ? format(displayDigits, {
        mask: PHONE_MASK,
        replacement: PHONE_REPLACEMENT,
      })
    : ''
  return {
    phoneMask: PHONE_MASK,
    phoneReplacement: PHONE_REPLACEMENT,
    maskedValue,
  }
}

const defaultErrors = {
  phone: '',
  password: '',
  general: '',
}

export default function LocationRecoveryClient({ location }) {
  const router = useRouter()
  const [phone, setPhone] = useState('')
  const [phoneFocused, setPhoneFocused] = useState(false)
  const [password, setPassword] = useState('')
  const [passwordRepeat, setPasswordRepeat] = useState('')
  const [errors, setErrors] = useState(defaultErrors)
  const [step, setStep] = useState(1)
  const [waiting, setWaiting] = useState(false)
  const [backCallRes, setBackCallRes] = useState(null)
  const pollTimerRef = useRef(null)

  const { phoneMask, phoneReplacement, maskedValue } = useMemo(
    () => buildMaskedPhone(phone, phoneFocused),
    [phone, phoneFocused]
  )

  const clearErrors = () => setErrors(defaultErrors)

  const stopPolling = useCallback(() => {
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current)
      pollTimerRef.current = null
    }
  }, [])

  useEffect(() => () => stopPolling(), [stopPolling])
  useEffect(() => {
    captureAttributionFromBrowser()
  }, [])

  const handlePhoneChange = useCallback((event) => {
    setPhone(normalizePhoneMaskState(event.target.value))
  }, [])

  const startPolling = useCallback(
    (callId) => {
      stopPolling()
      pollTimerRef.current = setInterval(() => {
        postData(
          '/api/telefonip',
          {
            phone,
            location,
            checkBackCallId: callId,
          },
          (res) => {
            const status = res?.data?.status
            if (status === 'expired') {
              stopPolling()
              setWaiting(false)
              setBackCallRes({ ...(res?.data ?? {}), status: 'expired' })
              return
            }
            if (status === 'ok') {
              stopPolling()
              setWaiting(false)
              const phoneFromService = String(res?.data?.phone || '').substring(1)
              const phoneLocal = String(phone || '').substring(1)
              if (phoneFromService && phoneFromService === phoneLocal) {
                setBackCallRes(null)
                setStep(3)
              } else {
                setBackCallRes({ ...(res?.data ?? {}), status: 'wrong phone' })
              }
            }
          },
          null,
          false,
          null,
          true
        )
      }, 3000)
    },
    [location, phone, stopPolling]
  )

  const requestBackCall = useCallback(async () => {
    clearErrors()
    const normalizedPhone = normalizePhoneValue(phone)

    if (!normalizedPhone || !phoneValidator(normalizedPhone)) {
      setErrors({ ...defaultErrors, phone: 'Введите корректный номер телефона' })
      return
    }

    setWaiting(true)
    const res = await postData(
      '/api/telefonip',
      {
        phone: normalizedPhone,
        location,
        forgotPassword: true,
        backCall: true,
      },
      null,
      null,
      false,
      null,
      true
    )

    if (!res) {
      setWaiting(false)
      setErrors({
        ...defaultErrors,
        general: 'Не удалось отправить запрос. Попробуйте еще раз.',
      })
      return
    }

    if (res?.error) {
      setWaiting(false)
      setErrors({ ...defaultErrors, phone: res.error.message })
      return
    }

    const responseData = res?.data ?? res
    if (!responseData?.id) {
      setWaiting(false)
      setErrors({
        ...defaultErrors,
        general: 'Не удалось получить номер для звонка. Попробуйте позже.',
      })
      return
    }

    setStep(2)
    setBackCallRes(responseData)
    setWaiting(true)
    startPolling(responseData.id)
  }, [location, phone, startPolling])

  const handleResetPassword = useCallback(async () => {
    clearErrors()
    const normalizedPhone = normalizePhoneValue(phone)

    if (!normalizedPhone || !phoneValidator(normalizedPhone)) {
      setErrors({ ...defaultErrors, phone: 'Введите корректный номер телефона' })
      return
    }

    if (!passwordValidator(password)) {
      setErrors({
        ...defaultErrors,
        password: 'Пароль должен быть длинной не менее 8 символов',
      })
      return
    }

    if (password !== passwordRepeat) {
      setErrors({ ...defaultErrors, password: 'Пароли не совпадают' })
      return
    }

    setWaiting(true)
    const res = await postData(
      '/api/telefonip',
      {
        phone: normalizedPhone,
        password,
        location,
        forgotPassword: true,
      },
      null,
      null,
      false,
      null,
      true
    )

    if (!res) {
      setWaiting(false)
      setErrors({
        ...defaultErrors,
        general: 'Не удалось сохранить пароль. Попробуйте позже.',
      })
      return
    }

    if (res?.error) {
      setWaiting(false)
      setErrors({ ...defaultErrors, general: res.error.message })
      return
    }

    router.push(`/${location}/login`)
  }, [location, password, passwordRepeat, phone, router])

  const resetFlow = useCallback(() => {
    stopPolling()
    setWaiting(false)
    setBackCallRes(null)
    setStep(1)
    setErrors(defaultErrors)
  }, [stopPolling])

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
            <h1 className="font-bold font-lora text-[clamp(28px,3vw,44px)] leading-tight text-[#2b1b21]">
              Восстановите доступ за пару минут
            </h1>
            <p className="max-w-[520px] text-[16px] leading-relaxed text-[#3a2c33]">
              Мы подтвердим номер через бесплатный звонок и поможем задать новый
              пароль для входа.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-[rgba(107,31,42,0.15)] bg-white/80 p-4 shadow-[0_12px_24px_rgba(0,0,0,0.06)]">
                <div className="text-sm font-semibold text-[#6b1f2a]">
                  Безопасно
                </div>
                <div className="mt-2 text-sm text-[#3a2c33]">
                  Подтверждение по звонку защищает ваш аккаунт.
                </div>
              </div>
              <div className="rounded-2xl border border-[rgba(107,31,42,0.15)] bg-white/80 p-4 shadow-[0_12px_24px_rgba(0,0,0,0.06)]">
                <div className="text-sm font-semibold text-[#6b1f2a]">
                  Быстро
                </div>
                <div className="mt-2 text-sm text-[#3a2c33]">
                  Весь процесс занимает пару минут.
                </div>
              </div>
            </div>
          </div>

          <div className="w-full max-w-[460px] justify-self-center rounded-[28px] border border-[rgba(107,31,42,0.12)] bg-white/25 p-8 shadow-[0_24px_48px_rgba(15,23,42,0.15)] backdrop-blur">
            <div className="flex flex-col items-center gap-4">
              <img
                src="/img/logo.webp"
                alt="Половинка успеха"
                className="object-contain rounded-full w-30 h-30"
              />
              <div className="text-center">
                <div className="text-2xl font-bold text-[#2b1b21]">
                  Восстановление пароля
                </div>
                <div className="text-sm text-[#5d4a52]">
                  {step === 1 && 'Введите телефон для подтверждения'}
                  {step === 2 && 'Подтвердите звонок, чтобы продолжить'}
                  {step === 3 && 'Задайте новый пароль'}
                </div>
              </div>
            </div>

            {step === 1 && (
              <form
                className="grid gap-4 mt-6"
                onSubmit={(event) => {
                  event.preventDefault()
                  requestBackCall()
                }}
              >
                <label className="grid gap-2 text-sm font-semibold text-[#6b1f2a]">
                  Телефон
                  <InputMask
                    name="phone"
                    type="tel"
                    mask={phoneMask}
                    replacement={phoneReplacement}
                    showMask={phoneFocused}
                    value={maskedValue}
                    onFocus={() => setPhoneFocused(true)}
                    onBlur={() => setPhoneFocused(false)}
                    onChange={handlePhoneChange}
                    placeholder="+7 (___) ___-__-__"
                    className="placeholder:text-gray-400 h-12 rounded-full border border-[rgba(107,31,42,0.2)] bg-white px-4 text-base text-[#2b1b21] shadow-[0_10px_18px_rgba(15,23,42,0.08)] focus:outline-none focus:ring-2 focus:ring-[rgba(141,207,242,0.7)]"
                  />
                </label>
                {errors.phone ? (
                  <div className="text-sm text-[#b4232d]">{errors.phone}</div>
                ) : null}
                {errors.general ? (
                  <div className="text-sm text-[#b4232d]">
                    {errors.general}
                  </div>
                ) : null}
                <button
                  type="submit"
                  disabled={waiting}
                  aria-busy={waiting}
                  className="h-12 rounded-full bg-[linear-gradient(135deg,#6b1f2a,#8a3a45)] text-sm font-semibold uppercase tracking-[0.08em] text-white shadow-[0_14px_30px_rgba(107,31,42,0.25)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(107,31,42,0.32)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8dcff2] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {waiting ? 'Отправляем...' : 'Восстановить пароль'}
                </button>
              </form>
            )}

            {step === 2 && (
              <div className="mt-6 grid gap-4 text-sm text-[#3a2c33]">
                {backCallRes?.status === 'wrong phone' ? (
                  <div className="rounded-2xl border border-[#f0c5c5] bg-white/70 p-4 text-[#7c2a2a]">
                    Похоже, звонок был с другого номера. Проверьте телефон и
                    попробуйте снова.
                  </div>
                ) : null}
                {backCallRes?.status === 'expired' ? (
                  <div className="rounded-2xl border border-[#f0c5c5] bg-white/70 p-4 text-[#7c2a2a]">
                    Вы не успели позвонить. Попробуйте запросить звонок еще раз.
                  </div>
                ) : null}

                {backCallRes?.auth_phone ? (
                  <div className="rounded-2xl border border-[rgba(107,31,42,0.15)] bg-white/80 p-4">
                    <div className="text-sm text-[#5d4a52]">
                      Позвоните по номеру (это бесплатно)
                    </div>
                    <a
                      href={`tel:+${backCallRes.auth_phone}`}
                      className="mt-2 inline-flex text-lg font-semibold text-[#6b1f2a]"
                    >
                      {`+${backCallRes.auth_phone}`}
                    </a>
                  </div>
                ) : null}

                {backCallRes?.url_image ? (
                  <div className="hidden rounded-2xl border border-[rgba(107,31,42,0.15)] bg-white/80 p-4 text-center md:block">
                    <div className="text-xs uppercase tracking-[0.2em] text-[#6b1f2a]">
                      QR-код для звонка
                    </div>
                    <img
                      src={backCallRes.url_image}
                      alt="QR"
                      className="mx-auto mt-3 h-36 w-36"
                    />
                  </div>
                ) : null}

                <div className="rounded-2xl border border-[rgba(107,31,42,0.12)] bg-white/70 p-4 text-sm text-[#5d4a52]">
                  {waiting ? 'Ожидаем подтверждение звонка...' : 'Проверяем звонок.'}
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={requestBackCall}
                    disabled={waiting}
                    className="h-11 rounded-full border border-[rgba(107,31,42,0.2)] bg-white text-xs font-semibold uppercase tracking-[0.08em] text-[#6b1f2a] transition duration-200 hover:-translate-y-0.5 hover:border-[rgba(107,31,42,0.4)] hover:shadow-[0_12px_24px_rgba(107,31,42,0.12)] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    Запросить снова
                  </button>
                  <button
                    type="button"
                    onClick={resetFlow}
                    className="h-11 rounded-full border border-[rgba(107,31,42,0.2)] bg-white text-xs font-semibold uppercase tracking-[0.08em] text-[#6b1f2a] transition duration-200 hover:-translate-y-0.5 hover:border-[rgba(107,31,42,0.4)] hover:shadow-[0_12px_24px_rgba(107,31,42,0.12)]"
                  >
                    Изменить номер
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <form
                className="grid gap-4 mt-6"
                onSubmit={(event) => {
                  event.preventDefault()
                  handleResetPassword()
                }}
              >
                <label className="grid gap-2 text-sm font-semibold text-[#6b1f2a]">
                  Новый пароль
                  <input
                    type="password"
                    placeholder="Введите новый пароль"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="placeholder:text-gray-400 h-12 rounded-full border border-[rgba(107,31,42,0.2)] bg-white px-4 text-base text-[#2b1b21] shadow-[0_10px_18px_rgba(15,23,42,0.08)] focus:outline-none focus:ring-2 focus:ring-[rgba(141,207,242,0.7)]"
                  />
                </label>
                <label className="grid gap-2 text-sm font-semibold text-[#6b1f2a]">
                  Повторите пароль
                  <input
                    type="password"
                    placeholder="Повторите новый пароль"
                    value={passwordRepeat}
                    onChange={(event) => setPasswordRepeat(event.target.value)}
                    className="placeholder:text-gray-400 h-12 rounded-full border border-[rgba(107,31,42,0.2)] bg-white px-4 text-base text-[#2b1b21] shadow-[0_10px_18px_rgba(15,23,42,0.08)] focus:outline-none focus:ring-2 focus:ring-[rgba(141,207,242,0.7)]"
                  />
                </label>
                {errors.password ? (
                  <div className="text-sm text-[#b4232d]">
                    {errors.password}
                  </div>
                ) : null}
                {errors.general ? (
                  <div className="text-sm text-[#b4232d]">
                    {errors.general}
                  </div>
                ) : null}
                <button
                  type="submit"
                  disabled={waiting}
                  aria-busy={waiting}
                  className="h-12 rounded-full bg-[linear-gradient(135deg,#6b1f2a,#8a3a45)] text-sm font-semibold uppercase tracking-[0.08em] text-white shadow-[0_14px_30px_rgba(107,31,42,0.25)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(107,31,42,0.32)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8dcff2] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {waiting ? 'Сохраняем...' : 'Сохранить пароль'}
                </button>
              </form>
            )}

            <div className="mt-6 text-center text-sm text-[#5d4a52]">
              Уже вспомнили пароль?{' '}
              <Link
                href={`/${location}/login`}
                className="font-semibold text-[#6b1f2a]"
              >
                Вернуться к авторизации
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

LocationRecoveryClient.propTypes = {
  location: PropTypes.string.isRequired,
}
