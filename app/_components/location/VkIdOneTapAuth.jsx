'use client'

import PropTypes from 'prop-types'
import { signIn } from 'next-auth/react'
import { useEffect, useRef, useState } from 'react'

const VK_SDK_URL = 'https://unpkg.com/@vkid/sdk@2.6.5/dist-sdk/umd/index.js'

let vkSdkLoadPromise = null

const loadVkSdk = () => {
  if (typeof window === 'undefined') return Promise.resolve(false)
  if (window.VKIDSDK) return Promise.resolve(true)
  if (vkSdkLoadPromise) return vkSdkLoadPromise

  vkSdkLoadPromise = new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = VK_SDK_URL
    script.async = true
    script.onload = () => resolve(Boolean(window.VKIDSDK))
    script.onerror = () => resolve(false)
    document.head.appendChild(script)
  })

  return vkSdkLoadPromise
}

const getVkAppId = () => {
  const value = Number.parseInt(
    String(process.env.NEXT_PUBLIC_VK_ID_APP_ID || ''),
    10
  )
  return Number.isFinite(value) && value > 0 ? value : null
}

const normalizeUrlString = (value) => {
  const raw = String(value || '').trim()
  if (!raw) return ''
  const noQuotes = raw.replace(/^['"]|['"]$/g, '').trim()
  try {
    return new URL(noQuotes).toString()
  } catch {
    return ''
  }
}

const isVkClientDebugEnabled = () =>
  String(process.env.NEXT_PUBLIC_VK_DEBUG_LOGS || '')
    .trim()
    .toLowerCase() === 'true'

const getVkRedirectUrl = () => {
  if (typeof window === 'undefined') return ''
  const envRedirect = process.env.NEXT_PUBLIC_VK_ID_REDIRECT_URI
  return (
    normalizeUrlString(envRedirect) ||
    normalizeUrlString(`${window.location.origin}/api/vk-id/callback`)
  )
}

const getVkScope = () => process.env.NEXT_PUBLIC_VK_ID_SCOPE || 'phone email'

const VK_SIGNIN_ERROR_MESSAGES = {
  VK_BAD_REQUEST: 'Неполные данные для входа через VK ID. Обновите страницу.',
  VK_LOGIN_BLOCKED: 'Вход в выбранном городе сейчас ограничен.',
  VK_AUTH_DISABLED: 'Вход через VK ID временно отключен для этого города.',
  VK_EXCHANGE_FAILED:
    'VK ID временно недоступен. Попробуйте позже или войдите по телефону.',
  VK_USERINFO_FAILED:
    'Не удалось получить профиль VK. Попробуйте позже или войдите по телефону.',
  VK_PROFILE_INVALID: 'Профиль VK ID передан некорректно.',
  VK_SERVER_UNAVAILABLE: 'Сервис авторизации временно недоступен.',
  VK_PHONE_REQUIRED:
    'VK ID не передал номер телефона. Завершите вход через телефон.',
  VK_ACCOUNT_NOT_FOUND:
    'Аккаунт не найден. Зарегистрируйтесь по телефону или через VK с подтверждением.',
  VK_REGISTRATION_BLOCKED: 'Регистрация в выбранном городе сейчас ограничена.',
  VK_AGREEMENTS_REQUIRED:
    'Для регистрации через VK ID подтвердите обязательные согласия.',
  CredentialsSignin:
    'Не удалось завершить вход через VK ID. Попробуйте снова или войдите по телефону.',
}

const mapVkSignInError = (errorCode) =>
  VK_SIGNIN_ERROR_MESSAGES[errorCode] ||
  'Не удалось выполнить вход через VK ID. Попробуйте позже.'

export default function VkIdOneTapAuth({
  location,
  mode = 'auto',
  payload = {},
  onSuccess = () => {},
  onError = () => {},
}) {
  const containerRef = useRef(null)
  const payloadRef = useRef(payload)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    payloadRef.current = payload
  }, [payload])

  useEffect(() => {
    let isMounted = true

    const init = async () => {
      const loaded = await loadVkSdk()
      if (!loaded || !isMounted || !containerRef.current) {
        onError('VK ID недоступен')
        return
      }

      const VKID = window.VKIDSDK
      const appId = getVkAppId()
      const redirectUrl = getVkRedirectUrl()
      if (!appId) {
        onError(
          'VK ID не настроен: отсутствует NEXT_PUBLIC_VK_ID_APP_ID. Обратитесь к разработчику.'
        )
        return
      }
      if (!redirectUrl) {
        onError(
          'VK ID не настроен: некорректный NEXT_PUBLIC_VK_ID_REDIRECT_URI. Обратитесь к разработчику.'
        )
        return
      }
      if (isVkClientDebugEnabled()) {
        console.log('[VK DEBUG CLIENT] init config', {
          appId,
          redirectUrl,
          origin:
            typeof window !== 'undefined' ? window.location.origin : undefined,
        })
      }

      try {
        VKID.Config.init({
          app: appId,
          redirectUrl,
          responseMode: VKID.ConfigResponseMode.Callback,
          source: VKID.ConfigSource.LOWCODE,
          scope: getVkScope(),
        })
      } catch (error) {
        // Config может быть уже инициализирована этим же значением
      }

      const oneTap = new VKID.OneTap()
      oneTap
        .render({
          container: containerRef.current,
          showAlternativeLogin: true,
        })
        .on(VKID.WidgetEvents.ERROR, (error) => {
          const vkError = error?.type || error?.code || error?.message
          onError(
            vkError
              ? `Ошибка виджета VK ID (${vkError}). Попробуйте вход по телефону.`
              : 'Ошибка виджета VK ID. Попробуйте вход по телефону.'
          )
        })
        .on(VKID.OneTapInternalEvents.LOGIN_SUCCESS, async (vkPayload) => {
          if (!isMounted) return
          setIsLoading(true)
          const code = vkPayload?.code
          const deviceId = vkPayload?.device_id
          const state = vkPayload?.state

          if (!code || !deviceId) {
            setIsLoading(false)
            onError('VK ID не вернул код авторизации')
            return
          }

          const result = await signIn('vk', {
            redirect: false,
            code,
            deviceId,
            state,
            location,
            mode,
            ...payloadRef.current,
          })

          setIsLoading(false)
          if (result?.error) {
            onError(mapVkSignInError(result.error))
            return
          }

          onSuccess()
        })
    }

    init()

    return () => {
      isMounted = false
      if (containerRef.current) containerRef.current.innerHTML = ''
    }
  }, [location, mode, onError, onSuccess])

  return (
    <div className="mt-2">
      <div className="mb-2 text-center text-xs uppercase tracking-[0.12em] text-[#6b1f2a]/70">
        {isLoading ? 'Проверяем VK ID...' : 'Войти через VK ID'}
      </div>
      <div ref={containerRef} />
    </div>
  )
}

VkIdOneTapAuth.propTypes = {
  location: PropTypes.string.isRequired,
  mode: PropTypes.oneOf(['login', 'register', 'auto']),
  payload: PropTypes.object,
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
}
