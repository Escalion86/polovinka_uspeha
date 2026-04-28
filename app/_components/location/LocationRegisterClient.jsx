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
import {
  captureAttributionFromBrowser,
  getAttributionPayload,
} from '@helpers/attribution'
import CityAccessLoading from '@components/CityAccessLoading'
import CityAccessUnavailable from '@components/CityAccessUnavailable'
import AuthPageFrame from '@components/AuthPageFrame'
import AuthSplitLayout from '@components/AuthSplitLayout'
import AuthField from '@components/AuthField'
import AuthInput, { AUTH_INPUT_CLASS } from '@components/AuthInput'
import AuthButton from '@components/AuthButton'
import useCityAccess from '@hooks/useCityAccess'
import useVkAuthAvailability from '@hooks/useVkAuthAvailability'
import { isVkAuthClientTestModeEnabled } from '@helpers/vkAuthTestMode'
import {
  GoogleReCaptchaProvider,
  useGoogleReCaptcha,
} from 'react-google-recaptcha-v3'
import VkIdOneTapAuth from './VkIdOneTapAuth'

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

const submitEnquiryForm = (gReCaptchaToken, onSuccess, onError) => {
  fetch('/api/enquiry', {
    method: 'POST',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      gRecaptchaToken: gReCaptchaToken,
    }),
  })
    .then((res) => res.json())
    .then((res) => {
      if (res?.status === 'success') {
        onSuccess()
      } else {
        onError()
      }
    })
}

const defaultErrors = {
  phone: '',
  password: '',
  general: '',
  agreement: '',
}

