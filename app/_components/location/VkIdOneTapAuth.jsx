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
    String(process.env.NEXT_PUBLIC_VK_ID_APP_ID || '54460590'),
    10
  )
  return Number.isFinite(value) && value > 0 ? value : 54460590
}

const getVkRedirectUrl = () => {
  if (typeof window === 'undefined') return ''
  return (
    process.env.NEXT_PUBLIC_VK_ID_REDIRECT_URL ||
    `${window.location.origin}/api/vk-id/callback`
  )
}

const getVkScope = () => process.env.NEXT_PUBLIC_VK_ID_SCOPE || 'phone email'

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
      try {
        VKID.Config.init({
          app: getVkAppId(),
          redirectUrl: getVkRedirectUrl(),
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
        .on(VKID.WidgetEvents.ERROR, () => {
          onError('Ошибка виджета VK ID')
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
            onError('Не удалось войти через VK ID')
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