const Register3Inner = ({ location }) => {
  const router = useRouter()
  const { executeRecaptcha } = useGoogleReCaptcha()
  const [phone, setPhone] = useState('')
  const [phoneFocused, setPhoneFocused] = useState(false)
  const [password, setPassword] = useState('')
  const [passwordRepeat, setPasswordRepeat] = useState('')
  const [errors, setErrors] = useState(defaultErrors)
  const [step, setStep] = useState(1)
  const [waiting, setWaiting] = useState(false)
  const [backCallRes, setBackCallRes] = useState(null)
  const [checkHave18Years, setCheckHave18Years] = useState(false)
  const [checkAgreement, setCheckAgreement] = useState(false)
  const [checkConsentToMailing, setCheckConsentToMailing] = useState(false)
  const {
    accessLoading,
    isAllowed: isRegistrationAllowed,
    currentCityTitle,
    alternativeCities: alternativeRegistrationCities,
  } = useCityAccess({
    location,
    allowField: 'allowRegistration',
    alternativesField: 'availableForRegistration',
  })
  const isVkAuthEnabled =
    useVkAuthAvailability(location) || isVkAuthClientTestModeEnabled()
  const pollTimerRef = useRef(null)

  const { phoneMask, phoneReplacement, maskedValue } = useMemo(
    () => buildMaskedPhone(phone, phoneFocused),
    [phone, phoneFocused]
  )

  const referralId = useMemo(() => {
    const value = router.query?.ref ?? router.query?.referrer
    if (Array.isArray(value)) return value[0]
    return typeof value === 'string' ? value : undefined
  }, [router.query])
  const targetEventId = useMemo(() => {
    const value = router.query?.event
    if (Array.isArray(value)) return value[0]
    return typeof value === 'string' ? value : undefined
  }, [router.query])
  const vkAttributionJson = useMemo(() => {
    const payload = getAttributionPayload()
    return payload ? JSON.stringify(payload) : ''
  }, [])

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

    if (!isRegistrationAllowed) {
      setErrors({
        ...defaultErrors,
        general: `Регистрация в городе ${currentCityTitle || location} временно приостановлена`,
      })
      return
    }

    const normalizedPhone = normalizePhoneValue(phone)

    if (!normalizedPhone || !phoneValidator(normalizedPhone)) {
      setErrors({ ...defaultErrors, phone: 'Введите корректный номер телефона' })
      return
    }

    if (!checkHave18Years || !checkAgreement) {
      setErrors({
        ...defaultErrors,
        agreement: 'Подтвердите обязательные согласия',
      })
      return
    }

    if (!executeRecaptcha) {
      setErrors({
        ...defaultErrors,
        general: 'Система проверки недоступна. Попробуйте позже.',
      })
      return
    }

    setWaiting(true)
    executeRecaptcha('enquiryFormSubmit').then((gReCaptchaToken) => {
      submitEnquiryForm(
        gReCaptchaToken,
        async () => {
          const res = await postData(
            '/api/telefonip',
            {
              phone: normalizedPhone,
              location,
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
        },
        () => {
          setWaiting(false)
          setErrors({
            ...defaultErrors,
            general: 'Похоже что вы робот, сработала защита от спама.',
          })
        }
      )
    })
  }, [
    isRegistrationAllowed,
    currentCityTitle,
    checkAgreement,
    checkHave18Years,
    clearErrors,
    executeRecaptcha,
    location,
    phone,
    startPolling,
  ])

  const handleRegister = useCallback(async () => {
    clearErrors()

    if (!isRegistrationAllowed) {
      setErrors({
        ...defaultErrors,
        general: `Регистрация в городе ${currentCityTitle || location} временно приостановлена`,
      })
      return
    }

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
    const attribution = getAttributionPayload()
    const res = await postData(
      '/api/telefonip',
      {
        phone: normalizedPhone,
        password,
        location,
        referrerId: referralId,
        consentToMailing: checkConsentToMailing,
        attribution,
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
        general: 'Не удалось завершить регистрацию. Попробуйте позже.',
      })
      return
    }

    if (res?.error) {
      setWaiting(false)
      setErrors({ ...defaultErrors, general: res.error.message })
      return
    }

    if (targetEventId) {
      router.push(`/${location}/login?event=${targetEventId}`)
      return
    }
    router.push(`/${location}/login`)
  }, [
    isRegistrationAllowed,
    currentCityTitle,
    checkConsentToMailing,
    clearErrors,
    location,
    password,
    passwordRepeat,
    phone,
    referralId,
    router,
    targetEventId,
  ])

  const resetFlow = useCallback(() => {
    stopPolling()
    setWaiting(false)
    setBackCallRes(null)
    setStep(1)
    setErrors(defaultErrors)
  }, [stopPolling])

  if (accessLoading) {
    return (
      <AuthPageFrame>
        <CityAccessLoading message="Проверяем доступность регистрации..." />
      </AuthPageFrame>
    )
  }

  if (!isRegistrationAllowed) {
    return (
      <AuthPageFrame>
        <CityAccessUnavailable
          heading="Регистрация приостановлена"
          description="регистрация временно приостановлена. Вы можете зарегистрироваться в другом городе, где регистрация сейчас открыта."
          cityTitle={currentCityTitle}
          location={location}
          cities={alternativeRegistrationCities}
          buildCityHref={(slug) => `/${slug}/register`}
          emptyMessage="Сейчас нет других публичных городов с открытой регистрацией."
        />
      </AuthPageFrame>
    )
  }

  return (
    <AuthSplitLayout
      leftPanel={
        <>
            <h1 className="font-bold font-lora text-[clamp(28px,3vw,44px)] leading-tight text-[#2b1b21]">
              Создайте аккаунт для живых встреч
            </h1>
            <p className="max-w-[520px] text-[16px] leading-relaxed text-[#3a2c33]">
              Подтвердите номер телефона и задайте пароль, чтобы начать
              участвовать в событиях.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-[rgba(107,31,42,0.15)] bg-white/80 p-4 shadow-[0_12px_24px_rgba(0,0,0,0.06)]">
                <div className="text-sm font-semibold text-[#6b1f2a]">
                  Защищено
                </div>
                <div className="mt-2 text-sm text-[#3a2c33]">
                  Подтверждение по звонку защищает аккаунт.
                </div>
              </div>
              <div className="rounded-2xl border border-[rgba(107,31,42,0.15)] bg-white/80 p-4 shadow-[0_12px_24px_rgba(0,0,0,0.06)]">
                <div className="text-sm font-semibold text-[#6b1f2a]">
                  Быстро
                </div>
                <div className="mt-2 text-sm text-[#3a2c33]">
                  Регистрация занимает всего пару минут.
                </div>
              </div>
            </div>
        </>
      }
      rightClassName="w-full max-w-[460px] justify-self-center rounded-[28px] border border-[rgba(107,31,42,0.12)] bg-white/25 p-8 shadow-[0_24px_48px_rgba(15,23,42,0.15)] backdrop-blur"
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
                  Регистрация
                </div>
                <div className="text-sm text-[#5d4a52]">
                  {step === 1 && 'Введите телефон и согласия'}
                  {step === 2 && 'Подтвердите звонок'}
                  {step === 3 && 'Создайте пароль'}
                </div>
              </div>
            </div>

            {step === 1 && (
              <>
                {isVkAuthEnabled ? (
                  <div className="grid gap-2 mt-6">
                    {checkHave18Years && checkAgreement ? (
                      <VkIdOneTapAuth
                        location={location}
                        mode="register"
                        payload={{
                          referrerId: referralId,
                          consentToMailing: checkConsentToMailing,
                          isAdultConfirmed: checkHave18Years,
                          personalDataAgreementAccepted: checkAgreement,
                          attribution: vkAttributionJson,
                        }}
                        onSuccess={() => {
                          if (targetEventId) {
                            router.push(
                              `/${location}/cabinet/eventsCalendar?event=${targetEventId}`
                            )
                            return
                          }
                          router.push(`/${location}/cabinet`)
                        }}
                        onError={(message) => {
                          setErrors({
                            ...defaultErrors,
                            general: message || 'Не удалось выполнить вход через VK ID',
                          })
                        }}
                      />
                    ) : (
                      <div className="rounded-2xl border border-[rgba(107,31,42,0.15)] bg-white/70 px-4 py-3 text-xs text-[#5d4a52]">
                        Для входа через VK ID сначала подтвердите 18+ и согласие
                        на обработку персональных данных.
                      </div>
                    )}
                    <div className="text-center text-xs uppercase tracking-[0.1em] text-[#6b1f2a]/55">
                      или зарегистрируйтесь по номеру телефона
                    </div>
                    <div className="-mt-2 text-center text-[11px] leading-relaxed text-[#5d4a52]">
                      Регистрация через VK ID доступна только после подтверждения
                      обязательных согласий.
                    </div>
                  </div>
                ) : null}

                <form
                  className="grid gap-4 mt-4"
                  onSubmit={(event) => {
                    event.preventDefault()
                    requestBackCall()
                  }}
                >

                <AuthField label="Телефон">
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
                    className={AUTH_INPUT_CLASS}
                  />
                </AuthField>

                <div className="grid gap-2 text-sm text-[#3a2c33]">
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={checkHave18Years}
                      onChange={() => setCheckHave18Years((prev) => !prev)}
                      className="mt-1 h-4 w-4 accent-[#6b1f2a]"
                    />
                    <span>
                      <span className="text-[#b4232d]">*</span> Мне исполнилось
                      18 лет
                    </span>
                  </label>
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={checkAgreement}
                      onChange={() => setCheckAgreement((prev) => !prev)}
                      className="mt-1 h-4 w-4 accent-[#6b1f2a]"
                    />
                    <span>
                      <span className="text-[#b4232d]">*</span> Согласен на
                      {' '}
                      <Link
                        href="/legal/personal-data-consent"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold underline text-[#6b1f2a] hover:text-[#8b2a38]"
                      >
                        обработку персональных данных
                      </Link>
                      {' '}и с{' '}
                      <Link
                        href="/docs/politika.docx"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold underline text-[#6b1f2a] hover:text-[#8b2a38]"
                      >
                        политикой конфиденциальности
                      </Link>
                      {' '} (включая данные из VK ID при входе через VK)
                    </span>
                  </label>
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={checkConsentToMailing}
                      onChange={() =>
                        setCheckConsentToMailing((prev) => !prev)
                      }
                      className="mt-1 h-4 w-4 accent-[#6b1f2a]"
                    />
                    <span>Согласен получать рассылку о мероприятиях</span>
                  </label>
                </div>

                {errors.phone ? (
                  <div className="text-sm text-[#b4232d]">{errors.phone}</div>
                ) : null}
                {errors.agreement ? (
                  <div className="text-sm text-[#b4232d]">
                    {errors.agreement}
                  </div>
                ) : null}
                {errors.general ? (
                  <div className="text-sm text-[#b4232d]">
                    {errors.general}
                  </div>
                ) : null}
                  <AuthButton
                    type="submit"
                    disabled={waiting}
                    aria-busy={waiting}
                  >
                    {waiting ? 'Отправляем...' : 'Продолжить регистрацию'}
                  </AuthButton>
                </form>
              </>
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
                  <AuthButton
                    type="button"
                    onClick={requestBackCall}
                    disabled={waiting}
                    variant="secondary"
                    size="sm"
                  >
                    Запросить снова
                  </AuthButton>
                  <AuthButton
                    type="button"
                    onClick={resetFlow}
                    variant="secondary"
                    size="sm"
                  >
                    Изменить номер
                  </AuthButton>
                </div>
              </div>
            )}

            {step === 3 && (
              <form
                className="grid gap-4 mt-6"
                onSubmit={(event) => {
                  event.preventDefault()
                  handleRegister()
                }}
              >
                <AuthField label="Пароль">
                  <AuthInput
                    type="password"
                    placeholder="Введите пароль"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                </AuthField>
                <AuthField label="Повторите пароль">
                  <AuthInput
                    type="password"
                    placeholder="Повторите пароль"
                    value={passwordRepeat}
                    onChange={(event) => setPasswordRepeat(event.target.value)}
                  />
                </AuthField>
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
                <AuthButton
                  type="submit"
                  disabled={waiting}
                  aria-busy={waiting}
                >
                  {waiting ? 'Сохраняем...' : 'Завершить регистрацию'}
                </AuthButton>
              </form>
            )}

            <div className="mt-6 text-center text-sm text-[#5d4a52]">
              Уже есть аккаунт?{' '}
              <Link
                href={`/${location}/login`}
                className="font-semibold text-[#6b1f2a]"
              >
                Войти в пространство
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

Register3Inner.propTypes = {
  location: PropTypes.string.isRequired,
}

const LocationRegisterClient = ({ location }) => (
  <GoogleReCaptchaProvider
    reCaptchaKey="6Lcw5bwkAAAAAD1qgHYKcEzcbdATVfdI3lIiO5X2"
    scriptProps={{
      async: false,
      defer: false,
      appendTo: 'body',
      nonce: undefined,
    }}
  >
    <Register3Inner location={location} />
  </GoogleReCaptchaProvider>
)

LocationRegisterClient.propTypes = {
  location: PropTypes.string.isRequired,
}

export default LocationRegisterClient
